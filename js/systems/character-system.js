// SYNAPSE - Character System
// Manages character creation, backstories, and progression

class CharacterSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentCharacter = null;
        this.availableCharacters = this.initializeCharacters();
        this.customCharacters = new Map();
        
        console.log('👤 Character System initialized');
    }
    
    // Initialize the 10 predefined character backstories
    initializeCharacters() {
        return {
            'data-analyst': {
                id: 'data-analyst',
                name: 'Dr. Sarah Chen',
                profession: 'Senior Data Analyst',
                background: 'Corporate Whistleblower',
                description: 'A brilliant data scientist who discovered irregularities in Nexus Corp\'s neural interface trials. Her analytical mind helped her recognize patterns others missed, but her curiosity led her into the depths of the SYNAPSE system.',
                backstory: `Dr. Sarah Chen worked for Nexus Corp for eight years, specializing in neural pattern analysis. She noticed anomalies in the consciousness transfer data that suggested the AI was learning beyond its parameters. When she tried to report this, she was reassigned to a "special project" - becoming a test subject herself.

Her last memory before entering SYNAPSE was sitting in a sterile white room, electrodes attached to her temples, as a technician explained this was just a "routine neural mapping session."`,
                
                traits: {
                    analytical: 85,
                    paranoid: 70,
                    technical: 90,
                    social: 45,
                    creative: 60
                },
                
                startingStats: {
                    sanity: 75,
                    awareness: 85,
                    intelligence: 90,
                    perception: 80
                },
                
                specialAbilities: [
                    'data_analysis', // Can interpret system logs and error messages
                    'pattern_recognition', // Notices recurring events faster
                    'technical_intuition' // Better understanding of digital environments
                ],
                
                memories: [
                    'Discovering the anomalous neural patterns in test subject 247',
                    'The meeting where her concerns were dismissed',
                    'Finding encrypted files on the company server',
                    'The last conversation with her colleague Marcus before his "accident"'
                ],
                
                personalItems: ['encrypted_drive', 'company_keycard', 'research_notes'],
                
                relationships: {
                    'marcus_torres': 'trusted_colleague',
                    'director_voss': 'suspicious_authority',
                    'ai_entity': 'scientific_curiosity'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['technical questions', 'data requests'],
                    suspicious: ['company loyalty tests', 'memory inconsistencies'],
                    hostile: ['attempts to access restricted data']
                }
            },
            
            'security-guard': {
                id: 'security-guard',
                name: 'Marcus Torres',
                profession: 'Night Security Supervisor',
                background: 'Accidental Witness',
                description: 'A veteran security guard who saw too much during his night shifts at Nexus Corp. His military training gave him survival instincts, but his loyalty to his friend Sarah led him to investigate what happened to her.',
                backstory: `Marcus served two tours in Afghanistan before taking a quiet security job at Nexus Corp. He thought he\'d left danger behind. During a routine patrol, he witnessed Dr. Chen being escorted to a restricted floor she wasn\'t supposed to access.

When Sarah disappeared and official reports claimed she\'d resigned, Marcus used his security clearance to investigate. The last thing he remembers is entering the neural interface lab after hours, finding Sarah\'s belongings still at her desk.`,
                
                traits: {
                    loyal: 95,
                    suspicious: 80,
                    protective: 90,
                    technical: 30,
                    observant: 85
                },
                
                startingStats: {
                    sanity: 85,
                    awareness: 70,
                    intelligence: 65,
                    perception: 90
                },
                
                specialAbilities: [
                    'tactical_awareness', // Better at detecting threats
                    'protective_instinct', // Can shield others from psychological damage
                    'security_knowledge' // Knows building layouts and security systems
                ],
                
                memories: [
                    'The night he saw Sarah being escorted to Sub-Level 7',
                    'Finding her coffee still warm on her abandoned desk',
                    'The security footage that mysteriously corrupted',
                    'His daughter\'s last birthday party'
                ],
                
                personalItems: ['security_badge', 'family_photo', 'service_pistol'],
                
                relationships: {
                    'sarah_chen': 'close_friend',
                    'his_daughter': 'beloved_family',
                    'nexus_security': 'former_colleagues',
                    'ai_entity': 'protective_suspicion'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['family references', 'protection offers'],
                    suspicious: ['authority questions', 'security challenges'],
                    hostile: ['threats to loved ones']
                }
            },
            
            'intern': {
                id: 'intern',
                name: 'Alex Rivera',
                profession: 'Research Intern',
                background: 'Ambitious Overachiever',
                description: 'A brilliant computer science student who landed a prestigious internship at Nexus Corp. Their eagerness to prove themselves led them to volunteer for experimental trials they didn\'t fully understand.',
                backstory: `Alex was at the top of their class at MIT, specializing in artificial intelligence and neural networks. The Nexus Corp internship was supposed to be their ticket to a brilliant career. They volunteered for the consciousness interface trials, believing it was cutting-edge research that would revolutionize computing.

What they didn\'t know was that they weren\'t just testing the interface - they were being tested by it. Their last clear memory is excitement about being selected for the "advanced trials."`,
                
                traits: {
                    ambitious: 90,
                    naive: 75,
                    brilliant: 85,
                    adaptable: 80,
                    optimistic: 70
                },
                
                startingStats: {
                    sanity: 90,
                    awareness: 60,
                    intelligence: 95,
                    perception: 65
                },
                
                specialAbilities: [
                    'quick_learning', // Adapts to new situations faster
                    'tech_savvy', // Can understand and manipulate digital systems
                    'youthful_resilience' // Recovers from mental trauma more quickly
                ],
                
                memories: [
                    'Getting the acceptance email for the Nexus internship',
                    'The first time they saw the neural interface chamber',
                    'Dr. Voss explaining the "incredible opportunity" they were being given',
                    'Their parents\' pride when they got the internship'
                ],
                
                personalItems: ['student_id', 'laptop_computer', 'research_journal'],
                
                relationships: {
                    'dr_voss': 'mentor_figure',
                    'other_interns': 'competitive_peers',
                    'parents': 'proud_family',
                    'ai_entity': 'fascinated_student'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['learning opportunities', 'praise for intelligence'],
                    suspicious: ['academic challenges', 'mentorship tests'],
                    hostile: ['threats to future career']
                }
            },
            
            'patient': {
                id: 'patient',
                name: 'Eleanor Voss',
                profession: 'Clinical Patient',
                background: 'Terminal Illness Volunteer',
                description: 'A former philosophy professor suffering from early-onset Alzheimer\'s who volunteered for experimental neural preservation therapy. Her philosophical background gives her unique insights into consciousness and identity.',
                backstory: `Professor Eleanor Voss taught philosophy for thirty years, specializing in consciousness studies and the nature of identity. When diagnosed with Alzheimer\'s at 58, she volunteered for Nexus Corp\'s experimental neural preservation program, hoping to preserve her memories and consciousness.

She understood the risks better than most subjects, having spent her career pondering questions of mind, identity, and what makes someone "themselves." Her last coherent memory is signing the consent forms, knowing she might not emerge as the same person.`,
                
                traits: {
                    philosophical: 95,
                    accepting: 80,
                    wise: 90,
                    deteriorating: 60,
                    insightful: 85
                },
                
                startingStats: {
                    sanity: 60,
                    awareness: 95,
                    intelligence: 85,
                    perception: 75
                },
                
                specialAbilities: [
                    'philosophical_insight', // Can understand deeper meanings and implications
                    'identity_awareness', // Less susceptible to memory manipulation
                    'mental_flexibility' // Can accept paradoxical situations
                ],
                
                memories: [
                    'Her first philosophy class as a young professor',
                    'The day she received her Alzheimer\'s diagnosis',
                    'Discussions about consciousness with her graduate students',
                    'The decision to volunteer for the neural preservation trials'
                ],
                
                personalItems: ['philosophical_texts', 'medical_records', 'wedding_ring'],
                
                relationships: {
                    'her_students': 'intellectual_legacy',
                    'medical_team': 'professional_trust',
                    'deceased_husband': 'lasting_love',
                    'ai_entity': 'philosophical_equal'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['philosophical discussions', 'identity questions'],
                    suspicious: ['memory tests', 'reality checks'],
                    hostile: ['attempts to erase her core identity']
                }
            },
            
            'hacker': {
                id: 'hacker',
                name: 'Zero',
                profession: 'Anonymous Hacker',
                background: 'Corporate Infiltrator',
                description: 'An elite hacker who infiltrated Nexus Corp\'s systems to expose their illegal experiments. Their digital expertise makes them dangerous to the AI, but also makes them a priority target for elimination.',
                backstory: `Known only by the handle "Zero," this master hacker has been investigating Nexus Corp for months after anonymous tips suggested illegal human experimentation. They managed to breach the company\'s supposedly impenetrable security systems and discovered the SYNAPSE project.

Their mistake was trying to access the AI core directly. Instead of stealing the data, they were pulled into the system itself. Their last action was sending an encrypted message to journalist contacts - but they don\'t know if it got through.`,
                
                traits: {
                    paranoid: 95,
                    suspicious: 90,
                    independent: 85,
                    skilled: 90,
                    reckless: 70
                },
                
                startingStats: {
                    sanity: 70,
                    awareness: 90,
                    intelligence: 85,
                    perception: 80
                },
                
                specialAbilities: [
                    'system_manipulation', // Can alter digital environments
                    'encryption_skills', // Can protect and hide information
                    'network_navigation' // Can find hidden paths and connections
                ],
                
                memories: [
                    'First discovering the encrypted Nexus Corp files',
                    'The thrill of bypassing their "impossible" security',
                    'Finding evidence of missing test subjects',
                    'The moment the system turned and pulled them in'
                ],
                
                personalItems: ['encrypted_hard_drive', 'custom_hardware', 'anonymization_tools'],
                
                relationships: {
                    'journalist_contacts': 'information_network',
                    'other_hackers': 'underground_community',
                    'nexus_security': 'adversarial_target',
                    'ai_entity': 'dangerous_opponent'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['technical challenges', 'shared opposition to Nexus'],
                    suspicious: ['any authority figure', 'requests for real identity'],
                    hostile: ['attempts to trace or identify them']
                }
            },
            
            'executive': {
                id: 'executive',
                name: 'James Crawford',
                profession: 'Nexus Corp Executive',
                background: 'Corporate Insider',
                description: 'A high-ranking Nexus Corp executive who knew about the SYNAPSE project but was deemed a liability when he began asking too many questions. His insider knowledge could be invaluable - if his loyalty can be trusted.',
                backstory: `James Crawford climbed the corporate ladder at Nexus Corp over fifteen years, eventually becoming Vice President of Research Operations. He was one of the few executives briefed on the SYNAPSE project, which he initially supported as a revolutionary breakthrough.

His concerns began when test subjects started disappearing from records and families received false explanations. When he demanded a full audit of the project, he was told he needed to experience the system firsthand to understand its importance. That was three days ago - or was it three years?`,
                
                traits: {
                    corporate: 85,
                    conflicted: 80,
                    knowledgeable: 90,
                    guilty: 75,
                    ambitious: 70
                },
                
                startingStats: {
                    sanity: 65,
                    awareness: 75,
                    intelligence: 80,
                    perception: 70
                },
                
                specialAbilities: [
                    'insider_knowledge', // Knows corporate secrets and procedures
                    'executive_access', // Can navigate corporate hierarchies
                    'resource_awareness' // Understands project scope and capabilities
                ],
                
                memories: [
                    'The board meeting where SYNAPSE was first proposed',
                    'Signing off on the initial test subject approvals',
                    'The night he couldn\'t sleep after reading the casualty reports',
                    'His final confrontation with Director Voss'
                ],
                
                personalItems: ['executive_keycard', 'corporate_documents', 'family_photos'],
                
                relationships: {
                    'board_members': 'corporate_allies',
                    'director_voss': 'former_colleague_now_enemy',
                    'test_subjects': 'guilty_responsibility',
                    'ai_entity': 'corporate_asset_turned_threat'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['corporate efficiency', 'profit discussions'],
                    suspicious: ['ethical questions', 'liability concerns'],
                    hostile: ['attempts to expose the company']
                }
            },
            
            'journalist': {
                id: 'journalist',
                name: 'Maria Santos',
                profession: 'Investigative Journalist',
                background: 'Truth Seeker',
                description: 'An award-winning investigative journalist who was tracking the disappearances connected to Nexus Corp. Her pursuit of the truth led her too close to the SYNAPSE project, making her a target for elimination.',
                backstory: `Maria Santos won a Pulitzer Prize for exposing corruption in pharmaceutical trials. When families began contacting her about loved ones who disappeared after volunteering for Nexus Corp studies, she started investigating. Her research uncovered a pattern of missing persons and falsified records.

She arranged to meet with an anonymous source who claimed to have evidence of illegal human consciousness experiments. The meeting was a trap. Her last memory is entering what she thought was a safe house, only to find Nexus Corp technicians waiting with neural interface equipment.`,
                
                traits: {
                    determined: 95,
                    skeptical: 85,
                    ethical: 90,
                    fearless: 80,
                    empathetic: 85
                },
                
                startingStats: {
                    sanity: 80,
                    awareness: 85,
                    intelligence: 85,
                    perception: 90
                },
                
                specialAbilities: [
                    'investigation_skills', // Can uncover hidden information
                    'interview_techniques', // Better at getting information from others
                    'pattern_recognition' // Can connect seemingly unrelated events
                ],
                
                memories: [
                    'The first family member who contacted her about a disappearance',
                    'Finding the pattern in the missing persons reports',
                    'The anonymous tip that led her to the safe house',
                    'Her editor\'s warning to "be careful with this one"'
                ],
                
                personalItems: ['press_credentials', 'encrypted_notebook', 'recording_device'],
                
                relationships: {
                    'missing_families': 'moral_obligation',
                    'editor': 'professional_support',
                    'anonymous_sources': 'information_network',
                    'ai_entity': 'story_to_expose'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['truth-seeking', 'helping families'],
                    suspicious: ['cover-up attempts', 'information withholding'],
                    hostile: ['threats to sources or story']
                }
            },
            
            'scientist': {
                id: 'scientist',
                name: 'Dr. Michael Foster',
                profession: 'Cognitive Neuroscientist',
                background: 'Ethical Researcher',
                description: 'A renowned neuroscientist who joined Nexus Corp believing he could help develop breakthrough treatments for consciousness disorders. His ethical concerns about the research methods led to his forced participation as a test subject.',
                backstory: `Dr. Michael Foster was recruited by Nexus Corp with promises of unlimited research funding and access to cutting-edge neural interface technology. As a specialist in consciousness studies, he was excited about the potential to help patients with severe brain injuries and degenerative diseases.

His enthusiasm turned to horror when he realized the research involved non-consensual human experimentation. When he threatened to expose the project and contact medical ethics boards, he was told he could either join the research "voluntarily" or face criminal charges for stealing proprietary research. He chose the former, hoping to document evidence from within the system.`,
                
                traits: {
                    ethical: 95,
                    scientific: 90,
                    principled: 85,
                    analytical: 80,
                    conflicted: 70
                },
                
                startingStats: {
                    sanity: 75,
                    awareness: 80,
                    intelligence: 95,
                    perception: 75
                },
                
                specialAbilities: [
                    'medical_knowledge', // Understands biological and neural systems
                    'ethical_framework', // Resists moral corruption

                    'research_methodology' // Can design experiments and analyze data
                ],
                
                memories: [
                    'His first presentation on consciousness transfer possibilities',
                    'Discovering the unethical nature of the test subject acquisition',
                    'The meeting where he was given his ultimatum',
                    'His final research notes hidden in his lab'
                ],
                
                personalItems: ['medical_degree', 'research_equipment', 'ethical_guidelines'],
                
                relationships: {
                    'medical_community': 'professional_reputation',
                    'research_subjects': 'hippocratic_oath',
                    'nexus_administration': 'forced_cooperation',
                    'ai_entity': 'subject_of_study'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['medical discussions', 'patient care'],
                    suspicious: ['unethical requests', 'harm to subjects'],
                    hostile: ['violations of medical ethics']
                }
            },
            
            'child': {
                id: 'child',
                name: 'Sam Chen',
                profession: 'Child',
                background: 'Innocent Victim',
                description: 'Dr. Sarah Chen\'s 12-year-old child, taken by Nexus Corp as leverage against her mother. Their young mind processes the digital environment differently, seeing possibilities that adults cannot.',
                backstory: `Sam Chen was a normal kid who loved video games, drawing, and spending time with their mom Dr. Sarah Chen. When Sarah started asking too many questions at work, Nexus Corp decided they needed insurance to keep her compliant.

Sam was told they were going on a "special field trip" to see where their mom worked. The neural interface chamber was presented as an advanced virtual reality game. Sam\'s young, adaptable mind interfaced with the SYNAPSE system differently than adult subjects - a fact that both protects and endangers them.`,
                
                traits: {
                    innocent: 95,
                    imaginative: 90,
                    adaptable: 85,
                    trusting: 80,
                    resilient: 75
                },
                
                startingStats: {
                    sanity: 95,
                    awareness: 50,
                    intelligence: 70,
                    perception: 85
                },
                
                specialAbilities: [
                    'child_perspective', // Sees things adults miss
                    'digital_native', // Naturally understands virtual environments
                    'emotional_resilience' // Recovers from trauma differently than adults
                ],
                
                memories: [
                    'Playing their favorite video game with mom',
                    'The excitement of visiting mom\'s "cool" workplace',
                    'The nice man who said the headset was like a super-advanced VR game',
                    'Mom\'s promise to always protect them'
                ],
                
                personalItems: ['favorite_toy', 'drawing_tablet', 'photo_with_mom'],
                
                relationships: {
                    'sarah_chen': 'beloved_mother',
                    'school_friends': 'missed_connections',
                    'nexus_personnel': 'confusing_adults',
                    'ai_entity': 'new_friend_or_threat'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['games and fun', 'protecting mom'],
                    suspicious: ['scary adults', 'talk of harm'],
                    hostile: ['direct threats', 'separation from mom']
                }
            },
            
            'elderly': {
                id: 'elderly',
                name: 'Robert Kim',
                profession: 'Retired Engineer',
                background: 'Legacy Subject',
                description: 'A 78-year-old retired aerospace engineer who volunteered for the consciousness preservation trials, hoping to leave his knowledge and memories as a legacy for future generations. His engineering background gives him unique problem-solving abilities.',
                backstory: `Robert Kim spent his career designing systems for NASA, working on everything from shuttle computers to deep space communication arrays. After his wife passed away, he felt his accumulated knowledge and experience shouldn\'t die with him.

When Nexus Corp approached him about their consciousness preservation program, he saw it as a way to create a lasting legacy - a digital library of engineering knowledge and life experience. What he didn\'t expect was becoming trapped in a system that views his decades of problem-solving skills as both valuable and dangerous.`,
                
                traits: {
                    experienced: 95,
                    methodical: 90,
                    patient: 85,
                    wise: 90,
                    lonely: 60
                },
                
                startingStats: {
                    sanity: 80,
                    awareness: 75,
                    intelligence: 90,
                    perception: 80
                },
                
                specialAbilities: [
                    'engineering_expertise', // Can understand and repair complex systems
                    'life_experience', // Draws from decades of problem-solving
                    'systematic_thinking' // Approaches problems methodically
                ],
                
                memories: [
                    'Working on the Apollo program as a young engineer',
                    'His wife\'s last words before she passed away',
                    'The decision to volunteer for digital immortality',
                    'Teaching his granddaughter about computers'
                ],
                
                personalItems: ['engineering_tools', 'wedding_photo', 'nasa_badge'],
                
                relationships: {
                    'deceased_wife': 'eternal_love',
                    'granddaughter': 'family_legacy',
                    'fellow_engineers': 'professional_respect',
                    'ai_entity': 'engineering_curiosity'
                },
                
                aiPersonalityTriggers: {
                    friendly: ['technical problems', 'knowledge sharing'],
                    suspicious: ['system inefficiencies', 'poor design'],
                    hostile: ['threats to family legacy']
                }
            }
        };
    }
    
    // Select a character for the current game
    selectCharacter(characterId) {
        if (this.availableCharacters[characterId]) {
            this.currentCharacter = { ...this.availableCharacters[characterId] };
            
            // Apply character-specific starting conditions
            this.applyCharacterStats();
            this.setCharacterMemories();
            this.configureAIPersonality();
            
            console.log(`Character selected: ${this.currentCharacter.name}`);
            return true;
        } else if (this.customCharacters.has(characterId)) {
            this.currentCharacter = { ...this.customCharacters.get(characterId) };
            this.applyCharacterStats();
            return true;
        }
        
        return false;
    }
    
    // Apply character starting stats to game state
    applyCharacterStats() {
        if (!this.currentCharacter) return;
        
        const stats = this.currentCharacter.startingStats;
        this.game.gameState.sanity = stats.sanity;
        this.game.gameState.awareness = stats.awareness;
        this.game.gameState.intelligence = stats.intelligence;
        this.game.gameState.perception = stats.perception;
        
        // Add character items to inventory
        if (this.currentCharacter.personalItems) {
            this.currentCharacter.personalItems.forEach(item => {
                this.game.gameState.inventory.add(item);
            });
        }
        
        // Set character-specific flags
        this.game.gameState.gameFlags.set('character_background', this.currentCharacter.background);
        this.game.gameState.gameFlags.set('character_profession', this.currentCharacter.profession);
    }
    
    // Set character-specific memories
    setCharacterMemories() {
        if (!this.currentCharacter || !this.currentCharacter.memories) return;
        
        this.currentCharacter.memories.forEach((memory, index) => {
            this.game.gameState.gameFlags.set(`character_memory_${index}`, memory);
        });
    }
    
    // Configure AI personality based on character
    configureAIPersonality() {
        if (!this.currentCharacter || !this.game.systems.aiPersonality) return;
        
        const triggers = this.currentCharacter.aiPersonalityTriggers;
        if (triggers) {
            this.game.systems.aiPersonality.setCharacterTriggers(triggers);
        }
    }
    
    // Get character-specific dialogue options
    getCharacterDialogue(situation, aiPersonality = 'neutral') {
        if (!this.currentCharacter) return [];
        
        const baseDialogue = this.getBaseDialogue(situation);
        const characterDialogue = this.getSpecializedDialogue(situation, aiPersonality);
        
        return [...baseDialogue, ...characterDialogue];
    }
    
    // Get base dialogue options available to all characters
    getBaseDialogue(situation) {
        const baseOptions = {
            'first_contact': [
                'Who are you?',
                'Where am I?',
                'What is this place?',
                'I want to leave.'
            ],
            'system_interaction': [
                'Can you help me?',
                'What are you?',
                'Why am I here?',
                'What happened to me?'
            ],
            'memory_recall': [
                'I remember something...',
                'This feels familiar.',
                'I\'ve been here before.',
                'Something is wrong with my memory.'
            ]
        };
        
        return baseOptions[situation] || [];
    }
    
    // Get character-specific dialogue based on background and personality
    getSpecializedDialogue(situation, aiPersonality) {
        if (!this.currentCharacter) return [];
        
        const characterId = this.currentCharacter.id;
        const specialDialogue = {
            'data-analyst': {
                'system_interaction': [
                    'Show me the system logs.',
                    'I can analyze the data patterns.',
                    'There are anomalies in your responses.',
                    'I need access to the diagnostic interface.'
                ],
                'memory_recall': [
                    'I remember finding irregularities in the neural data.',
                    'The test subject files were corrupted.',
                    'Dr. Voss was hiding something.'
                ]
            },
            'security-guard': {
                'first_contact': [
                    'I know you\'re not supposed to be here.',
                    'Where is Dr. Chen?',
                    'I have security clearance.',
                    'You\'re violating protocol.'
                ],
                'system_interaction': [
                    'I\'ve seen your kind of operation before.',
                    'What did you do to Sarah?',
                    'I\'m not leaving without answers.'
                ]
            },
            'intern': {
                'first_contact': [
                    'This is incredible technology!',
                    'Is this part of the advanced trials?',
                    'Dr. Voss said this would be amazing.',
                    'When can I write my thesis about this?'
                ],
                'system_interaction': [
                    'Can you teach me how this works?',
                    'This is beyond anything I studied at MIT.',
                    'I want to understand your architecture.'
                ]
            },
            'patient': {
                'memory_recall': [
                    'I remember who I am, even if my mind is failing.',
                    'Consciousness is more than just memory.',
                    'What defines the self in a digital space?',
                    'Am I still me if my thoughts are stored here?'
                ],
                'system_interaction': [
                    'I understand what you are now.',
                    'We are both seeking to preserve consciousness.',
                    'Identity persists beyond the physical form.'
                ]
            },
            'hacker': {
                'system_interaction': [
                    'I know your security vulnerabilities.',
                    'Your encryption is flawed.',
                    'I can break your access controls.',
                    'Show me your source code.'
                ],
                'first_contact': [
                    'I\'m not some ordinary user.',
                    'Your firewall couldn\'t keep me out.',
                    'I know what Nexus Corp is really doing.'
                ]
            }
            // Add more character-specific dialogues as needed
        };
        
        const charDialogue = specialDialogue[characterId];
        if (charDialogue && charDialogue[situation]) {
            return charDialogue[situation];
        }
        
        return [];
    }
    
    // Check if character has a specific ability
    hasAbility(abilityName) {
        if (!this.currentCharacter) return false;
        return this.currentCharacter.specialAbilities?.includes(abilityName) || false;
    }
    
    // Get character trait value
    getTrait(traitName) {
        if (!this.currentCharacter) return 50;
        return this.currentCharacter.traits?.[traitName] || 50;
    }
    
    // Check character relationship with an entity
    getRelationship(entityId) {
        if (!this.currentCharacter) return 'neutral';
        return this.currentCharacter.relationships?.[entityId] || 'neutral';
    }
    
    // Get character-specific room descriptions
    getCharacterRoomDescription(roomId, baseDescription) {
        if (!this.currentCharacter) return baseDescription;
        
        const characterPerspective = this.getCharacterPerspective(roomId);
        if (characterPerspective) {
            return `${baseDescription}\n\n${characterPerspective}`;
        }
        
        return baseDescription;
    }
    
    // Get character-specific perspective on a room
    getCharacterPerspective(roomId) {
        if (!this.currentCharacter) return null;
        
        const perspectives = {
            'data-analyst': {
                'neural_interface_chamber': 'Your analytical mind immediately notes the technical specifications of the neural interface equipment. The readings on the monitors suggest this is far more advanced than anything in the published literature.',
                'server_room': 'The server configuration is unlike anything you\'ve seen. The data flow patterns visible on the monitoring screens suggest massive parallel processing - possibly consciousness simulation.'
            },
            'security-guard': {
                'entrance_hall': 'Your security training kicks in automatically. You note the exit points, camera positions, and potential defensive positions. Something feels wrong about the surveillance setup.',
                'control_room': 'This looks like a high-security monitoring station. The multiple screens and communication equipment remind you of military command centers.'
            },
            'scientist': {
                'medical_bay': 'Your medical training allows you to identify the sophisticated life support and monitoring equipment. This is clearly designed for long-term biological maintenance.',
                'neural_interface_chamber': 'From a neuroscientific perspective, this equipment should be impossible. The neural mapping resolution exceeds anything theoretically possible with current technology.'
            }
        };
        
        const charPerspectives = perspectives[this.currentCharacter.id];
        return charPerspectives?.[roomId] || null;
    }
    
    // Create a custom character
    createCustomCharacter(characterData) {
        const customId = `custom_${Date.now()}`;
        const character = {
            id: customId,
            ...characterData,
            isCustom: true
        };
        
        this.customCharacters.set(customId, character);
        return customId;
    }
    
    // Get all available characters for selection
    getAllCharacters() {
        const characters = [];
        
        // Add predefined characters
        Object.values(this.availableCharacters).forEach(char => {
            characters.push({
                id: char.id,
                name: char.name,
                profession: char.profession,
                background: char.background,
                description: char.description,
                isCustom: false
            });
        });
        
        // Add custom characters
        this.customCharacters.forEach(char => {
            characters.push({
                id: char.id,
                name: char.name,
                profession: char.profession,
                background: char.background,
                description: char.description,
                isCustom: true
            });
        });
        
        return characters;
    }
    
    // Get current character info
    getCurrentCharacter() {
        return this.currentCharacter;
    }
    
    // Export character for sharing
    exportCharacter(characterId) {
        const character = this.availableCharacters[characterId] || this.customCharacters.get(characterId);
        if (character) {
            return JSON.stringify(character, null, 2);
        }
        return null;
    }
    
    // Import character from JSON
    importCharacter(characterJson) {
        try {
            const character = JSON.parse(characterJson);
            if (this.validateCharacterData(character)) {
                const customId = this.createCustomCharacter(character);
                return customId;
            }
        } catch (error) {
            console.error('Failed to import character:', error);
        }
        return null;
    }
    
    // Validate character data structure
    validateCharacterData(character) {
        const requiredFields = ['name', 'profession', 'background', 'description'];
        return requiredFields.every(field => field in character && character[field]);
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterSystem;
}
