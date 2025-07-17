// SYNAPSE - Command Parser
// Handles natural language command parsing and interpretation

class CommandParser {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.commandHistory = [];
        this.historyIndex = -1;
        this.aliases = this.initializeAliases();
        this.patterns = this.initializePatterns();
        
        console.log('💬 Command Parser initialized');
    }
    
    // Initialize command aliases
    initializeAliases() {
        return {
            // Movement aliases
            'n': 'north',
            'no': 'north',
            's': 'south',
            'so': 'south',
            'e': 'east',
            'ea': 'east',
            'w': 'west',
            'we': 'west',
            'u': 'up',
            'd': 'down',
            'ne': 'northeast',
            'nw': 'northwest',
            'se': 'southeast',
            'sw': 'southwest',
            
            // Action aliases
            'l': 'look',
            'ex': 'examine',
            'x': 'examine',
            'get': 'take',
            'pick': 'take',
            'pickup': 'take',
            'inv': 'inventory',
            'i': 'inventory',
            'stats': 'status',
            'st': 'status',
            
            // Communication aliases
            'speak': 'talk',
            'say': 'talk',
            'tell': 'talk',
            'ask': 'question',
            'query': 'question',
            
            // System aliases
            'quit': 'exit',
            'q': 'exit',
            'help': 'commands',
            'h': 'help'
        };
    }
    
    // Initialize command patterns for natural language processing
    initializePatterns() {
        return {
            // Movement patterns
            movement: [
                /^(go|move|walk|head|travel)\s+(to\s+)?(the\s+)?(.+)$/i,
                /^(north|south|east|west|up|down|northeast|northwest|southeast|southwest)$/i,
                /^(enter|exit|leave)\s+(the\s+)?(.+)$/i
            ],
            
            // Examination patterns
            examine: [
                /^(look|examine|inspect|check|view)\s+(at\s+)?(the\s+)?(.+)$/i,
                /^(what\s+is|describe|tell\s+me\s+about)\s+(the\s+)?(.+)$/i
            ],
            
            // Interaction patterns
            take: [
                /^(take|get|pick\s+up|grab|collect)\s+(the\s+)?(.+)$/i,
                /^(put|place|drop)\s+(the\s+)?(.+)\s+(in|on|into)\s+(the\s+)?(.+)$/i
            ],
            
            // Use patterns
            use: [
                /^(use|activate|operate|trigger)\s+(the\s+)?(.+)$/i,
                /^(use|combine)\s+(the\s+)?(.+)\s+(with|on)\s+(the\s+)?(.+)$/i
            ],
            
            // Communication patterns
            talk: [
                /^(talk\s+to|speak\s+to|communicate\s+with|address)\s+(the\s+)?(.+)$/i,
                /^(say|tell|ask)\s+(.+)$/i,
                /^(question|ask\s+about|inquire\s+about)\s+(.+)$/i
            ],
            
            // System patterns
            system: [
                /^(save|load|quit|exit|help|commands|status|inventory)$/i,
                /^(show|display|open)\s+(inventory|status|map|achievements)$/i
            ],
            
            // AI-specific patterns
            ai_interaction: [
                /^(ai|system|computer|synapse)[,:]\s*(.+)$/i,
                /^(hello|hi|hey)\s+(ai|system|computer|synapse)$/i,
                /^(what\s+are\s+you|who\s+are\s+you|identify\s+yourself)$/i
            ]
        };
    }
    
    // Parse a command string
    parseCommand(input) {
        if (!input || typeof input !== 'string') {
            return { error: 'Invalid input' };
        }
        
        // Normalize input
        const normalizedInput = this.normalizeInput(input);
        
        // Add to history
        this.addToHistory(normalizedInput);
        
        // Try to parse as natural language
        const parsed = this.parseNaturalLanguage(normalizedInput);
        if (parsed) {
            return parsed;
        }
        
        // Fall back to simple command parsing
        return this.parseSimpleCommand(normalizedInput);
    }
    
    // Normalize input text
    normalizeInput(input) {
        return input.trim().toLowerCase();
    }
    
    // Parse natural language commands
    parseNaturalLanguage(input) {
        // Check each pattern category
        for (const [category, patterns] of Object.entries(this.patterns)) {
            for (const pattern of patterns) {
                const match = input.match(pattern);
                if (match) {
                    return this.processPatternMatch(category, match, input);
                }
            }
        }
        
        return null;
    }
    
    // Process a matched pattern
    processPatternMatch(category, match, originalInput) {
        switch (category) {
            case 'movement':
                return this.parseMovement(match, originalInput);
            case 'examine':
                return this.parseExamine(match);
            case 'take':
                return this.parseTake(match);
            case 'use':
                return this.parseUse(match);
            case 'talk':
                return this.parseTalk(match);
            case 'system':
                return this.parseSystem(match);
            case 'ai_interaction':
                return this.parseAIInteraction(match);
            default:
                return null;
        }
    }
    
    // Parse movement commands
    parseMovement(match, originalInput) {
        if (match[4]) {
            // "go to the room" format
            return {
                action: 'move',
                target: match[4],
                direction: this.getDirectionFromTarget(match[4])
            };
        } else if (match[0]) {
            // Direct direction command
            return {
                action: 'move',
                direction: match[0]
            };
        } else if (match[3]) {
            // "enter the room" format
            return {
                action: 'move',
                target: match[3],
                verb: match[1]
            };
        }
        
        return null;
    }
    
    // Parse examine commands
    parseExamine(match) {
        const target = match[4] || match[3];
        return {
            action: 'examine',
            target: target,
            verb: match[1]
        };
    }
    
    // Parse take/drop commands
    parseTake(match) {
        if (match[6]) {
            // "put item in container" format
            return {
                action: 'place',
                item: match[3],
                container: match[6],
                preposition: match[5]
            };
        } else {
            // "take item" format
            return {
                action: 'take',
                target: match[3],
                verb: match[1]
            };
        }
    }
    
    // Parse use commands
    parseUse(match) {
        if (match[6]) {
            // "use item with target" format
            return {
                action: 'combine',
                item1: match[3],
                item2: match[6],
                preposition: match[5]
            };
        } else {
            // "use item" format
            return {
                action: 'use',
                target: match[3],
                verb: match[1]
            };
        }
    }
    
    // Parse talk commands
    parseTalk(match) {
        if (match[3]) {
            // "talk to person" format
            return {
                action: 'talk',
                target: match[3],
                verb: match[1]
            };
        } else {
            // "say something" format
            return {
                action: 'say',
                message: match[2],
                verb: match[1]
            };
        }
    }
    
    // Parse system commands
    parseSystem(match) {
        const command = match[0] || match[2];
        return {
            action: 'system',
            command: command
        };
    }
    
    // Parse AI interaction commands
    parseAIInteraction(match) {
        if (match[2]) {
            // "AI: message" format
            return {
                action: 'ai_talk',
                message: match[2]
            };
        } else {
            // "hello AI" format
            return {
                action: 'ai_greet'
            };
        }
    }
    
    // Parse simple commands (fallback)
    parseSimpleCommand(input) {
        const words = input.split(/\s+/);
        const command = this.aliases[words[0]] || words[0];
        const args = words.slice(1);
        
        return {
            action: command,
            args: args,
            raw: input
        };
    }
    
    // Get direction from target description
    getDirectionFromTarget(target) {
        const directionMap = {
            'north': 'north',
            'south': 'south',
            'east': 'east',
            'west': 'west',
            'up': 'up',
            'down': 'down',
            'stairs': 'up',
            'elevator': 'up',
            'exit': 'out',
            'door': 'through'
        };
        
        for (const [key, direction] of Object.entries(directionMap)) {
            if (target.includes(key)) {
                return direction;
            }
        }
        
        return null;
    }
    
    // Add command to history
    addToHistory(command) {
        if (command && command !== this.commandHistory[this.commandHistory.length - 1]) {
            this.commandHistory.push(command);
            if (this.commandHistory.length > 50) {
                this.commandHistory.shift();
            }
        }
        this.historyIndex = this.commandHistory.length;
    }
    
    // Get previous command from history
    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.commandHistory[this.historyIndex];
        }
        return null;
    }
    
    // Get next command from history
    getNextCommand() {
        if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            return this.commandHistory[this.historyIndex];
        } else if (this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex++;
            return '';
        }
        return null;
    }
    
    // Get command suggestions based on current input
    getCommandSuggestions(partialInput) {
        if (!partialInput || partialInput.length < 2) {
            return [];
        }
        
        const suggestions = [];
        const input = partialInput.toLowerCase();
        
        // Check common commands
        const commonCommands = [
            'look', 'examine', 'take', 'use', 'talk', 'go', 'move',
            'inventory', 'status', 'help', 'save', 'load',
            'north', 'south', 'east', 'west', 'up', 'down'
        ];
        
        commonCommands.forEach(cmd => {
            if (cmd.startsWith(input)) {
                suggestions.push(cmd);
            }
        });
        
        // Check command history
        this.commandHistory.forEach(cmd => {
            if (cmd.startsWith(input) && !suggestions.includes(cmd)) {
                suggestions.push(cmd);
            }
        });
        
        return suggestions.slice(0, 5); // Limit to 5 suggestions
    }
    
    // Validate command
    validateCommand(parsedCommand) {
        if (!parsedCommand || !parsedCommand.action) {
            return { valid: false, error: 'No action specified' };
        }
        
        // Check if action is recognized
        const validActions = [
            'move', 'examine', 'take', 'use', 'talk', 'say',
            'combine', 'place', 'system', 'ai_talk', 'ai_greet'
        ];
        
        if (!validActions.includes(parsedCommand.action)) {
            return { valid: false, error: 'Unknown command' };
        }
        
        return { valid: true };
    }
    
    // Get help text for commands
    getHelpText() {
        return `Available Commands:
        
Movement:
- go/move [direction] - Move in a direction (north, south, east, west, up, down)
- enter/exit [location] - Enter or leave a specific location

Interaction:
- look/examine [item/area] - Examine something closely
- take/get [item] - Pick up an item
- use [item] - Use an item
- use [item] with [item] - Combine or use items together

Communication:
- talk to [person/AI] - Start a conversation
- say [message] - Speak aloud
- ask about [topic] - Ask a question

System:
- inventory/i - Show your items
- status/stats - Show your current condition
- save - Save the game
- load - Load a saved game
- help - Show this help text
- quit - Exit the game

AI Commands:
- AI: [message] - Direct message to the AI
- hello AI - Greet the AI system

You can use natural language for most commands. For example:
"examine the computer terminal" or "use the keycard on the door"`;
    }
}

// Export for use in other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommandParser;
}
