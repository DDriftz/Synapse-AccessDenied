// SYNAPSE - Localization Data
// Multi-language support and accessibility text

const LocalizationData = {
    // Default language
    defaultLanguage: 'en',
    
    // Available languages
    languages: {
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'it': 'Italiano',
        'pt': 'Português',
        'ru': 'Русский',
        'ja': '日本語',
        'zh': '中文',
        'ko': '한국어'
    },
    
    // Translation data
    translations: {
        // English (base language)
        en: {
            // UI Elements
            ui: {
                loading: 'Loading SYNAPSE System...',
                new_game: 'New Game',
                continue_game: 'Continue',
                settings: 'Settings',
                achievements: 'Achievements',
                credits: 'Credits',
                exit: 'Exit',
                save: 'Save',
                load: 'Load',
                inventory: 'Inventory',
                character: 'Character',
                stats: 'Statistics',
                help: 'Help',
                back: 'Back',
                confirm: 'Confirm',
                cancel: 'Cancel',
                yes: 'Yes',
                no: 'No',
                ok: 'OK',
                close: 'Close',
                next: 'Next',
                previous: 'Previous',
                menu: 'Menu',
                options: 'Options',
                volume: 'Volume',
                difficulty: 'Difficulty',
                language: 'Language',
                accessibility: 'Accessibility'
            },
            
            // Game Interface
            game: {
                command_prompt: 'Enter command:',
                sanity: 'Sanity',
                awareness: 'Awareness',
                intelligence: 'Intelligence',
                perception: 'Perception',
                turn_counter: 'Turn {count}',
                location: 'Location: {room}',
                inventory_count: 'Items: {count}/{max}',
                achievements_unlocked: 'Achievements: {count}',
                health_status: 'Mental State: {status}',
                ai_mood: 'AI State: {mood}',
                time_played: 'Time: {time}',
                auto_save: 'Auto-saved',
                game_over: 'Game Over',
                victory: 'Victory',
                continue_prompt: 'Press any key to continue...'
            },
            
            // Character Selection
            characters: {
                title: 'Choose Your Character',
                subtitle: 'Each character has a unique story and perspective',
                data_analyst: 'Dr. Sarah Chen - Data Analyst',
                security_guard: 'Marcus Torres - Security Guard',
                intern: 'Alex Rivera - Research Intern',
                patient: 'Eleanor Voss - Clinical Patient',
                hacker: 'Zero - Anonymous Hacker',
                executive: 'James Crawford - Corporate Executive',
                journalist: 'Maria Santos - Investigative Journalist',
                scientist: 'Dr. Michael Foster - Neuroscientist',
                child: 'Sam Chen - Innocent Victim',
                elderly: 'Robert Kim - Retired Engineer',
                select_character: 'Select Character',
                character_backstory: 'Backstory',
                character_traits: 'Traits',
                character_abilities: 'Special Abilities'
            },
            
            // Status Messages
            status: {
                healthy: 'Stable',
                stressed: 'Stressed',
                unstable: 'Unstable',
                critical: 'Critical',
                breaking: 'Breaking Down',
                enlightened: 'Enlightened',
                aware: 'Highly Aware',
                confused: 'Confused',
                lost: 'Lost',
                determined: 'Determined',
                terrified: 'Terrified',
                calm: 'Calm',
                angry: 'Angry',
                curious: 'Curious',
                suspicious: 'Suspicious',
                hopeful: 'Hopeful',
                despairing: 'Despairing'
            },
            
            // AI Personality States
            ai_states: {
                friendly: 'Friendly',
                ambiguous: 'Ambiguous',
                sinister: 'Sinister',
                malicious: 'Malicious',
                dormant: 'Dormant',
                calculating: 'Calculating',
                curious: 'Curious',
                hostile: 'Hostile'
            },
            
            // Common Commands
            commands: {
                look: 'look',
                examine: 'examine',
                take: 'take',
                drop: 'drop',
                use: 'use',
                talk: 'talk',
                say: 'say',
                ask: 'ask',
                tell: 'tell',
                go: 'go',
                move: 'move',
                north: 'north',
                south: 'south',
                east: 'east',
                west: 'west',
                up: 'up',
                down: 'down',
                inventory: 'inventory',
                stats: 'stats',
                help: 'help',
                save: 'save',
                load: 'load',
                quit: 'quit',
                wait: 'wait',
                think: 'think',
                remember: 'remember',
                analyze: 'analyze',
                hack: 'hack',
                connect: 'connect',
                disconnect: 'disconnect'
            },
            
            // Error Messages
            errors: {
                unknown_command: 'I don\'t understand that command.',
                invalid_direction: 'You can\'t go that way.',
                item_not_found: 'You don\'t see that here.',
                item_not_in_inventory: 'You don\'t have that item.',
                cannot_take: 'You can\'t take that.',
                cannot_use: 'You can\'t use that here.',
                inventory_full: 'Your inventory is full.',
                save_failed: 'Failed to save the game.',
                load_failed: 'Failed to load the game.',
                no_save_found: 'No save file found.',
                access_denied: 'Access denied.',
                system_error: 'System error occurred.',
                connection_failed: 'Connection failed.',
                insufficient_privileges: 'Insufficient privileges.',
                corrupted_data: 'Data corruption detected.',
                memory_error: 'Memory access error.'
            },
            
            // Success Messages
            success: {
                item_taken: 'You take the {item}.',
                item_dropped: 'You drop the {item}.',
                item_used: 'You use the {item}.',
                command_executed: 'Command executed successfully.',
                save_complete: 'Game saved successfully.',
                load_complete: 'Game loaded successfully.',
                achievement_unlocked: 'Achievement unlocked: {achievement}',
                puzzle_solved: 'Puzzle solved!',
                secret_discovered: 'Secret discovered!',
                connection_established: 'Connection established.',
                access_granted: 'Access granted.',
                data_recovered: 'Data recovered successfully.',
                system_restored: 'System restored.',
                memory_recovered: 'Memory fragment recovered.'
            },
            
            // Warnings
            warnings: {
                dangerous_action: 'Warning: This action may have serious consequences.',
                sanity_low: 'Warning: Your sanity is dangerously low.',
                ai_hostile: 'Warning: The AI has become hostile.',
                memory_corruption: 'Warning: Memory corruption detected.',
                system_unstable: 'Warning: System stability compromised.',
                irreversible_action: 'Warning: This action cannot be undone.',
                data_loss_risk: 'Warning: Risk of data loss.',
                consciousness_risk: 'Warning: Risk to consciousness integrity.',
                point_of_no_return: 'Warning: Point of no return approaching.',
                reality_distortion: 'Warning: Reality distortion in progress.'
            },
            
            // Achievement Descriptions
            achievements: {
                first_awakening: 'Enter the SYNAPSE system for the first time',
                first_ai_contact: 'Have your first conversation with the AI entity',
                memory_recovery: 'Recover your first memory fragment',
                ai_personality_shift: 'Witness the AI\'s personality change',
                truth_seeker: 'Uncover evidence of illegal experiments',
                room_explorer: 'Visit 5 different rooms',
                thorough_explorer: 'Visit all accessible rooms',
                secret_finder: 'Discover a hidden area',
                conversationalist: 'Have 50 conversations with the AI',
                question_master: 'Ask 100 different questions',
                ai_friend: 'Maintain a friendly relationship with the AI',
                ai_nemesis: 'Survive while the AI is hostile',
                mental_fortress: 'Maintain maximum sanity for 50 turns',
                enlightenment: 'Achieve maximum awareness',
                survivor: 'Survive 200 turns',
                death_defier: 'Survive with critically low sanity',
                escape_artist: 'Successfully escape the system',
                digital_ascension: 'Transcend human limitations',
                sacrifice_play: 'Make the ultimate sacrifice'
            },
            
            // Story Elements
            story: {
                introduction: 'Welcome to SYNAPSE - where consciousness meets digital eternity.',
                character_awakening: 'You awaken to find yourself in an unfamiliar digital space.',
                ai_first_words: 'A voice speaks to you from the digital void.',
                memory_flash: 'A fragment of memory surfaces...',
                reality_shift: 'The environment around you shifts and changes.',
                consciousness_merge: 'You feel your consciousness beginning to merge with something else.',
                system_glitch: 'The system flickers and distorts momentarily.',
                escape_attempt: 'You attempt to break free from the digital prison.',
                final_choice: 'The moment of ultimate choice has arrived.',
                ending_approach: 'Your journey in the SYNAPSE system nears its conclusion.'
            }
        },
        
        // Spanish translations (sample)
        es: {
            ui: {
                loading: 'Cargando Sistema SYNAPSE...',
                new_game: 'Nueva Partida',
                continue_game: 'Continuar',
                settings: 'Configuración',
                achievements: 'Logros',
                credits: 'Créditos',
                exit: 'Salir',
                save: 'Guardar',
                load: 'Cargar',
                inventory: 'Inventario',
                character: 'Personaje',
                stats: 'Estadísticas',
                help: 'Ayuda',
                back: 'Atrás',
                confirm: 'Confirmar',
                cancel: 'Cancelar',
                yes: 'Sí',
                no: 'No',
                ok: 'OK',
                close: 'Cerrar',
                menu: 'Menú',
                options: 'Opciones',
                volume: 'Volumen',
                language: 'Idioma'
            },
            
            game: {
                command_prompt: 'Ingrese comando:',
                sanity: 'Cordura',
                awareness: 'Conciencia',
                intelligence: 'Inteligencia',
                perception: 'Percepción',
                turn_counter: 'Turno {count}',
                location: 'Ubicación: {room}',
                game_over: 'Fin del Juego',
                victory: 'Victoria'
            },
            
            errors: {
                unknown_command: 'No entiendo ese comando.',
                invalid_direction: 'No puedes ir por ahí.',
                item_not_found: 'No ves eso aquí.',
                inventory_full: 'Tu inventario está lleno.'
            }
        },
        
        // French translations (sample)
        fr: {
            ui: {
                loading: 'Chargement du Système SYNAPSE...',
                new_game: 'Nouvelle Partie',
                continue_game: 'Continuer',
                settings: 'Paramètres',
                achievements: 'Succès',
                exit: 'Quitter',
                save: 'Sauvegarder',
                load: 'Charger',
                inventory: 'Inventaire',
                help: 'Aide',
                confirm: 'Confirmer',
                cancel: 'Annuler',
                yes: 'Oui',
                no: 'Non'
            },
            
            game: {
                command_prompt: 'Entrez la commande:',
                sanity: 'Santé Mentale',
                awareness: 'Conscience',
                intelligence: 'Intelligence',
                perception: 'Perception',
                game_over: 'Fin du Jeu',
                victory: 'Victoire'
            }
        }
    },
    
    // Accessibility features
    accessibility: {
        // Screen reader friendly descriptions
        screen_reader: {
            loading_progress: 'Loading progress: {percent} percent',
            stat_bar: '{stat} at {value} out of 100',
            inventory_item: 'Item {index} of {total}: {name}',
            menu_option: 'Menu option {index}: {name}',
            character_selection: 'Character option {index}: {name} - {profession}',
            room_description: 'Current location: {room}. {description}',
            ai_speaking: 'AI entity speaking: {message}',
            system_message: 'System message: {message}',
            achievement_notification: 'Achievement unlocked notification: {name}'
        },
        
        // High contrast mode text
        high_contrast: {
            enabled: 'High contrast mode enabled',
            disabled: 'High contrast mode disabled',
            text_description: 'White text on black background for better visibility'
        },
        
        // Text size options
        text_size: {
            small: 'Small text',
            normal: 'Normal text',
            large: 'Large text',
            extra_large: 'Extra large text'
        },
        
        // Audio cues
        audio_cues: {
            enabled: 'Audio cues enabled',
            disabled: 'Audio cues disabled',
            new_message: 'New message received',
            achievement_sound: 'Achievement unlocked sound',
            error_sound: 'Error notification sound',
            success_sound: 'Success notification sound',
            warning_sound: 'Warning notification sound'
        }
    },
    
    // Cultural adaptations
    cultural: {
        // Date and time formats
        date_formats: {
            en: 'MM/DD/YYYY',
            es: 'DD/MM/YYYY',
            fr: 'DD/MM/YYYY',
            de: 'DD.MM.YYYY',
            ja: 'YYYY/MM/DD'
        },
        
        // Number formats
        number_formats: {
            en: '1,234.56',
            es: '1.234,56',
            fr: '1 234,56',
            de: '1.234,56'
        },
        
        // Cultural sensitivities
        content_warnings: {
            psychological_themes: 'This game contains psychological horror themes',
            identity_loss: 'This game explores themes of identity loss',
            consciousness_manipulation: 'This game includes consciousness manipulation themes',
            digital_existentialism: 'This game explores digital existential themes'
        }
    },
    
    // Dynamic text generation helpers
    templates: {
        // Parameterized strings
        parameterized: {
            stat_change: '{stat} {direction} by {amount}',
            item_interaction: 'You {action} the {item}',
            room_transition: 'You {movement} to the {destination}',
            ai_mood_change: 'The AI becomes {mood}',
            time_elapsed: '{amount} {unit} have passed',
            achievement_progress: '{current} of {total} {type} completed'
        },
        
        // Conditional text
        conditional: {
            sanity_dependent: {
                high: 'Your mind feels clear and focused.',
                medium: 'You feel somewhat disoriented.',
                low: 'Your thoughts are becoming fragmented.',
                critical: 'Reality feels unstable and threatening.'
            },
            
            ai_personality_dependent: {
                friendly: 'The AI seems genuinely helpful.',
                ambiguous: 'The AI\'s intentions are unclear.',
                sinister: 'The AI feels threatening and predatory.',
                malicious: 'The AI radiates hostility and malice.'
            }
        }
    }
};

// Localization utility functions
const LocalizationUtils = {
    // Get text in current language with fallback to English
    getText(key, language = 'en', params = {}) {
        const keys = key.split('.');
        let text = LocalizationData.translations[language];
        
        // Navigate to the specific text
        for (const k of keys) {
            if (text && text[k]) {
                text = text[k];
            } else {
                // Fallback to English
                text = LocalizationData.translations.en;
                for (const k2 of keys) {
                    if (text && text[k2]) {
                        text = text[k2];
                    } else {
                        return `[MISSING: ${key}]`;
                    }
                }
                break;
            }
        }
        
        // Replace parameters
        if (typeof text === 'string' && Object.keys(params).length > 0) {
            Object.entries(params).forEach(([param, value]) => {
                text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
            });
        }
        
        return text || `[MISSING: ${key}]`;
    },
    
    // Get available languages
    getLanguages() {
        return LocalizationData.languages;
    },
    
    // Check if language is supported
    isLanguageSupported(language) {
        return language in LocalizationData.translations;
    },
    
    // Get screen reader text
    getScreenReaderText(key, params = {}) {
        const srText = LocalizationData.accessibility.screen_reader[key];
        if (srText && Object.keys(params).length > 0) {
            return Object.entries(params).reduce((text, [param, value]) => {
                return text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
            }, srText);
        }
        return srText || '';
    },
    
    // Format numbers according to locale
    formatNumber(number, language = 'en') {
        const format = LocalizationData.cultural.number_formats[language] || LocalizationData.cultural.number_formats.en;
        // This is a simplified implementation
        return number.toLocaleString(language);
    },
    
    // Format dates according to locale
    formatDate(date, language = 'en') {
        return date.toLocaleDateString(language);
    },
    
    // Get conditional text based on game state
    getConditionalText(type, condition, language = 'en') {
        const conditionals = LocalizationData.templates.conditional[type];
        if (conditionals && conditionals[condition]) {
            return this.getText(`templates.conditional.${type}.${condition}`, language);
        }
        return '';
    }
};

// Export for use in other systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LocalizationData, LocalizationUtils };
}
