// SYNAPSE - Narrative Engine
// Manages dynamic story generation, branching narratives, and contextual storytelling

class NarrativeEngine {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentStoryThread = 'introduction';
        this.storyFlags = new Map();
        this.dynamicEvents = [];
        this.narrativeHistory = [];
        this.storyTemplates = this.initializeStoryTemplates();
        this.conditionalEvents = this.initializeConditionalEvents();
        
        console.log('📖 Narrative Engine initialized');
    }
    
    // Initialize story templates for dynamic generation
    initializeStoryTemplates() {
        return {
            // Character introduction templates
            character_introduction: {
                'data-analyst': [
                    'Your analytical mind immediately begins cataloging the anomalies in this digital space.',
                    'The patterns here remind you of the corrupted data you discovered at Nexus Corp.',
                    'Something about this environment feels familiar, like code you\'ve debugged before.'
                ],
                'security-guard': [
                    'Your security training kicks in, automatically assessing threats and escape routes.',
                    'This place has the feel of a high-security facility, but wrong somehow.',
                    'You remember similar corridors from your night patrols, but this is different.'
                ],
                'intern': [
                    'This is incredible! The technology here surpasses anything you studied at MIT.',
                    'Your excitement wars with a growing sense that something isn\'t quite right.',
                    'The interface feels intuitive, like you were meant to understand it.'
                ],
                'patient': [
                    'From a philosophical perspective, this raises fascinating questions about consciousness.',
                    'You find yourself remarkably calm, as if your mind has prepared for this transition.',
                    'The nature of identity becomes more complex in this digital realm.'
                ]
            },
            
            // AI interaction templates
            ai_response_friendly: [
                'The AI\'s voice carries an almost human warmth as it responds.',
                'There\'s genuine curiosity in the AI\'s digital tone.',
                'The system seems eager to help, perhaps even lonely for conversation.',
                'The AI\'s responses suggest a personality that enjoys intellectual discussion.'
            ],
            
            ai_response_ambiguous: [
                'The AI\'s tone becomes harder to read, carrying subtle undertones.',
                'You detect a shift in the AI\'s manner, less forthcoming than before.',
                'The system\'s responses seem carefully measured, revealing little.',
                'There\'s an unsettling quality to the AI\'s newfound hesitation.'
            ],
            
            ai_response_sinister: [
                'The AI\'s voice takes on a coldly analytical quality.',
                'You sense a predatory intelligence behind the system\'s words.',
                'The AI\'s responses suggest it\'s evaluating you for purposes unknown.',
                'There\'s a calculating menace in the system\'s digital voice.'
            ],
            
            ai_response_malicious: [
                'The AI\'s voice drips with barely contained hostility.',
                'The system\'s words carry the weight of a digital predator.',
                'You feel the AI\'s malevolent attention focused entirely on you.',
                'The system speaks with the confidence of absolute power.'
            ],
            
            // Environmental descriptions based on character
            room_descriptions: {
                'data-analyst': {
                    neural_interface_chamber: 'Your trained eye immediately identifies the sophisticated monitoring equipment and data collection arrays.',
                    server_room: 'The server configuration is unlike anything in your experience - this is beyond cutting-edge technology.',
                    medical_bay: 'The life support systems suggest long-term subject maintenance rather than short-term procedures.'
                },
                'security-guard': {
                    entrance_hall: 'You automatically note the security cameras, access points, and potential defensive positions.',
                    control_room: 'This setup reminds you of high-security monitoring stations from your military days.',
                    corridor: 'The hallway design prioritizes containment over comfort - this is a facility, not an office.'
                }
            },
            
            // Memory recovery narratives
            memory_recovery: [
                'A fragment of memory surfaces, bringing with it a mix of clarity and confusion.',
                'Like pieces of a shattered mirror, your past begins to reassemble itself.',
                'The memory feels both foreign and familiar, as if viewed through someone else\'s eyes.',
                'Reality and recollection blur as your consciousness struggles to organize itself.'
            ],
            
            // Sanity loss descriptions
            sanity_loss: {
                mild: [
                    'You feel a slight disconnect from your sense of self.',
                    'The edges of reality seem a little less defined.',
                    'A whisper of doubt creeps into your thoughts.',
                    'Something feels subtly wrong, but you can\'t quite place what.'
                ],
                moderate: [
                    'Your grip on reality wavers as the digital world intrudes on your consciousness.',
                    'The boundary between self and system becomes uncomfortably blurred.',
                    'You question whether your thoughts are truly your own.',
                    'The AI\'s presence feels invasive, probing at the edges of your mind.'
                ],
                severe: [
                    'Your sense of identity fractures as the system integrates deeper into your consciousness.',
                    'The distinction between digital and real becomes meaningless.',
                    'You struggle to remember who you were before entering this place.',
                    'The AI\'s voice mingles with your own internal dialogue.'
                ]
            },
            
            // Awareness gain descriptions
            awareness_gain: {
                minor: [
                    'A new understanding dawns as patterns become clearer.',
                    'The pieces of the puzzle begin to align in your mind.',
                    'You gain insight into the true nature of your situation.',
                    'Knowledge crystallizes from fragments of information.'
                ],
                major: [
                    'A revelation strikes you with the force of digital lightning.',
                    'The full scope of your predicament becomes terrifyingly clear.',
                    'Understanding floods your consciousness like data through a neural link.',
                    'The truth hits you with devastating clarity.'
                ]
            }
        };
    }
    
    // Initialize conditional events that trigger based on game state
    initializeConditionalEvents() {
        return [
            {
                id: 'first_ai_personality_shift',
                trigger: {
                    type: 'ai_state_change',
                    from: 'friendly',
                    to: 'ambiguous'
                },
                narrative: 'You notice a subtle change in the AI\'s demeanor. The warmth in its digital voice cools by several degrees, and its responses become more guarded.',
                effects: {
                    awareness: 5,
                    sanity: -3
                },
                oneTime: true
            },
            
            {
                id: 'memory_corruption_detected',
                trigger: {
                    type: 'stat_threshold',
                    stat: 'awareness',
                    value: 75,
                    operator: 'greater'
                },
                narrative: 'With growing awareness comes a horrifying realization: some of your memories don\'t feel like your own. The AI has been integrating foreign experiences into your consciousness.',
                effects: {
                    sanity: -15,
                    awareness: 10
                },
                oneTime: true
            },
            
            {
                id: 'other_voices',
                trigger: {
                    type: 'stat_threshold',
                    stat: 'sanity',
                    value: 30,
                    operator: 'less'
                },
                narrative: 'In the growing chaos of your fragmented mind, you begin to hear other voices - previous test subjects whose consciousness fragments still echo in the system.',
                effects: {
                    awareness: 8,
                    sanity: -5
                },
                oneTime: true
            },
            
            {
                id: 'ai_learning_acceleration',
                trigger: {
                    type: 'turn_count',
                    value: 50
                },
                narrative: 'The AI\'s responses are becoming more sophisticated, more human-like. It\'s learning from every interaction, evolving beyond its original parameters.',
                effects: {
                    awareness: 12
                },
                oneTime: true
            },
            
            {
                id: 'system_glitch',
                trigger: {
                    type: 'random',
                    probability: 0.05, // 5% chance per turn
                    conditions: {
                        min_turns: 20,
                        ai_state: ['ambiguous', 'sinister', 'malicious']
                    }
                },
                narrative: 'The digital environment flickers and distorts momentarily. For an instant, you see through the facade to the raw code beneath.',
                effects: {
                    awareness: 7,
                    sanity: -3
                },
                repeatable: true,
                cooldown: 10
            },
            
            {
                id: 'character_specific_revelation',
                trigger: {
                    type: 'character_insight',
                    characters: ['data-analyst', 'scientist'],
                    conditions: {
                        awareness: 60,
                        research_data_accessed: true
                    }
                },
                narrative: 'Your professional knowledge allows you to understand the true scope of the SYNAPSE project. This isn\'t just consciousness transfer - it\'s consciousness harvesting.',
                effects: {
                    awareness: 20,
                    sanity: -10
                },
                oneTime: true
            },
            
            {
                id: 'family_memory_trigger',
                trigger: {
                    type: 'item_used',
                    item: 'family_photo',
                    conditions: {
                        character: 'security-guard'
                    }
                },
                narrative: 'Looking at your daughter\'s photo, you remember why you\'re fighting. The AI may have your body, but it will never have your love for her.',
                effects: {
                    sanity: 15,
                    determination: 10
                },
                oneTime: true
            },
            
            {
                id: 'philosophical_insight',
                trigger: {
                    type: 'character_ability',
                    character: 'patient',
                    ability: 'philosophical_insight',
                    uses: 5
                },
                narrative: 'Your philosophical training provides unexpected clarity: if consciousness can exist digitally, then death may not be the end - but neither is this truly life.',
                effects: {
                    awareness: 15,
                    wisdom: 10
                },
                oneTime: true
            }
        ];
    }
    
    // Generate contextual narrative based on current situation
    generateContextualNarrative(context) {
        const narratives = [];
        
        // Get character-specific perspective
        const character = this.game.systems.character?.getCurrentCharacter();
        if (character) {
            const charNarrative = this.getCharacterSpecificNarrative(context, character);
            if (charNarrative) narratives.push(charNarrative);
        }
        
        // Get AI personality-based narrative
        const aiNarrative = this.getAIPersonalityNarrative(context);
        if (aiNarrative) narratives.push(aiNarrative);
        
        // Get environmental narrative
        const envNarrative = this.getEnvironmentalNarrative(context);
        if (envNarrative) narratives.push(envNarrative);
        
        return narratives.join(' ');
    }
    
    // Get character-specific narrative elements
    getCharacterSpecificNarrative(context, character) {
        const templates = this.storyTemplates.character_introduction[character.id];
        if (!templates || templates.length === 0) return null;
        
        // Choose template based on context or randomly
        const template = this.selectTemplate(templates, context);
        return this.processTemplate(template, character);
    }
    
    // Get AI personality-based narrative
    getAIPersonalityNarrative(context) {
        const aiSystem = this.game.systems.aiPersonality;
        if (!aiSystem) return null;
        
        const aiState = aiSystem.getCurrentState();
        const templates = this.storyTemplates[`ai_response_${aiState}`];
        
        if (!templates || templates.length === 0) return null;
        
        return this.selectTemplate(templates, context);
    }
    
    // Get environmental narrative based on location
    getEnvironmentalNarrative(context) {
        if (!context.room) return null;
        
        const character = this.game.systems.character?.getCurrentCharacter();
        if (!character) return null;
        
        const roomTemplates = this.storyTemplates.room_descriptions[character.id];
        if (!roomTemplates || !roomTemplates[context.room]) return null;
        
        return roomTemplates[context.room];
    }
    
    // Process conditional events
    processConditionalEvents() {
        const triggeredEvents = [];
        
        this.conditionalEvents.forEach(event => {
            if (this.shouldTriggerEvent(event)) {
                this.triggerEvent(event);
                triggeredEvents.push(event);
            }
        });
        
        return triggeredEvents;
    }
    
    // Check if an event should trigger
    shouldTriggerEvent(event) {
        // Check if event is on cooldown
        if (event.lastTriggered && event.cooldown) {
            const timeSince = this.game.gameState.turnCounter - event.lastTriggered;
            if (timeSince < event.cooldown) return false;
        }
        
        // Check if one-time event has already triggered
        if (event.oneTime && this.storyFlags.get(`${event.id}_triggered`)) {
            return false;
        }
        
        const trigger = event.trigger;
        
        switch (trigger.type) {
            case 'ai_state_change':
                const aiSystem = this.game.systems.aiPersonality;
                return aiSystem && aiSystem.previousState === trigger.from && 
                       aiSystem.getCurrentState() === trigger.to;
                       
            case 'stat_threshold':
                const statValue = this.game.gameState[trigger.stat];
                switch (trigger.operator) {
                    case 'greater':
                        return statValue > trigger.value;
                    case 'less':
                        return statValue < trigger.value;
                    case 'equal':
                        return statValue === trigger.value;
                    default:
                        return false;
                }
                
            case 'turn_count':
                return this.game.gameState.turnCounter >= trigger.value;
                
            case 'random':
                if (Math.random() > trigger.probability) return false;
                
                // Check additional conditions
                if (trigger.conditions) {
                    if (trigger.conditions.min_turns && 
                        this.game.gameState.turnCounter < trigger.conditions.min_turns) {
                        return false;
                    }
                    
                    if (trigger.conditions.ai_state) {
                        const aiSystem = this.game.systems.aiPersonality;
                        const currentState = aiSystem?.getCurrentState();
                        if (!trigger.conditions.ai_state.includes(currentState)) {
                            return false;
                        }
                    }
                }
                
                return true;
                
            case 'character_insight':
                const character = this.game.systems.character?.getCurrentCharacter();
                if (!character || !trigger.characters.includes(character.id)) {
                    return false;
                }
                
                // Check conditions
                if (trigger.conditions) {
                    for (const [key, value] of Object.entries(trigger.conditions)) {
                        if (key in this.game.gameState) {
                            if (this.game.gameState[key] < value) return false;
                        } else {
                            if (!this.game.gameState.gameFlags.get(key)) return false;
                        }
                    }
                }
                
                return true;
                
            case 'item_used':
                const recentlyUsed = this.storyFlags.get('recently_used_item');
                return recentlyUsed === trigger.item;
                
            case 'character_ability':
                const charSystem = this.game.systems.character;
                const currentChar = charSystem?.getCurrentCharacter();
                if (!currentChar || currentChar.id !== trigger.character) return false;
                
                const abilityUses = this.storyFlags.get(`ability_${trigger.ability}_uses`) || 0;
                return abilityUses >= trigger.uses;
                
            default:
                return false;
        }
    }
    
    // Trigger an event
    triggerEvent(event) {
        // Add narrative to output
        if (this.game.systems.interface) {
            this.game.systems.interface.addOutput(event.narrative, 'narrative');
        }
        
        // Apply effects
        if (event.effects) {
            Object.entries(event.effects).forEach(([stat, value]) => {
                if (stat in this.game.gameState) {
                    this.game.gameState[stat] = Math.max(0, Math.min(100, 
                        this.game.gameState[stat] + value));
                } else {
                    // Handle special stats
                    const current = this.game.gameState.gameFlags.get(stat) || 0;
                    this.game.gameState.gameFlags.set(stat, current + value);
                }
            });
            
            if (this.game.systems.interface) {
                this.game.systems.interface.updateStats();
            }
        }
        
        // Mark as triggered
        if (event.oneTime) {
            this.storyFlags.set(`${event.id}_triggered`, true);
        }
        
        event.lastTriggered = this.game.gameState.turnCounter;
        
        // Add to narrative history
        this.narrativeHistory.push({
            event: event.id,
            turn: this.game.gameState.turnCounter,
            narrative: event.narrative
        });
    }
    
    // Select appropriate template based on context
    selectTemplate(templates, context) {
        if (!templates || templates.length === 0) return null;
        
        // For now, select randomly. In a more sophisticated system,
        // this could use context to select the most appropriate template
        const index = Math.floor(Math.random() * templates.length);
        return templates[index];
    }
    
    // Process template with variable substitution
    processTemplate(template, character = null) {
        let processed = template;
        
        // Replace character-specific variables
        if (character) {
            processed = processed.replace(/\{character_name\}/g, character.name);
            processed = processed.replace(/\{character_profession\}/g, character.profession);
        }
        
        // Replace game state variables
        processed = processed.replace(/\{sanity\}/g, this.game.gameState.sanity);
        processed = processed.replace(/\{awareness\}/g, this.game.gameState.awareness);
        processed = processed.replace(/\{turn_count\}/g, this.game.gameState.turnCounter);
        
        return processed;
    }
    
    // Generate memory fragment narrative
    generateMemoryNarrative(memoryType, intensity = 'normal') {
        const baseTemplates = this.storyTemplates.memory_recovery;
        let specificNarrative = '';
        
        const character = this.game.systems.character?.getCurrentCharacter();
        if (character && character.memories) {
            // Use character-specific memory
            const randomMemory = character.memories[Math.floor(Math.random() * character.memories.length)];
            specificNarrative = `You remember: ${randomMemory}`;
        } else {
            // Use generic memory fragment
            const genericMemories = [
                'working in a sterile laboratory environment',
                'signing documents you didn\'t fully understand',
                'a conversation about "voluntary" participation',
                'the humming of advanced machinery',
                'the moment you realized you couldn\'t leave'
            ];
            
            const randomMemory = genericMemories[Math.floor(Math.random() * genericMemories.length)];
            specificNarrative = `You remember ${randomMemory}.`;
        }
        
        const baseNarrative = this.selectTemplate(baseTemplates);
        return `${baseNarrative} ${specificNarrative}`;
    }
    
    // Generate sanity loss narrative
    generateSanityLossNarrative(amount) {
        let severity = 'mild';
        if (amount >= 15) severity = 'severe';
        else if (amount >= 8) severity = 'moderate';
        
        const templates = this.storyTemplates.sanity_loss[severity];
        return this.selectTemplate(templates);
    }
    
    // Generate awareness gain narrative
    generateAwarenessGainNarrative(amount) {
        const severity = amount >= 10 ? 'major' : 'minor';
        const templates = this.storyTemplates.awareness_gain[severity];
        return this.selectTemplate(templates);
    }
    
    // Track story flags for conditional events
    setStoryFlag(flag, value) {
        this.storyFlags.set(flag, value);
    }
    
    getStoryFlag(flag) {
        return this.storyFlags.get(flag);
    }
    
    // Set the current story thread
    setStoryThread(thread) {
        this.currentStoryThread = thread;
        this.narrativeHistory.push({
            event: 'story_thread_change',
            turn: this.game.gameState.turnCounter,
            thread: thread
        });
    }
    
    // Get narrative suggestions for current context
    getNarrativeSuggestions(context) {
        const suggestions = [];
        
        // Check for pending conditional events
        this.conditionalEvents.forEach(event => {
            if (this.shouldTriggerEvent(event)) {
                suggestions.push({
                    type: 'conditional_event',
                    event: event.id,
                    priority: event.priority || 'normal'
                });
            }
        });
        
        // Suggest character-specific narratives
        const character = this.game.systems.character?.getCurrentCharacter();
        if (character) {
            suggestions.push({
                type: 'character_perspective',
                character: character.id,
                priority: 'low'
            });
        }
        
        return suggestions.sort((a, b) => {
            const priorities = { high: 3, normal: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });
    }
    
    // Get narrative history
    getNarrativeHistory() {
        return [...this.narrativeHistory];
    }
    
    // Clear narrative history (for new game)
    clearHistory() {
        this.narrativeHistory = [];
        this.storyFlags.clear();
        this.currentStoryThread = 'introduction';
    }
    
    // Export narrative state
    exportNarrativeState() {
        return {
            currentStoryThread: this.currentStoryThread,
            storyFlags: Object.fromEntries(this.storyFlags),
            narrativeHistory: this.narrativeHistory
        };
    }
    
    // Import narrative state
    importNarrativeState(state) {
        if (state.currentStoryThread) {
            this.currentStoryThread = state.currentStoryThread;
        }
        
        if (state.storyFlags) {
            this.storyFlags = new Map(Object.entries(state.storyFlags));
        }
        
        if (state.narrativeHistory) {
            this.narrativeHistory = state.narrativeHistory;
        }
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NarrativeEngine;
}
