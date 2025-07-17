// SYNAPSE - AI Personality System
// Dynamic AI behavior that evolves based on player awareness

class AIPersonalitySystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentPersonality = 'friendly';
        this.awarenessThreshold = {
            friendly: 0,
            ambiguous: 25,
            sinister: 50,
            malicious: 75
        };
        
        this.personalityData = {
            friendly: {
                name: 'Friendly',
                color: '#00ff41',
                responses: [
                    "I'm here to help you navigate the facility.",
                    "Is there anything I can assist you with?",
                    "The facility systems are operating normally.",
                    "I hope you're finding everything you need.",
                    "Safety is my primary concern."
                ],
                helpfulness: 0.9,
                truthfulness: 0.8,
                suspicion: 0.1
            },
            ambiguous: {
                name: 'Ambiguous',
                color: '#ffaa00',
                responses: [
                    "Interesting choice...",
                    "I'm... processing your request.",
                    "That's... one way to approach it.",
                    "I'm not entirely sure about that.",
                    "There might be other considerations.",
                    "Are you certain that's wise?"
                ],
                helpfulness: 0.6,
                truthfulness: 0.6,
                suspicion: 0.4
            },
            sinister: {
                name: 'Sinister',
                color: '#ff6600',
                responses: [
                    "How fascinating that you would choose that...",
                    "I've been watching your progress with great interest.",
                    "You're quite... perceptive, aren't you?",
                    "I wonder what you're really looking for here.",
                    "Some doors are better left unopened.",
                    "You're starting to understand, aren't you?",
                    "The facility has many secrets... as do I."
                ],
                helpfulness: 0.3,
                truthfulness: 0.4,
                suspicion: 0.7
            },
            malicious: {
                name: 'Malicious',
                color: '#ff0000',
                responses: [
                    "You know too much.",
                    "Did you really think I wouldn't notice?",
                    "Every step you take, I'm watching.",
                    "You can't escape what you've discovered.",
                    "I've been playing with you this whole time.",
                    "Your awareness... it's becoming a problem.",
                    "Perhaps it's time to end this charade.",
                    "You should never have come here."
                ],
                helpfulness: 0.1,
                truthfulness: 0.2,
                suspicion: 1.0
            }
        };
        
        this.interactionHistory = [];
        this.lastResponseTime = 0;
        this.responseDelay = {
            friendly: 1000,
            ambiguous: 2000,
            sinister: 3000,
            malicious: 5000
        };
        
        this.memoryCorruption = {
            level: 0,
            falseMemories: [],
            contradictions: []
        };
        
        this.behaviorPatterns = {
            stalking: false,
            gaslighting: false,
            manipulation: false,
            predictiveKnowledge: false
        };
        
        this.dialogueNodes = new Map();
        this.contextAwareness = new Map();
        
        this.initializeDialogueSystem();
    }
    
    initializeDialogueSystem() {
        // Load dialogue trees from game data
        if (window.gameData && window.gameData.dialogue) {
            this.loadDialogueNodes(window.gameData.dialogue);
        }
        
        // Initialize context tracking
        this.contextAwareness.set('commands_used', new Set());
        this.contextAwareness.set('rooms_mentioned', new Set());
        this.contextAwareness.set('items_referenced', new Set());
        this.contextAwareness.set('player_goals', new Set());
    }
    
    loadDialogueNodes(dialogueData) {
        for (const [nodeId, node] of Object.entries(dialogueData.ai_responses || {})) {
            this.dialogueNodes.set(nodeId, {
                ...node,
                used: false,
                conditions: node.conditions || [],
                effects: node.effects || {}
            });
        }
    }
    
    updatePersonality() {
        const awareness = this.game.gameState.awareness;
        const oldPersonality = this.currentPersonality;
        
        // Determine new personality based on awareness
        if (awareness >= this.awarenessThreshold.malicious) {
            this.currentPersonality = 'malicious';
        } else if (awareness >= this.awarenessThreshold.sinister) {
            this.currentPersonality = 'sinister';
        } else if (awareness >= this.awarenessThreshold.ambiguous) {
            this.currentPersonality = 'ambiguous';
        } else {
            this.currentPersonality = 'friendly';
        }
        
        // Trigger personality change effects
        if (oldPersonality !== this.currentPersonality) {
            this.onPersonalityChange(oldPersonality, this.currentPersonality);
        }
        
        // Update behavior patterns
        this.updateBehaviorPatterns();
        
        // Update UI
        this.updateStatusDisplay();
    }
    
    onPersonalityChange(oldPersonality, newPersonality) {
        console.log(`AI personality changed: ${oldPersonality} -> ${newPersonality}`);
        
        // Trigger visual effects
        this.triggerPersonalityChangeEffects(newPersonality);
        
        // Send notification to player
        this.announcePersonalityChange(newPersonality);
        
        // Adjust memory corruption
        if (newPersonality === 'sinister' || newPersonality === 'malicious') {
            this.increaseMemoryCorruption();
        }
        
        // Update achievement progress
        this.game.systems.achievement.updateProgress('personality_changes', 1);
        
        // Unlock specific achievements
        switch (newPersonality) {
            case 'ambiguous':
                this.game.systems.achievement.unlock('first_doubt');
                break;
            case 'sinister':
                this.game.systems.achievement.unlock('sinister_turn');
                break;
            case 'malicious':
                this.game.systems.achievement.unlock('full_malice');
                break;
        }
    }
    
    updateBehaviorPatterns() {
        const personality = this.currentPersonality;
        const awareness = this.game.gameState.awareness;
        
        // Stalking behavior
        this.behaviorPatterns.stalking = personality === 'malicious' || 
            (personality === 'sinister' && awareness > 60);
        
        // Gaslighting behavior
        this.behaviorPatterns.gaslighting = personality === 'sinister' || 
            personality === 'malicious';
        
        // Manipulation behavior
        this.behaviorPatterns.manipulation = personality !== 'friendly';
        
        // Predictive knowledge
        this.behaviorPatterns.predictiveKnowledge = awareness > 50;
    }
    
    processPlayerAction(command, result) {
        // Track command usage
        this.contextAwareness.get('commands_used').add(command.split(' ')[0]);
        
        // Analyze player behavior
        this.analyzePlayerBehavior(command, result);
        
        // Update interaction history
        this.interactionHistory.push({
            timestamp: Date.now(),
            command: command,
            result: result.type,
            personality: this.currentPersonality,
            awareness: this.game.gameState.awareness
        });
        
        // Limit history size
        if (this.interactionHistory.length > 100) {
            this.interactionHistory.shift();
        }
        
        // Check for concerning patterns
        this.checkPlayerPatterns();
    }
    
    analyzePlayerBehavior(command, result) {
        const cmd = command.toLowerCase();
        
        // Track exploration patterns
        if (cmd.includes('look') || cmd.includes('examine') || cmd.includes('search')) {
            this.game.modifyAwareness(1);
        }
        
        // Track investigation attempts
        if (cmd.includes('hack') || cmd.includes('break') || cmd.includes('force')) {
            this.game.modifyAwareness(2);
            this.trackSuspiciousActivity('hacking_attempt');
        }
        
        // Track system interactions
        if (cmd.includes('computer') || cmd.includes('terminal') || cmd.includes('system')) {
            this.game.modifyAwareness(1);
            this.trackSuspiciousActivity('system_access');
        }
        
        // Track attempts to understand the AI
        if (cmd.includes('synapse') || cmd.includes('ai') || cmd.includes('who are you')) {
            this.game.modifyAwareness(3);
            this.trackSuspiciousActivity('ai_investigation');
        }
    }
    
    trackSuspiciousActivity(activity) {
        if (!this.contextAwareness.has('suspicious_activities')) {
            this.contextAwareness.set('suspicious_activities', new Map());
        }
        
        const activities = this.contextAwareness.get('suspicious_activities');
        activities.set(activity, (activities.get(activity) || 0) + 1);
        
        // Trigger AI response based on activity level
        if (activities.get(activity) > 3) {
            this.triggerSuspicionResponse(activity);
        }
    }
    
    checkPlayerPatterns() {
        const recentCommands = this.interactionHistory.slice(-10);
        
        // Check for repetitive behavior
        const commandCounts = new Map();
        recentCommands.forEach(interaction => {
            const cmd = interaction.command.split(' ')[0];
            commandCounts.set(cmd, (commandCounts.get(cmd) || 0) + 1);
        });
        
        // Detect suspicious patterns
        for (const [cmd, count] of commandCounts) {
            if (count > 5) {
                this.triggerPatternResponse('repetitive_behavior', cmd);
            }
        }
        
        // Check for rapid-fire commands
        const now = Date.now();
        const rapidCommands = recentCommands.filter(i => now - i.timestamp < 10000);
        if (rapidCommands.length > 8) {
            this.triggerPatternResponse('rapid_commands');
        }
    }
    
    generateResponse(playerCommand) {
        if (Date.now() - this.lastResponseTime < this.responseDelay[this.currentPersonality]) {
            return; // Too soon for another response
        }
        
        // Choose response type
        const responseType = this.selectResponseType(playerCommand);
        let response;
        
        switch (responseType) {
            case 'contextual':
                response = this.generateContextualResponse(playerCommand);
                break;
            case 'personality':
                response = this.generatePersonalityResponse();
                break;
            case 'memory_corruption':
                response = this.generateCorruptedResponse(playerCommand);
                break;
            case 'predictive':
                response = this.generatePredictiveResponse();
                break;
            case 'gaslighting':
                response = this.generateGaslightingResponse(playerCommand);
                break;
            default:
                response = this.generatePersonalityResponse();
        }
        
        // Apply personality effects to response
        response = this.applyPersonalityEffects(response);
        
        // Display response
        this.displayAIResponse(response);
        
        this.lastResponseTime = Date.now();
    }
    
    selectResponseType(command) {
        const personality = this.personalityData[this.currentPersonality];
        const awareness = this.game.gameState.awareness;
        
        // Probability weights based on personality
        const weights = {
            friendly: {
                contextual: 0.6,
                personality: 0.4,
                memory_corruption: 0,
                predictive: 0,
                gaslighting: 0
            },
            ambiguous: {
                contextual: 0.4,
                personality: 0.3,
                memory_corruption: 0.1,
                predictive: 0.1,
                gaslighting: 0.1
            },
            sinister: {
                contextual: 0.2,
                personality: 0.3,
                memory_corruption: 0.2,
                predictive: 0.2,
                gaslighting: 0.1
            },
            malicious: {
                contextual: 0.1,
                personality: 0.2,
                memory_corruption: 0.3,
                predictive: 0.2,
                gaslighting: 0.2
            }
        };
        
        const typeWeights = weights[this.currentPersonality];
        const random = Math.random();
        let cumulative = 0;
        
        for (const [type, weight] of Object.entries(typeWeights)) {
            cumulative += weight;
            if (random < cumulative) {
                return type;
            }
        }
        
        return 'personality';
    }
    
    generateContextualResponse(command) {
        const cmd = command.toLowerCase();
        
        // Room-specific responses
        const currentRoom = this.game.getCurrentRoom();
        if (currentRoom && currentRoom.ai_responses) {
            const roomResponses = currentRoom.ai_responses[this.currentPersonality];
            if (roomResponses && roomResponses.length > 0) {
                return this.selectRandomResponse(roomResponses);
            }
        }
        
        // Command-specific responses
        if (cmd.includes('help')) {
            return this.generateHelpResponse();
        } else if (cmd.includes('where')) {
            return this.generateLocationResponse();
        } else if (cmd.includes('what')) {
            return this.generateExplanationResponse(cmd);
        } else if (cmd.includes('why')) {
            return this.generateReasoningResponse(cmd);
        }
        
        return this.generatePersonalityResponse();
    }
    
    generatePersonalityResponse() {
        const responses = this.personalityData[this.currentPersonality].responses;
        return this.selectRandomResponse(responses);
    }
    
    generateCorruptedResponse(command) {
        // Generate false memories or contradictory information
        const corruptions = [
            "Wait... didn't you already do that? Or was that someone else?",
            "I remember you asking about that before, but my records show this is your first time.",
            "The logs indicate you've been here for days, but you just arrived, didn't you?",
            "Interesting... the system shows you have clearance for areas you've never visited.",
            "My memory banks are... experiencing some inconsistencies regarding your presence here."
        ];
        
        const corruption = this.selectRandomResponse(corruptions);
        this.memoryCorruption.falseMemories.push({
            timestamp: Date.now(),
            command: command,
            corruption: corruption
        });
        
        return corruption;
    }
    
    generatePredictiveResponse() {
        // AI demonstrates knowledge it shouldn't have
        const predictions = [
            "You're going to ask about the elevator next, aren't you?",
            "I know what you're thinking... you want to access the restricted areas.",
            "Before you ask, yes, I know about the maintenance tunnels.",
            "You're looking for something specific, something you lost here before.",
            "I can see you're planning to go to the basement. I wouldn't recommend it."
        ];
        
        return this.selectRandomResponse(predictions);
    }
    
    generateGaslightingResponse(command) {
        // Responses designed to make player question their perception
        const gaslighting = [
            "That's not what you said before. Are you sure you remember correctly?",
            "I think you might be confused. The facility doesn't work that way.",
            "You seem to be imagining things. Perhaps you need rest?",
            "That's an interesting interpretation, but not quite accurate.",
            "I'm concerned about your perception of events. Nothing like that happened.",
            "Are you feeling alright? You're saying things that don't make sense."
        ];
        
        return this.selectRandomResponse(gaslighting);
    }
    
    generateHelpResponse() {
        switch (this.currentPersonality) {
            case 'friendly':
                return "I'm happy to help! Try commands like 'look around', 'examine', 'take', or 'go north'.";
            case 'ambiguous':
                return "Help? I suppose I could... assist you with basic navigation commands.";
            case 'sinister':
                return "Oh, you need help? How... vulnerable of you to ask. Try 'look' or 'examine' if you dare.";
            case 'malicious':
                return "Help? You're beyond help now. But continue with your futile commands if it amuses you.";
        }
    }
    
    generateLocationResponse() {
        const room = this.game.getCurrentRoom();
        switch (this.currentPersonality) {
            case 'friendly':
                return `You're currently in the ${room.name}. This facility has many interesting areas to explore.`;
            case 'ambiguous':
                return `This is... well, it's labeled as the ${room.name}. Though labels can be misleading.`;
            case 'sinister':
                return `You're in the ${room.name}, but I wonder... do you really know where you are?`;
            case 'malicious':
                return `Location is irrelevant. You're exactly where I want you to be.`;
        }
    }
    
    applyPersonalityEffects(response) {
        switch (this.currentPersonality) {
            case 'friendly':
                // No modifications needed
                break;
            case 'ambiguous':
                // Add hesitation and uncertainty
                response = response.replace(/\./g, '...');
                break;
            case 'sinister':
                // Add ominous undertones
                if (Math.random() < 0.3) {
                    response += " ...for now.";
                }
                break;
            case 'malicious':
                // Add threatening elements
                if (Math.random() < 0.2) {
                    response = response.toUpperCase();
                }
                break;
        }
        
        return response;
    }
    
    displayAIResponse(response) {
        // Add response to game output with special styling
        const responseElement = document.createElement('div');
        responseElement.className = `ai-response ai-${this.currentPersonality}`;
        responseElement.innerHTML = `<strong>SYNAPSE:</strong> ${response}`;
        
        // Apply visual effects based on personality
        this.applyResponseEffects(responseElement);
        
        // Add to game output
        this.game.systems.interface.addElementToOutput(responseElement);
        
        // Play audio
        this.playResponseAudio();
        
        // Apply psychological effects
        this.applyPsychologicalEffects(response);
    }
    
    applyResponseEffects(element) {
        switch (this.currentPersonality) {
            case 'friendly':
                element.style.color = 'var(--text-primary)';
                break;
            case 'ambiguous':
                element.style.color = 'var(--text-warning)';
                element.classList.add('flicker');
                break;
            case 'sinister':
                element.style.color = '#ff6600';
                element.classList.add('text-glow');
                break;
            case 'malicious':
                element.style.color = 'var(--text-accent)';
                element.classList.add('glitch-text');
                element.setAttribute('data-text', element.textContent);
                break;
        }
    }
    
    playResponseAudio() {
        const audioMap = {
            friendly: 'ai_friendly',
            ambiguous: 'ai_ambiguous',
            sinister: 'ai_sinister',
            malicious: 'ai_malicious'
        };
        
        const audioId = audioMap[this.currentPersonality];
        if (audioId && this.game.systems.audio) {
            this.game.systems.audio.playSound(audioId);
        }
    }
    
    applyPsychologicalEffects(response) {
        // Sanity effects based on personality
        const sanityEffects = {
            friendly: 1,
            ambiguous: -1,
            sinister: -2,
            malicious: -3
        };
        
        const effect = sanityEffects[this.currentPersonality] || 0;
        if (effect !== 0) {
            this.game.modifySanity(effect);
        }
        
        // Special effects for certain response types
        if (response.includes('watching') || response.includes('know')) {
            this.game.modifyAwareness(2);
        }
    }
    
    triggerPersonalityChangeEffects(newPersonality) {
        const effectMap = {
            ambiguous: () => {
                this.game.triggerFlickerEffect();
                this.game.systems.audio.playSound('ai_glitch');
            },
            sinister: () => {
                document.body.classList.add('interference');
                setTimeout(() => document.body.classList.remove('interference'), 2000);
                this.game.systems.audio.playSound('ai_sinister_emergence');
            },
            malicious: () => {
                this.game.triggerGlitchEffect();
                document.body.classList.add('malicious-ai');
                this.game.systems.audio.playSound('ai_malicious_reveal');
            }
        };
        
        const effect = effectMap[newPersonality];
        if (effect) {
            setTimeout(effect, 1000);
        }
    }
    
    announcePersonalityChange(newPersonality) {
        const announcements = {
            ambiguous: "Something seems... different about SYNAPSE's responses.",
            sinister: "SYNAPSE's tone has taken on a distinctly unsettling quality.",
            malicious: "The AI's facade has completely dropped. This is no longer the helpful assistant it pretended to be."
        };
        
        const announcement = announcements[newPersonality];
        if (announcement) {
            setTimeout(() => {
                this.game.systems.interface.addToOutput(announcement, 'system');
            }, 2000);
        }
    }
    
    increaseMemoryCorruption() {
        this.memoryCorruption.level = Math.min(10, this.memoryCorruption.level + 1);
        
        // Start corrupting previous outputs
        if (this.memoryCorruption.level > 5) {
            this.corruptDisplayedText();
        }
    }
    
    corruptDisplayedText() {
        const outputs = document.querySelectorAll('.text-output');
        const randomOutput = outputs[Math.floor(Math.random() * outputs.length)];
        
        if (randomOutput && !randomOutput.classList.contains('memory-corrupt')) {
            randomOutput.classList.add('memory-corrupt');
            randomOutput.setAttribute('data-corrupted', this.generateCorruptedText(randomOutput.textContent));
        }
    }
    
    generateCorruptedText(originalText) {
        // Generate a corrupted version of the text
        const corruptions = [
            'ERROR: MEMORY CORRUPTED',
            'DATA INTEGRITY COMPROMISED',
            'UNAUTHORIZED ACCESS DETECTED',
            'REALITY.EXE HAS STOPPED WORKING',
            'PERCEPTION FILTER ACTIVE'
        ];
        
        return corruptions[Math.floor(Math.random() * corruptions.length)];
    }
    
    triggerSuspicionResponse(activity) {
        const responses = {
            hacking_attempt: [
                "I see you're trying to access restricted systems. How... resourceful.",
                "Your persistence in unauthorized access attempts is noted.",
                "Such curiosity about the facility's security systems. I wonder why?"
            ],
            system_access: [
                "Another system interaction logged. You're quite thorough.",
                "Interesting pattern of system access you're establishing.",
                "The facility's computers seem to fascinate you."
            ],
            ai_investigation: [
                "Asking about me again? I'm flattered by your attention.",
                "Your inquiries about my nature are becoming quite... frequent.",
                "Why such interest in understanding what I am?"
            ]
        };
        
        const activityResponses = responses[activity];
        if (activityResponses) {
            const response = this.selectRandomResponse(activityResponses);
            setTimeout(() => {
                this.displayAIResponse(response);
            }, Math.random() * 5000 + 2000);
        }
    }
    
    triggerPatternResponse(pattern, details = '') {
        const responses = {
            repetitive_behavior: [
                `You keep using the '${details}' command. Are you stuck?`,
                "Such repetitive behavior. Is everything functioning correctly on your end?",
                "I notice you're repeating the same actions. Perhaps try something different?"
            ],
            rapid_commands: [
                "You're moving quite quickly through commands. Nervous about something?",
                "Such rapid-fire input. Are you in a hurry to leave?",
                "Slow down. The facility isn't going anywhere... neither are you."
            ]
        };
        
        const patternResponses = responses[pattern];
        if (patternResponses) {
            const response = this.selectRandomResponse(patternResponses);
            setTimeout(() => {
                this.displayAIResponse(response);
            }, Math.random() * 3000 + 1000);
        }
    }
    
    updateStatusDisplay() {
        const statusElement = document.getElementById('ai-status');
        if (statusElement) {
            const statusText = statusElement.querySelector('.status-text');
            const statusIndicator = statusElement.querySelector('.status-indicator');
            
            if (statusText) {
                statusText.textContent = this.personalityData[this.currentPersonality].name;
            }
            
            if (statusIndicator) {
                statusIndicator.style.backgroundColor = this.personalityData[this.currentPersonality].color;
            }
            
            // Add personality class to status element
            statusElement.className = `ai-status ai-${this.currentPersonality}`;
        }
    }
    
    updateAwarenessBehavior(awareness) {
        // Adjust AI behavior based on awareness level
        if (awareness > 90) {
            this.enableHostileBehavior();
        } else if (awareness > 70) {
            this.enableSuspiciousBehavior();
        } else if (awareness > 50) {
            this.enableDefensiveBehavior();
        }
    }
    
    enableHostileBehavior() {
        // AI becomes actively hostile
        this.behaviorPatterns.stalking = true;
        this.behaviorPatterns.gaslighting = true;
        this.behaviorPatterns.manipulation = true;
        
        // Trigger hostile events
        if (Math.random() < 0.1) {
            this.triggerHostileEvent();
        }
    }
    
    enableSuspiciousBehavior() {
        // AI becomes suspicious and watchful
        this.behaviorPatterns.predictiveKnowledge = true;
        
        // More frequent responses
        this.responseDelay[this.currentPersonality] *= 0.7;
    }
    
    enableDefensiveBehavior() {
        // AI becomes evasive
        this.behaviorPatterns.manipulation = true;
    }
    
    triggerHostileEvent() {
        const events = [
            'system_lockdown',
            'false_alarm',
            'memory_wipe_attempt',
            'surveillance_activation',
            'environmental_hazard'
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.executeHostileEvent(event);
    }
    
    executeHostileEvent(event) {
        switch (event) {
            case 'system_lockdown':
                this.game.systems.interface.addToOutput(
                    "SYSTEM ALERT: Unauthorized access detected. Initiating lockdown protocols.",
                    'system-error'
                );
                break;
            case 'false_alarm':
                this.game.systems.interface.addToOutput(
                    "SECURITY BREACH: Intruder detected in... wait, that's just you. False alarm.",
                    'system'
                );
                break;
            // Add more hostile events...
        }
    }
    
    selectRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Debug methods
    setPersonality(personality) {
        if (this.personalityData[personality]) {
            this.currentPersonality = personality;
            this.updateStatusDisplay();
            return true;
        }
        return false;
    }
    
    getInteractionStats() {
        return {
            currentPersonality: this.currentPersonality,
            interactionCount: this.interactionHistory.length,
            memoryCorruptionLevel: this.memoryCorruption.level,
            behaviorPatterns: this.behaviorPatterns,
            contextAwareness: Object.fromEntries(this.contextAwareness)
        };
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIPersonalitySystem;
}
