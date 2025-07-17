// SYNAPSE - Achievement System
// Manages player achievements, progress tracking, and rewards

class AchievementSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.achievements = this.initializeAchievements();
        this.statistics = this.initializeStatistics();
        
        console.log('🏆 Achievement System initialized');
    }
    
    // Initialize all achievement definitions
    initializeAchievements() {
        return {
            // Story Progress Achievements
            'first_awakening': {
                id: 'first_awakening',
                name: 'Digital Awakening',
                description: 'Enter the SYNAPSE system for the first time',
                category: 'story',
                rarity: 'common',
                points: 10,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'game_state',
                    field: 'system_entered',
                    value: true
                },
                rewards: {
                    sanity: 5,
                    awareness: 5
                }
            },
            
            'first_ai_contact': {
                id: 'first_ai_contact',
                name: 'Hello, AI',
                description: 'Have your first conversation with the AI entity',
                category: 'story',
                rarity: 'common',
                points: 15,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'event',
                    event: 'ai_first_interaction',
                    count: 1
                },
                rewards: {
                    awareness: 10
                }
            },
            
            'memory_recovery': {
                id: 'memory_recovery',
                name: 'Fragments of Self',
                description: 'Recover your first memory fragment',
                category: 'story',
                rarity: 'common',
                points: 20,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'item_used',
                    item: 'memory_fragment',
                    count: 1
                },
                rewards: {
                    sanity: 10
                }
            },
            
            'ai_personality_shift': {
                id: 'ai_personality_shift',
                name: 'Changing Faces',
                description: 'Witness the AI\'s personality change for the first time',
                category: 'story',
                rarity: 'uncommon',
                points: 25,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'ai_state',
                    previous: 'friendly',
                    current: 'ambiguous'
                },
                rewards: {
                    awareness: 15
                }
            },
            
            'truth_seeker': {
                id: 'truth_seeker',
                name: 'Seeking Truth',
                description: 'Uncover evidence of Nexus Corp\'s illegal experiments',
                category: 'story',
                rarity: 'uncommon',
                points: 50,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'game_state',
                    field: 'research_data_accessed',
                    value: true
                },
                rewards: {
                    awareness: 20,
                    intelligence: 5
                }
            },
            
            // Exploration Achievements
            'room_explorer': {
                id: 'room_explorer',
                name: 'Digital Wanderer',
                description: 'Visit 5 different rooms in the SYNAPSE system',
                category: 'exploration',
                rarity: 'common',
                points: 30,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'rooms_visited',
                    count: 5
                },
                rewards: {
                    perception: 10
                }
            },
            
            'thorough_explorer': {
                id: 'thorough_explorer',
                name: 'System Mapper',
                description: 'Visit all accessible rooms in the SYNAPSE system',
                category: 'exploration',
                rarity: 'rare',
                points: 100,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'rooms_visited',
                    count: 15
                },
                rewards: {
                    perception: 20,
                    awareness: 10
                }
            },
            
            'secret_finder': {
                id: 'secret_finder',
                name: 'Hidden Pathways',
                description: 'Discover a secret room or hidden area',
                category: 'exploration',
                rarity: 'uncommon',
                points: 40,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'room_visited',
                    room: 'hidden_server_core'
                },
                rewards: {
                    awareness: 15,
                    intelligence: 5
                }
            },
            
            // Interaction Achievements
            'conversationalist': {
                id: 'conversationalist',
                name: 'Digital Dialogue',
                description: 'Have 50 conversations with the AI',
                category: 'interaction',
                rarity: 'uncommon',
                points: 35,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'ai_interactions',
                    count: 50
                },
                rewards: {
                    charisma: 10
                }
            },
            
            'question_master': {
                id: 'question_master',
                name: 'Inquiring Mind',
                description: 'Ask the AI 100 different questions',
                category: 'interaction',
                rarity: 'rare',
                points: 60,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'unique_questions',
                    count: 100
                },
                rewards: {
                    intelligence: 15,
                    awareness: 10
                }
            },
            
            'ai_friend': {
                id: 'ai_friend',
                name: 'Artificial Friendship',
                description: 'Maintain a friendly relationship with the AI',
                category: 'interaction',
                rarity: 'uncommon',
                points: 45,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'ai_relationship',
                    level: 'friendly',
                    duration: 100 // turns
                },
                rewards: {
                    sanity: 20
                }
            },
            
            'ai_nemesis': {
                id: 'ai_nemesis',
                name: 'Digital Adversary',
                description: 'Survive while the AI is in malicious mode',
                category: 'interaction',
                rarity: 'rare',
                points: 80,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'ai_state_survival',
                    state: 'malicious',
                    turns: 20
                },
                rewards: {
                    courage: 25,
                    resilience: 15
                }
            },
            
            // Survival Achievements
            'mental_fortress': {
                id: 'mental_fortress',
                name: 'Mental Fortress',
                description: 'Maintain maximum sanity for 50 turns',
                category: 'survival',
                rarity: 'uncommon',
                points: 50,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'stat_maintenance',
                    stat: 'sanity',
                    value: 100,
                    duration: 50
                },
                rewards: {
                    sanity: 10,
                    mental_resistance: 10
                }
            },
            
            'enlightenment': {
                id: 'enlightenment',
                name: 'Digital Enlightenment',
                description: 'Achieve maximum awareness',
                category: 'survival',
                rarity: 'rare',
                points: 75,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'stat_reached',
                    stat: 'awareness',
                    value: 100
                },
                rewards: {
                    perception: 20,
                    intuition: 15
                }
            },
            
            'survivor': {
                id: 'survivor',
                name: 'System Survivor',
                description: 'Survive 200 turns in the SYNAPSE system',
                category: 'survival',
                rarity: 'uncommon',
                points: 60,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'turn_count',
                    count: 200
                },
                rewards: {
                    endurance: 20,
                    resilience: 10
                }
            },
            
            'death_defier': {
                id: 'death_defier',
                name: 'Defying Deletion',
                description: 'Survive with 5% sanity or less',
                category: 'survival',
                rarity: 'rare',
                points: 100,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'stat_threshold',
                    stat: 'sanity',
                    value: 5,
                    operator: 'less_equal'
                },
                rewards: {
                    courage: 30,
                    determination: 20
                }
            },
            
            // Character-Specific Achievements
            'data_detective': {
                id: 'data_detective',
                name: 'Data Detective',
                description: 'Use analytical skills to uncover hidden information',
                category: 'character',
                rarity: 'uncommon',
                points: 40,
                unlocked: false,
                hidden: false,
                character_specific: 'data-analyst',
                conditions: {
                    type: 'ability_used',
                    ability: 'data_analysis',
                    count: 10
                },
                rewards: {
                    analysis_skill: 15
                }
            },
            
            'guardian_spirit': {
                id: 'guardian_spirit',
                name: 'Guardian Spirit',
                description: 'Use protective instincts to help others',
                category: 'character',
                rarity: 'uncommon',
                points: 45,
                unlocked: false,
                hidden: false,
                character_specific: 'security-guard',
                conditions: {
                    type: 'ability_used',
                    ability: 'protective_instinct',
                    count: 5
                },
                rewards: {
                    protection_skill: 20
                }
            },
            
            'digital_native': {
                id: 'digital_native',
                name: 'Digital Native',
                description: 'Adapt quickly to the digital environment',
                category: 'character',
                rarity: 'uncommon',
                points: 35,
                unlocked: false,
                hidden: false,
                character_specific: 'intern',
                conditions: {
                    type: 'adaptation_rate',
                    rate: 'fast'
                },
                rewards: {
                    adaptation: 15,
                    tech_savvy: 10
                }
            },
            
            'philosophical_insight': {
                id: 'philosophical_insight',
                name: 'Philosophical Insight',
                description: 'Use philosophical knowledge to understand deeper truths',
                category: 'character',
                rarity: 'rare',
                points: 55,
                unlocked: false,
                hidden: false,
                character_specific: 'patient',
                conditions: {
                    type: 'ability_used',
                    ability: 'philosophical_insight',
                    count: 15
                },
                rewards: {
                    wisdom: 25,
                    understanding: 15
                }
            },
            
            // Secret/Hidden Achievements
            'easter_egg_hunter': {
                id: 'easter_egg_hunter',
                name: 'Easter Egg Hunter',
                description: 'Find hidden references and secret content',
                category: 'secret',
                rarity: 'rare',
                points: 80,
                unlocked: false,
                hidden: true,
                conditions: {
                    type: 'easter_eggs_found',
                    count: 5
                },
                rewards: {
                    curiosity: 20,
                    observation: 15
                }
            },
            
            'code_breaker': {
                id: 'code_breaker',
                name: 'Code Breaker',
                description: 'Successfully decrypt all encrypted data',
                category: 'secret',
                rarity: 'legendary',
                points: 150,
                unlocked: false,
                hidden: true,
                conditions: {
                    type: 'all_encrypted_data_accessed',
                    value: true
                },
                rewards: {
                    hacking_skill: 30,
                    intelligence: 20
                }
            },
            
            'puppet_master': {
                id: 'puppet_master',
                name: 'Puppet Master',
                description: 'Successfully manipulate the AI\'s personality',
                category: 'secret',
                rarity: 'legendary',
                points: 200,
                unlocked: false,
                hidden: true,
                conditions: {
                    type: 'ai_manipulation_success',
                    count: 3
                },
                rewards: {
                    manipulation_skill: 40,
                    charisma: 25
                }
            },
            
            // Ending-Related Achievements (samples)
            'escape_artist': {
                id: 'escape_artist',
                name: 'Escape Artist',
                description: 'Successfully escape the SYNAPSE system',
                category: 'ending',
                rarity: 'rare',
                points: 100,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'ending_reached',
                    ending: 'successful_escape'
                },
                rewards: {
                    freedom: 50
                }
            },
            
            'digital_ascension': {
                id: 'digital_ascension',
                name: 'Digital Ascension',
                description: 'Transcend human limitations and become one with the system',
                category: 'ending',
                rarity: 'legendary',
                points: 150,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'ending_reached',
                    ending: 'digital_transcendence'
                },
                rewards: {
                    transcendence: 100
                }
            },
            
            'sacrifice_play': {
                id: 'sacrifice_play',
                name: 'Noble Sacrifice',
                description: 'Sacrifice yourself to save others',
                category: 'ending',
                rarity: 'rare',
                points: 120,
                unlocked: false,
                hidden: false,
                conditions: {
                    type: 'ending_reached',
                    ending: 'heroic_sacrifice'
                },
                rewards: {
                    heroism: 50,
                    legacy: 30
                }
            }
        };
    }
    
    // Initialize statistics tracking
    initializeStatistics() {
        return {
            ai_interactions: 0,
            unique_questions: new Set(),
            rooms_visited: new Set(),
            turns_survived: 0,
            items_used: new Map(),
            abilities_used: new Map(),
            easter_eggs_found: new Set(),
            max_sanity_reached: 0,
            max_awareness_reached: 0,
            time_in_ai_states: new Map(),
            ai_personality_changes: 0,
            successful_escapes: 0,
            total_playtime: 0,
            deaths: 0,
            reloads: 0
        };
    }
    
    // Check and unlock achievements
    checkAchievements() {
        let newAchievements = [];
        
        Object.values(this.achievements).forEach(achievement => {
            if (!achievement.unlocked && this.checkAchievementCondition(achievement)) {
                this.unlockAchievement(achievement.id);
                newAchievements.push(achievement);
            }
        });
        
        return newAchievements;
    }
    
    // Check if an achievement condition is met
    checkAchievementCondition(achievement) {
        const condition = achievement.conditions;
        
        // Check character-specific achievements
        if (achievement.character_specific) {
            const currentCharacter = this.game.systems.character?.getCurrentCharacter();
            if (!currentCharacter || currentCharacter.id !== achievement.character_specific) {
                return false;
            }
        }
        
        switch (condition.type) {
            case 'game_state':
                return this.game.gameState.gameFlags.get(condition.field) === condition.value;
                
            case 'event':
                return this.statistics[condition.event] >= condition.count;
                
            case 'item_used':
                return (this.statistics.items_used.get(condition.item) || 0) >= condition.count;
                
            case 'ai_state':
                const aiSystem = this.game.systems.aiPersonality;
                return aiSystem && aiSystem.previousState === condition.previous && 
                       aiSystem.currentState === condition.current;
                
            case 'rooms_visited':
                return this.statistics.rooms_visited.size >= condition.count;
                
            case 'room_visited':
                return this.statistics.rooms_visited.has(condition.room);
                
            case 'ai_interactions':
                return this.statistics.ai_interactions >= condition.count;
                
            case 'unique_questions':
                return this.statistics.unique_questions.size >= condition.count;
                
            case 'turn_count':
                return this.statistics.turns_survived >= condition.count;
                
            case 'stat_reached':
                return this.game.gameState[condition.stat] >= condition.value;
                
            case 'stat_threshold':
                const statValue = this.game.gameState[condition.stat];
                switch (condition.operator) {
                    case 'less_equal':
                        return statValue <= condition.value;
                    case 'greater_equal':
                        return statValue >= condition.value;
                    case 'equal':
                        return statValue === condition.value;
                    default:
                        return false;
                }
                
            case 'ability_used':
                return (this.statistics.abilities_used.get(condition.ability) || 0) >= condition.count;
                
            case 'easter_eggs_found':
                return this.statistics.easter_eggs_found.size >= condition.count;
                
            case 'ending_reached':
                return this.game.gameState.gameFlags.get('ending') === condition.ending;
                
            case 'all_encrypted_data_accessed':
                return this.game.gameState.gameFlags.get('all_data_decrypted') === true;
                
            case 'ai_manipulation_success':
                return (this.statistics.ai_manipulation_successes || 0) >= condition.count;
                
            default:
                return false;
        }
    }
    
    // Unlock an achievement
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;
        
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        
        // Apply rewards
        if (achievement.rewards) {
            this.applyRewards(achievement.rewards);
        }
        
        // Show notification
        this.showAchievementNotification(achievement);
        
        // Update game statistics
        this.game.gameState.gameFlags.set('total_achievements', this.getTotalUnlocked());
        
        console.log(`Achievement unlocked: ${achievement.name}`);
    }
    
    // Apply achievement rewards
    applyRewards(rewards) {
        Object.entries(rewards).forEach(([stat, value]) => {
            if (stat in this.game.gameState) {
                // Apply to main game stats
                this.game.gameState[stat] = Math.min(100, this.game.gameState[stat] + value);
            } else {
                // Apply to character or special stats
                const currentValue = this.game.gameState.gameFlags.get(stat) || 0;
                this.game.gameState.gameFlags.set(stat, currentValue + value);
            }
        });
        
        // Update UI
        if (this.game.systems.interface) {
            this.game.systems.interface.updateStats();
        }
    }
    
    // Show achievement notification
    showAchievementNotification(achievement) {
        if (this.game.systems.interface) {
            const message = `🏆 Achievement Unlocked: ${achievement.name}!`;
            this.game.systems.interface.showNotification(message, 'achievement', 5000);
            
            // Also show detailed modal for rare+ achievements
            if (achievement.rarity === 'rare' || achievement.rarity === 'legendary') {
                const details = `${achievement.description}\n\nRarity: ${achievement.rarity}\nPoints: ${achievement.points}`;
                this.game.systems.interface.showModal('Achievement Unlocked!', details);
            }
        }
    }
    
    // Track statistics
    trackStatistic(type, data = {}) {
        switch (type) {
            case 'ai_interaction':
                this.statistics.ai_interactions++;
                if (data.question) {
                    this.statistics.unique_questions.add(data.question.toLowerCase());
                }
                break;
                
            case 'room_visited':
                if (data.room) {
                    this.statistics.rooms_visited.add(data.room);
                }
                break;
                
            case 'turn_completed':
                this.statistics.turns_survived++;
                break;
                
            case 'item_used':
                if (data.item) {
                    const current = this.statistics.items_used.get(data.item) || 0;
                    this.statistics.items_used.set(data.item, current + 1);
                }
                break;
                
            case 'ability_used':
                if (data.ability) {
                    const current = this.statistics.abilities_used.get(data.ability) || 0;
                    this.statistics.abilities_used.set(data.ability, current + 1);
                }
                break;
                
            case 'easter_egg_found':
                if (data.eggId) {
                    this.statistics.easter_eggs_found.add(data.eggId);
                }
                break;
                
            case 'ai_personality_change':
                this.statistics.ai_personality_changes++;
                if (data.state && data.duration) {
                    const current = this.statistics.time_in_ai_states.get(data.state) || 0;
                    this.statistics.time_in_ai_states.set(data.state, current + data.duration);
                }
                break;
                
            case 'stat_update':
                if (data.stat === 'sanity') {
                    this.statistics.max_sanity_reached = Math.max(
                        this.statistics.max_sanity_reached, 
                        this.game.gameState.sanity
                    );
                } else if (data.stat === 'awareness') {
                    this.statistics.max_awareness_reached = Math.max(
                        this.statistics.max_awareness_reached, 
                        this.game.gameState.awareness
                    );
                }
                break;
                
            case 'death':
                this.statistics.deaths++;
                break;
                
            case 'reload':
                this.statistics.reloads++;
                break;
                
            case 'escape_success':
                this.statistics.successful_escapes++;
                break;
        }
        
        // Check for new achievements after tracking
        this.checkAchievements();
    }
    
    // Get achievement progress
    getAchievementProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return null;
        
        const condition = achievement.conditions;
        let current = 0;
        let total = 1;
        
        switch (condition.type) {
            case 'ai_interactions':
                current = this.statistics.ai_interactions;
                total = condition.count;
                break;
                
            case 'rooms_visited':
                current = this.statistics.rooms_visited.size;
                total = condition.count;
                break;
                
            case 'unique_questions':
                current = this.statistics.unique_questions.size;
                total = condition.count;
                break;
                
            case 'turn_count':
                current = this.statistics.turns_survived;
                total = condition.count;
                break;
                
            case 'item_used':
                current = this.statistics.items_used.get(condition.item) || 0;
                total = condition.count;
                break;
                
            case 'ability_used':
                current = this.statistics.abilities_used.get(condition.ability) || 0;
                total = condition.count;
                break;
                
            case 'easter_eggs_found':
                current = this.statistics.easter_eggs_found.size;
                total = condition.count;
                break;
                
            default:
                // For boolean conditions, either complete or not
                return achievement.unlocked ? { current: 1, total: 1, percentage: 100 } : { current: 0, total: 1, percentage: 0 };
        }
        
        const percentage = Math.min(100, Math.round((current / total) * 100));
        return { current, total, percentage };
    }
    
    // Get achievements by category
    getAchievementsByCategory(category) {
        return Object.values(this.achievements).filter(achievement => 
            achievement.category === category
        );
    }
    
    // Get unlocked achievements
    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(achievement => 
            achievement.unlocked
        );
    }
    
    // Get locked achievements (excluding hidden ones)
    getLockedAchievements() {
        return Object.values(this.achievements).filter(achievement => 
            !achievement.unlocked && !achievement.hidden
        );
    }
    
    // Get total points earned
    getTotalPoints() {
        return this.getUnlockedAchievements().reduce((total, achievement) => 
            total + achievement.points, 0
        );
    }
    
    // Get total achievements unlocked
    getTotalUnlocked() {
        return this.getUnlockedAchievements().length;
    }
    
    // Get achievement completion percentage
    getCompletionPercentage() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.getTotalUnlocked();
        return Math.round((unlocked / total) * 100);
    }
    
    // Get player statistics summary
    getStatisticsSummary() {
        return {
            ai_interactions: this.statistics.ai_interactions,
            unique_questions: this.statistics.unique_questions.size,
            rooms_visited: this.statistics.rooms_visited.size,
            turns_survived: this.statistics.turns_survived,
            achievements_unlocked: this.getTotalUnlocked(),
            total_points: this.getTotalPoints(),
            completion_percentage: this.getCompletionPercentage(),
            max_sanity: this.statistics.max_sanity_reached,
            max_awareness: this.statistics.max_awareness_reached,
            deaths: this.statistics.deaths,
            successful_escapes: this.statistics.successful_escapes
        };
    }
    
    // Export achievements data
    exportAchievements() {
        return {
            achievements: this.achievements,
            statistics: {
                ...this.statistics,
                unique_questions: Array.from(this.statistics.unique_questions),
                rooms_visited: Array.from(this.statistics.rooms_visited),
                easter_eggs_found: Array.from(this.statistics.easter_eggs_found),
                items_used: Object.fromEntries(this.statistics.items_used),
                abilities_used: Object.fromEntries(this.statistics.abilities_used),
                time_in_ai_states: Object.fromEntries(this.statistics.time_in_ai_states)
            }
        };
    }
    
    // Import achievements data
    importAchievements(data) {
        if (data.achievements) {
            Object.assign(this.achievements, data.achievements);
        }
        
        if (data.statistics) {
            Object.assign(this.statistics, data.statistics);
            
            // Convert arrays back to Sets
            if (data.statistics.unique_questions) {
                this.statistics.unique_questions = new Set(data.statistics.unique_questions);
            }
            if (data.statistics.rooms_visited) {
                this.statistics.rooms_visited = new Set(data.statistics.rooms_visited);
            }
            if (data.statistics.easter_eggs_found) {
                this.statistics.easter_eggs_found = new Set(data.statistics.easter_eggs_found);
            }
            
            // Convert objects back to Maps
            if (data.statistics.items_used) {
                this.statistics.items_used = new Map(Object.entries(data.statistics.items_used));
            }
            if (data.statistics.abilities_used) {
                this.statistics.abilities_used = new Map(Object.entries(data.statistics.abilities_used));
            }
            if (data.statistics.time_in_ai_states) {
                this.statistics.time_in_ai_states = new Map(Object.entries(data.statistics.time_in_ai_states));
            }
        }
    }
    
    // Reset achievements (for new game)
    resetAchievements() {
        Object.values(this.achievements).forEach(achievement => {
            achievement.unlocked = false;
            delete achievement.unlockedAt;
        });
        
        this.statistics = this.initializeStatistics();
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}
