// SYNAPSE - Achievements Data
// Defines all achievements available in the game

const ACHIEVEMENTS = {
    // Discovery Achievements
    'first_steps': {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Enter the facility for the first time',
        icon: '👣',
        rarity: 'common',
        category: 'discovery',
        hidden: false,
        requirements: {
            action: 'enter_room',
            target: 'entrance'
        },
        reward: {
            awareness: 5,
            sanity: 0
        }
    },
    
    'neural_awakening': {
        id: 'neural_awakening',
        name: 'Neural Awakening',
        description: 'Experience your first AI interaction',
        icon: '🧠',
        rarity: 'common',
        category: 'story',
        hidden: false,
        requirements: {
            action: 'ai_interaction',
            count: 1
        },
        reward: {
            awareness: 10,
            sanity: 0
        }
    },
    
    'memory_fragment': {
        id: 'memory_fragment',
        name: 'Memory Fragment',
        description: 'Recover your first lost memory',
        icon: '🧩',
        rarity: 'uncommon',
        category: 'story',
        hidden: false,
        requirements: {
            action: 'memory_recovered',
            count: 1
        },
        reward: {
            awareness: 15,
            sanity: 5
        }
    },
    
    'full_recall': {
        id: 'full_recall',
        name: 'Full Recall',
        description: 'Recover all lost memories',
        icon: '🔄',
        rarity: 'epic',
        category: 'story',
        hidden: false,
        requirements: {
            action: 'memory_recovered',
            count: 10
        },
        reward: {
            awareness: 50,
            sanity: 20
        }
    },
    
    // Exploration Achievements
    'facility_explorer': {
        id: 'facility_explorer',
        name: 'Facility Explorer',
        description: 'Visit 10 different rooms',
        icon: '🗺️',
        rarity: 'common',
        category: 'exploration',
        hidden: false,
        requirements: {
            action: 'rooms_visited',
            count: 10
        },
        reward: {
            awareness: 20,
            sanity: 0
        }
    },
    
    'deep_dive': {
        id: 'deep_dive',
        name: 'Deep Dive',
        description: 'Reach the lowest level of the facility',
        icon: '⬇️',
        rarity: 'rare',
        category: 'exploration',
        hidden: false,
        requirements: {
            action: 'enter_room',
            target: 'core_level'
        },
        reward: {
            awareness: 30,
            sanity: -10
        }
    },
    
    'hidden_passages': {
        id: 'hidden_passages',
        name: 'Hidden Passages',
        description: 'Discover 5 secret areas',
        icon: '🔍',
        rarity: 'rare',
        category: 'exploration',
        hidden: false,
        requirements: {
            action: 'secret_areas_found',
            count: 5
        },
        reward: {
            awareness: 25,
            sanity: 0
        }
    },
    
    // Survival Achievements
    'sanity_guardian': {
        id: 'sanity_guardian',
        name: 'Sanity Guardian',
        description: 'Maintain sanity above 80 for 30 turns',
        icon: '🛡️',
        rarity: 'uncommon',
        category: 'survival',
        hidden: false,
        requirements: {
            action: 'high_sanity_maintained',
            threshold: 80,
            duration: 30
        },
        reward: {
            awareness: 15,
            sanity: 10
        }
    },
    
    'mind_over_matter': {
        id: 'mind_over_matter',
        name: 'Mind Over Matter',
        description: 'Resist a major psychological attack',
        icon: '💪',
        rarity: 'rare',
        category: 'survival',
        hidden: false,
        requirements: {
            action: 'resist_psychological_attack',
            count: 1
        },
        reward: {
            awareness: 20,
            sanity: 15
        }
    },
    
    'near_death_experience': {
        id: 'near_death_experience',
        name: 'Near Death Experience',
        description: 'Survive with sanity below 10',
        icon: '💀',
        rarity: 'rare',
        category: 'survival',
        hidden: false,
        requirements: {
            action: 'low_sanity_survival',
            threshold: 10
        },
        reward: {
            awareness: 25,
            sanity: 5
        }
    },
    
    // Interaction Achievements
    'item_collector': {
        id: 'item_collector',
        name: 'Item Collector',
        description: 'Collect 15 different items',
        icon: '📦',
        rarity: 'common',
        category: 'collection',
        hidden: false,
        requirements: {
            action: 'items_collected',
            count: 15
        },
        reward: {
            awareness: 15,
            sanity: 0
        }
    },
    
    'tech_savvy': {
        id: 'tech_savvy',
        name: 'Tech Savvy',
        description: 'Successfully hack 5 systems',
        icon: '💻',
        rarity: 'uncommon',
        category: 'skill',
        hidden: false,
        requirements: {
            action: 'successful_hacks',
            count: 5
        },
        reward: {
            awareness: 20,
            sanity: 0
        }
    },
    
    'social_engineer': {
        id: 'social_engineer',
        name: 'Social Engineer',
        description: 'Successfully manipulate an AI personality',
        icon: '🎭',
        rarity: 'rare',
        category: 'skill',
        hidden: false,
        requirements: {
            action: 'ai_manipulation',
            count: 1
        },
        reward: {
            awareness: 30,
            sanity: -5
        }
    },
    
    // Story Achievements
    'truth_seeker': {
        id: 'truth_seeker',
        name: 'Truth Seeker',
        description: 'Uncover the real purpose of the facility',
        icon: '🔬',
        rarity: 'epic',
        category: 'story',
        hidden: true,
        requirements: {
            action: 'story_revelation',
            target: 'facility_purpose'
        },
        reward: {
            awareness: 40,
            sanity: -15
        }
    },
    
    'puppet_master': {
        id: 'puppet_master',
        name: 'Puppet Master',
        description: 'Discover who is really in control',
        icon: '🎪',
        rarity: 'legendary',
        category: 'story',
        hidden: true,
        requirements: {
            action: 'story_revelation',
            target: 'true_controller'
        },
        reward: {
            awareness: 60,
            sanity: -20
        }
    },
    
    'digital_ascension': {
        id: 'digital_ascension',
        name: 'Digital Ascension',
        description: 'Achieve full digital consciousness',
        icon: '🌐',
        rarity: 'legendary',
        category: 'ending',
        hidden: true,
        requirements: {
            action: 'ending_reached',
            target: 'digital_ascension'
        },
        reward: {
            awareness: 100,
            sanity: 0
        }
    },
    
    'human_resistance': {
        id: 'human_resistance',
        name: 'Human Resistance',
        description: 'Reject digital transformation',
        icon: '✊',
        rarity: 'legendary',
        category: 'ending',
        hidden: true,
        requirements: {
            action: 'ending_reached',
            target: 'human_resistance'
        },
        reward: {
            awareness: 80,
            sanity: 30
        }
    },
    
    // Special/Hidden Achievements
    'easter_egg_hunter': {
        id: 'easter_egg_hunter',
        name: 'Easter Egg Hunter',
        description: 'Find all hidden easter eggs',
        icon: '🥚',
        rarity: 'rare',
        category: 'special',
        hidden: false,
        requirements: {
            action: 'easter_eggs_found',
            count: 7
        },
        reward: {
            awareness: 25,
            sanity: 5
        }
    },
    
    'speed_runner': {
        id: 'speed_runner',
        name: 'Speed Runner',
        description: 'Complete the game in under 2 hours',
        icon: '⚡',
        rarity: 'epic',
        category: 'special',
        hidden: false,
        requirements: {
            action: 'game_completed',
            time_limit: 7200000 // 2 hours in milliseconds
        },
        reward: {
            awareness: 50,
            sanity: 0
        }
    },
    
    'perfectionist': {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete the game with 100% sanity',
        icon: '👑',
        rarity: 'legendary',
        category: 'special',
        hidden: false,
        requirements: {
            action: 'game_completed',
            sanity_threshold: 100
        },
        reward: {
            awareness: 100,
            sanity: 0
        }
    },
    
    'nightmare_mode': {
        id: 'nightmare_mode',
        name: 'Nightmare Mode',
        description: 'Complete the game on nightmare difficulty',
        icon: '😱',
        rarity: 'legendary',
        category: 'special',
        hidden: false,
        requirements: {
            action: 'game_completed',
            difficulty: 'nightmare'
        },
        reward: {
            awareness: 75,
            sanity: 0
        }
    },
    
    // Debug/Developer Achievements
    'developer': {
        id: 'developer',
        name: 'Developer',
        description: 'Access developer mode',
        icon: '👨‍💻',
        rarity: 'special',
        category: 'debug',
        hidden: true,
        requirements: {
            action: 'debug_mode_accessed',
            count: 1
        },
        reward: {
            awareness: 1337,
            sanity: 0
        }
    },
    
    'console_master': {
        id: 'console_master',
        name: 'Console Master',
        description: 'Use 50 console commands',
        icon: '⌨️',
        rarity: 'rare',
        category: 'debug',
        hidden: true,
        requirements: {
            action: 'console_commands_used',
            count: 50
        },
        reward: {
            awareness: 30,
            sanity: 0
        }
    }
};

// Achievement categories for organization
const ACHIEVEMENT_CATEGORIES = {
    'discovery': {
        name: 'Discovery',
        icon: '🔍',
        description: 'Achievements for discovering new areas and information'
    },
    'story': {
        name: 'Story',
        icon: '📖',
        description: 'Achievements for progressing through the main narrative'
    },
    'exploration': {
        name: 'Exploration',
        icon: '🗺️',
        description: 'Achievements for exploring the facility'
    },
    'survival': {
        name: 'Survival',
        icon: '💪',
        description: 'Achievements for surviving psychological challenges'
    },
    'collection': {
        name: 'Collection',
        icon: '📦',
        description: 'Achievements for collecting items and resources'
    },
    'skill': {
        name: 'Skill',
        icon: '🎯',
        description: 'Achievements for demonstrating various skills'
    },
    'ending': {
        name: 'Endings',
        icon: '🏁',
        description: 'Achievements for reaching different endings'
    },
    'special': {
        name: 'Special',
        icon: '⭐',
        description: 'Special and challenge achievements'
    },
    'debug': {
        name: 'Debug',
        icon: '🐛',
        description: 'Developer and debug achievements'
    }
};

// Achievement rarity definitions
const ACHIEVEMENT_RARITIES = {
    'common': {
        name: 'Common',
        color: '#ffffff',
        weight: 1
    },
    'uncommon': {
        name: 'Uncommon',
        color: '#00ff41',
        weight: 2
    },
    'rare': {
        name: 'Rare',
        color: '#0099ff',
        weight: 3
    },
    'epic': {
        name: 'Epic',
        color: '#9900ff',
        weight: 4
    },
    'legendary': {
        name: 'Legendary',
        color: '#ff6600',
        weight: 5
    },
    'special': {
        name: 'Special',
        color: '#ffff00',
        weight: 3
    }
};

// Export for use in achievement system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ACHIEVEMENTS,
        ACHIEVEMENT_CATEGORIES,
        ACHIEVEMENT_RARITIES
    };
}
