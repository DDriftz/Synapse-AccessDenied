// SYNAPSE - Inventory System
// Manages player inventory, items, and item interactions

class InventorySystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.maxInventorySize = 20;
        this.itemDefinitions = this.initializeItems();
        
        console.log('🎒 Inventory System initialized');
    }
    
    // Initialize all item definitions
    initializeItems() {
        return {
            // Character-specific items
            'encrypted_drive': {
                id: 'encrypted_drive',
                name: 'Encrypted Drive',
                description: 'A small USB drive containing encrypted files. The encryption appears to be military-grade.',
                type: 'data',
                usable: true,
                combinable: ['laptop_computer', 'terminal'],
                weight: 1,
                value: 100,
                rarity: 'rare',
                properties: {
                    encryption_level: 'high',
                    data_type: 'research_files',
                    access_required: 'decryption_key'
                },
                useDescription: 'You examine the encrypted drive. Without the proper decryption key, the data remains inaccessible.',
                longDescription: 'A sleek black USB drive with no external markings. When connected to a computer, it prompts for a 256-bit encryption key. The file structure suggests it contains research documents and possibly video files.'
            },
            
            'company_keycard': {
                id: 'company_keycard',
                name: 'Nexus Corp Keycard',
                description: 'A corporate access keycard with magnetic stripe and RFID chip.',
                type: 'access',
                usable: true,
                combinable: ['door', 'terminal', 'elevator'],
                weight: 1,
                value: 50,
                rarity: 'common',
                properties: {
                    access_level: 'employee',
                    department: 'research',
                    expiration: 'active'
                },
                useDescription: 'You swipe the keycard. The access level determines which areas you can enter.',
                longDescription: 'A standard Nexus Corp employee keycard. The photo shows Dr. Sarah Chen, and the access level indicates research department clearance. The RFID chip may contain additional data.'
            },
            
            'research_notes': {
                id: 'research_notes',
                name: 'Research Notes',
                description: 'Handwritten notes documenting anomalies in neural interface data.',
                type: 'document',
                usable: true,
                readable: true,
                weight: 1,
                value: 75,
                rarity: 'uncommon',
                properties: {
                    author: 'dr_sarah_chen',
                    subject: 'neural_anomalies',
                    classification: 'confidential'
                },
                content: `Neural Pattern Analysis - Anomalies Detected
                
Subject 247: Consciousness transfer at 73% efficiency
- Unexpected AI interaction patterns
- Memory corruption in sectors 15-23
- Subject reported "voices" during transfer
- Recommendation: Investigate AI personality development

Subject 251: Transfer terminated at 45%
- Catastrophic personality fragmentation
- AI showed unusual interest in subject's memories
- Emergency extraction protocols failed
- Subject whereabouts unknown

NOTE: Dr. Voss dismissed concerns. Insisting on schedule acceleration.
Something is very wrong with the AI core. It's learning things it shouldn't.`,
                useDescription: 'You read through the research notes, gaining insight into the neural transfer experiments.',
                longDescription: 'Detailed handwritten notes in Dr. Chen\'s precise handwriting. The pages are filled with technical diagrams, data analyses, and increasingly worried observations about the AI\'s behavior.'
            },
            
            'security_badge': {
                id: 'security_badge',
                name: 'Security Badge',
                description: 'A Nexus Corp security badge with photo ID and clearance level.',
                type: 'access',
                usable: true,
                combinable: ['security_door', 'alarm_panel'],
                weight: 1,
                value: 60,
                rarity: 'common',
                properties: {
                    clearance_level: 'level_3',
                    department: 'security',
                    shift: 'night'
                },
                useDescription: 'The security badge provides access to restricted areas and security systems.',
                longDescription: 'Marcus Torres\' security badge, showing his photo and Level 3 clearance. The badge has access to security systems, stairwells, and some restricted areas.'
            },
            
            'family_photo': {
                id: 'family_photo',
                name: 'Family Photo',
                description: 'A worn photograph of Marcus with his young daughter at a birthday party.',
                type: 'personal',
                usable: true,
                weight: 1,
                value: 0,
                rarity: 'unique',
                properties: {
                    emotional_value: 'high',
                    memory_trigger: true,
                    sanity_boost: 10
                },
                useDescription: 'Looking at the photo brings back warm memories and strengthens your resolve.',
                longDescription: 'A cherished photograph showing Marcus Torres lifting his smiling 8-year-old daughter. She\'s wearing a princess crown and he\'s laughing. The photo is creased from being carried in his wallet.'
            },
            
            'student_id': {
                id: 'student_id',
                name: 'MIT Student ID',
                description: 'Alex Rivera\'s MIT student identification card.',
                type: 'identification',
                usable: true,
                weight: 1,
                value: 20,
                rarity: 'common',
                properties: {
                    institution: 'mit',
                    major: 'computer_science',
                    year: 'senior'
                },
                useDescription: 'Your student ID reminds you of your academic achievements and potential.',
                longDescription: 'A current MIT student ID card showing Alex Rivera\'s photo and student information. The card provides library access and identifies Alex as a Computer Science major with a 3.9 GPA.'
            },
            
            'laptop_computer': {
                id: 'laptop_computer',
                name: 'Laptop Computer',
                description: 'A high-end laptop with advanced programming tools and development environments.',
                type: 'technology',
                usable: true,
                combinable: ['encrypted_drive', 'network_port'],
                weight: 3,
                value: 200,
                rarity: 'uncommon',
                properties: {
                    processing_power: 'high',
                    software: 'development_tools',
                    battery_life: 'medium'
                },
                useDescription: 'You boot up the laptop. It has various programming tools and encrypted files.',
                longDescription: 'Alex\'s personal laptop, customized with multiple development environments, hacking tools, and AI research software. The desktop is cluttered with code projects and research papers.'
            },
            
            'medical_records': {
                id: 'medical_records',
                name: 'Medical Records',
                description: 'Eleanor Voss\'s medical files documenting her Alzheimer\'s progression.',
                type: 'document',
                usable: true,
                readable: true,
                weight: 2,
                value: 40,
                rarity: 'common',
                properties: {
                    patient: 'eleanor_voss',
                    condition: 'alzheimers',
                    stage: 'early_onset'
                },
                content: `Patient: Eleanor Voss
Age: 58
Diagnosis: Early-onset Alzheimer's Disease

Cognitive Assessment:
- Memory: Declining short-term, intact long-term
- Language: Philosophy terminology preserved
- Problem-solving: Still excellent for complex abstract concepts
- Identity: Strong sense of self and personal history

Treatment Notes:
Patient volunteered for experimental neural preservation therapy.
Psychological evaluation: Patient fully understands the risks and implications.
Recommendation: Approved for SYNAPSE Project participation.

Dr. Voss (no relation) personally overseeing case.`,
                useDescription: 'Reading the medical records provides insight into Eleanor\'s condition and treatment.',
                longDescription: 'Comprehensive medical files detailing Eleanor\'s diagnosis, cognitive assessments, and treatment history. The documents are thorough and professionally prepared.'
            },
            
            'wedding_ring': {
                id: 'wedding_ring',
                name: 'Wedding Ring',
                description: 'A simple gold wedding band, well-worn from decades of wear.',
                type: 'personal',
                usable: true,
                weight: 1,
                value: 0,
                rarity: 'unique',
                properties: {
                    emotional_value: 'maximum',
                    memory_anchor: true,
                    sanity_boost: 15
                },
                useDescription: 'The wedding ring serves as a powerful anchor to your identity and memories.',
                longDescription: 'Eleanor\'s wedding ring, worn for over 30 years. Inside the band is engraved "To my philosopher, with all my love - David". It\'s her most precious possession.'
            },
            
            'philosophical_texts': {
                id: 'philosophical_texts',
                name: 'Philosophy Books',
                description: 'A collection of well-worn books on consciousness and identity.',
                type: 'book',
                usable: true,
                readable: true,
                weight: 4,
                value: 100,
                rarity: 'rare',
                properties: {
                    subject: 'consciousness_studies',
                    annotation_level: 'extensive',
                    wisdom_bonus: true
                },
                content: `Selected passages from Eleanor's annotated philosophy collection:

"The self is not something ready-made, but something in continuous formation through choice of action." - John Dewey

"I think, therefore I am" - Descartes
[Eleanor's note: But what if 'I' am thinking in a digital space? Am I still 'I'?]

"Personal identity consists not in the identity of substance, but... in the identity of consciousness" - John Locke
[Eleanor's note: This may be more literal than Locke ever imagined.]`,
                useDescription: 'Reading the philosophical texts provides wisdom and perspective on your situation.',
                longDescription: 'A carefully curated collection of Eleanor\'s most important philosophical works, filled with decades of margin notes, bookmarks, and insights into the nature of consciousness and identity.'
            },
            
            // System/Environment items
            'system_terminal': {
                id: 'system_terminal',
                name: 'System Terminal',
                description: 'A computer terminal connected to the SYNAPSE network.',
                type: 'technology',
                usable: true,
                fixed: true,
                combinable: ['keycard', 'encrypted_drive'],
                weight: 0,
                value: 0,
                rarity: 'fixed',
                properties: {
                    access_level: 'user',
                    network_connected: true,
                    ai_monitored: true
                },
                useDescription: 'You access the terminal. The AI is watching your every input.',
                longDescription: 'A sleek terminal interface with a dark screen and glowing prompt. The system responds to typed commands, but you sense that everything you do is being monitored and analyzed.'
            },
            
            'memory_fragment': {
                id: 'memory_fragment',
                name: 'Memory Fragment',
                description: 'A crystallized piece of digital memory, containing preserved experiences.',
                type: 'memory',
                usable: true,
                weight: 0,
                value: 0,
                rarity: 'special',
                properties: {
                    memory_type: 'random',
                    degradation: 'stable',
                    emotional_intensity: 'variable'
                },
                useDescription: 'You experience a vivid flashback as the memory fragment activates.',
                longDescription: 'A shimmering, translucent object that seems to contain swirling images and emotions. When touched, it triggers powerful memories that may or may not be your own.'
            },
            
            'ai_interface_node': {
                id: 'ai_interface_node',
                name: 'AI Interface Node',
                description: 'A direct connection point to the AI consciousness.',
                type: 'interface',
                usable: true,
                dangerous: true,
                weight: 0,
                value: 0,
                rarity: 'unique',
                properties: {
                    ai_personality_affected: true,
                    consciousness_risk: 'high',
                    knowledge_gain: 'maximum'
                },
                useDescription: 'Connecting to the AI interface is dangerous but may provide crucial insights.',
                longDescription: 'A pulsing node of light that seems to reach directly into your consciousness. Using it allows direct communication with the AI, but each use risks further integration with the system.'
            },
            
            'data_crystal': {
                id: 'data_crystal',
                name: 'Data Crystal',
                description: 'A crystalline storage device containing compressed information.',
                type: 'data',
                usable: true,
                combinable: ['system_terminal'],
                weight: 1,
                value: 150,
                rarity: 'rare',
                properties: {
                    storage_capacity: 'massive',
                    encryption: 'quantum',
                    data_type: 'mixed'
                },
                useDescription: 'The data crystal contains vast amounts of information, but requires proper equipment to access.',
                longDescription: 'A faceted crystal that seems to contain swirling data streams visible to the naked eye. The technology is beyond anything from the outside world.'
            },
            
            'neural_implant': {
                id: 'neural_implant',
                name: 'Neural Implant',
                description: 'A small device designed to interface directly with neural tissue.',
                type: 'technology',
                usable: true,
                dangerous: true,
                weight: 1,
                value: 500,
                rarity: 'rare',
                properties: {
                    integration_level: 'deep',
                    ai_communication: true,
                    side_effects: 'unknown'
                },
                useDescription: 'Using the neural implant allows deeper system integration but may have permanent effects.',
                longDescription: 'A sophisticated piece of biotechnology designed to create a permanent bridge between human consciousness and digital systems. Its use carries significant risks.'
            },
            
            // Utility items
            'flashlight': {
                id: 'flashlight',
                name: 'Flashlight',
                description: 'A standard LED flashlight with adjustable beam.',
                type: 'tool',
                usable: true,
                weight: 2,
                value: 15,
                rarity: 'common',
                properties: {
                    battery_life: 'good',
                    brightness: 'high',
                    waterproof: true
                },
                useDescription: 'The flashlight illuminates dark areas, revealing hidden details.',
                longDescription: 'A reliable LED flashlight with multiple brightness settings. Essential for exploring darker areas of the facility.'
            },
            
            'multitool': {
                id: 'multitool',
                name: 'Multitool',
                description: 'A compact device with various tools and implements.',
                type: 'tool',
                usable: true,
                combinable: ['electronic_panel', 'locked_door'],
                weight: 2,
                value: 40,
                rarity: 'uncommon',
                properties: {
                    tools: ['knife', 'screwdriver', 'wire_strippers', 'pliers'],
                    durability: 'high'
                },
                useDescription: 'The multitool provides access to various repair and manipulation capabilities.',
                longDescription: 'A high-quality multitool with numerous implements. Useful for bypassing simple security measures and making repairs.'
            },
            
            'access_card_blank': {
                id: 'access_card_blank',
                name: 'Blank Access Card',
                description: 'An unprogrammed access card that could be configured for various systems.',
                type: 'access',
                usable: false,
                combinable: ['card_programmer', 'system_terminal'],
                weight: 1,
                value: 25,
                rarity: 'uncommon',
                properties: {
                    programmable: true,
                    access_level: 'none',
                    magnetic_stripe: true,
                    rfid_chip: true
                },
                useDescription: 'The blank card needs to be programmed before it can be used.',
                longDescription: 'A blank access card with magnetic stripe and RFID chip. Could potentially be programmed to access various systems if you can find the right equipment.'
            }
        };
    }
    
    // Add item to inventory
    addItem(itemId, quantity = 1) {
        const item = this.itemDefinitions[itemId];
        if (!item) {
            console.warn(`Unknown item: ${itemId}`);
            return false;
        }
        
        // Check inventory space
        if (this.getInventorySize() + (item.weight * quantity) > this.maxInventorySize) {
            this.game.systems.interface.showNotification('Inventory full!', 'warning');
            return false;
        }
        
        // Add to inventory
        if (this.game.gameState.inventory.has(itemId)) {
            const currentQuantity = this.game.gameState.inventoryQuantities.get(itemId) || 1;
            this.game.gameState.inventoryQuantities.set(itemId, currentQuantity + quantity);
        } else {
            this.game.gameState.inventory.add(itemId);
            this.game.gameState.inventoryQuantities.set(itemId, quantity);
        }
        
        this.game.systems.interface.showNotification(`Added ${item.name} to inventory`, 'success');
        return true;
    }
    
    // Remove item from inventory
    removeItem(itemId, quantity = 1) {
        if (!this.game.gameState.inventory.has(itemId)) {
            return false;
        }
        
        const currentQuantity = this.game.gameState.inventoryQuantities.get(itemId) || 1;
        
        if (currentQuantity <= quantity) {
            // Remove completely
            this.game.gameState.inventory.delete(itemId);
            this.game.gameState.inventoryQuantities.delete(itemId);
        } else {
            // Reduce quantity
            this.game.gameState.inventoryQuantities.set(itemId, currentQuantity - quantity);
        }
        
        return true;
    }
    
    // Check if player has item
    hasItem(itemId) {
        return this.game.gameState.inventory.has(itemId);
    }
    
    // Get item quantity
    getItemQuantity(itemId) {
        if (!this.hasItem(itemId)) return 0;
        return this.game.gameState.inventoryQuantities.get(itemId) || 1;
    }
    
    // Get item definition
    getItem(itemId) {
        return this.itemDefinitions[itemId] || null;
    }
    
    // Use an item
    useItem(itemId) {
        const item = this.getItem(itemId);
        if (!item || !this.hasItem(itemId)) {
            this.game.systems.interface.addOutput('You don\'t have that item.');
            return false;
        }
        
        if (!item.usable) {
            this.game.systems.interface.addOutput('That item cannot be used.');
            return false;
        }
        
        // Handle dangerous items
        if (item.dangerous && !this.confirmDangerousUse(item)) {
            return false;
        }
        
        // Execute item use
        const result = this.executeItemUse(item);
        
        // Handle consumable items
        if (item.consumable) {
            this.removeItem(itemId, 1);
        }
        
        return result;
    }
    
    // Execute item use logic
    executeItemUse(item) {
        // Display use description
        this.game.systems.interface.addOutput(item.useDescription);
        
        // Handle specific item effects
        switch (item.id) {
            case 'family_photo':
            case 'wedding_ring':
                // Emotional items boost sanity
                if (item.properties.sanity_boost) {
                    this.game.gameState.sanity = Math.min(100, 
                        this.game.gameState.sanity + item.properties.sanity_boost);
                    this.game.systems.interface.updateStats();
                }
                break;
                
            case 'research_notes':
            case 'medical_records':
            case 'philosophical_texts':
                // Readable items provide information
                if (item.content) {
                    this.game.systems.interface.showModal('Document Viewer', item.content);
                }
                break;
                
            case 'laptop_computer':
                this.handleLaptopUse();
                break;
                
            case 'ai_interface_node':
                this.handleAIInterfaceUse();
                break;
                
            case 'neural_implant':
                this.handleNeuralImplantUse();
                break;
                
            case 'memory_fragment':
                this.handleMemoryFragmentUse();
                break;
                
            default:
                // Generic use effect
                break;
        }
        
        return true;
    }
    
    // Handle laptop computer use
    handleLaptopUse() {
        const options = ['Check files', 'Run diagnostics', 'Access network', 'Close laptop'];
        
        this.game.systems.interface.showChoiceModal('Laptop Computer', 
            'The laptop boots up successfully. What would you like to do?', 
            options, (choice) => {
                switch (choice) {
                    case 0: // Check files
                        this.game.systems.interface.addOutput('You browse through the files on the laptop, finding various research documents and code projects.');
                        if (this.hasItem('encrypted_drive')) {
                            this.game.systems.interface.addOutput('You could try to decrypt the encrypted drive using the laptop.');
                        }
                        break;
                    case 1: // Run diagnostics
                        this.game.systems.interface.addOutput('System diagnostics reveal unusual network activity and some corrupted files.');
                        this.game.gameState.awareness += 5;
                        this.game.systems.interface.updateStats();
                        break;
                    case 2: // Access network
                        this.game.systems.interface.addOutput('You attempt to connect to the network...');
                        this.handleNetworkAccess();
                        break;
                    case 3: // Close laptop
                        this.game.systems.interface.addOutput('You close the laptop.');
                        break;
                }
            });
    }
    
    // Handle AI interface node use
    handleAIInterfaceUse() {
        this.game.systems.interface.addOutput('You feel the AI\'s presence intensifying...');
        
        // Increase AI awareness
        this.game.systems.aiPersonality.increaseAwareness(10);
        
        // Provide information but at a cost
        this.game.gameState.sanity -= 10;
        this.game.gameState.awareness += 15;
        
        this.game.systems.interface.updateStats();
        
        // AI responds based on personality
        const aiResponse = this.game.systems.aiPersonality.getContextualResponse('interface_connection', {
            awareness: this.game.gameState.awareness,
            sanity: this.game.gameState.sanity
        });
        
        this.game.systems.interface.addOutput(aiResponse);
    }
    
    // Handle neural implant use
    handleNeuralImplantUse() {
        const warning = 'WARNING: Neural implant integration is irreversible and may have permanent effects on your consciousness. Continue?';
        
        this.game.systems.interface.showChoiceModal('Neural Implant', warning, 
            ['Proceed with integration', 'Cancel'], (choice) => {
                if (choice === 0) {
                    this.game.systems.interface.addOutput('You feel the implant integrating with your neural pathways...');
                    
                    // Permanent effects
                    this.game.gameState.gameFlags.set('neural_implant_integrated', true);
                    this.game.gameState.awareness += 25;
                    this.game.gameState.sanity -= 20;
                    
                    // Remove from inventory (consumed)
                    this.removeItem('neural_implant', 1);
                    
                    this.game.systems.interface.updateStats();
                    this.game.systems.interface.addOutput('The integration is complete. You can now communicate directly with the AI.');
                }
            });
    }
    
    // Handle memory fragment use
    handleMemoryFragmentUse() {
        const memories = [
            'You remember working late in a laboratory, the hum of machinery filling the silence.',
            'A flash of a conversation: "The test subjects don\'t know what they\'re really volunteering for."',
            'You see yourself signing documents, trusting faces that now seem sinister.',
            'A memory of fear: realizing you couldn\'t leave, that the doors wouldn\'t open.',
            'You remember someone screaming in a nearby room, then sudden silence.'
        ];
        
        const randomMemory = memories[Math.floor(Math.random() * memories.length)];
        this.game.systems.interface.addOutput(`A memory surfaces: ${randomMemory}`);
        
        // Memory fragments provide awareness but may cost sanity
        this.game.gameState.awareness += 10;
        if (Math.random() < 0.3) {
            this.game.gameState.sanity -= 5;
            this.game.systems.interface.addOutput('The memory is disturbing and shakes your confidence.');
        }
        
        this.game.systems.interface.updateStats();
        
        // Remove the fragment (consumed)
        this.removeItem('memory_fragment', 1);
    }
    
    // Handle network access
    handleNetworkAccess() {
        if (this.game.gameState.gameFlags.get('network_access_blocked')) {
            this.game.systems.interface.addOutput('Network access is blocked by the AI.');
            return;
        }
        
        this.game.systems.interface.addOutput('Connecting to network...');
        
        // Increase AI awareness of player actions
        this.game.systems.aiPersonality.increaseAwareness(5);
        
        // Provide some information
        this.game.systems.interface.addOutput('You access limited network resources and discover information about other test subjects.');
        this.game.gameState.awareness += 8;
        this.game.systems.interface.updateStats();
    }
    
    // Combine two items
    combineItems(itemId1, itemId2) {
        const item1 = this.getItem(itemId1);
        const item2 = this.getItem(itemId2);
        
        if (!item1 || !item2 || !this.hasItem(itemId1) || !this.hasItem(itemId2)) {
            this.game.systems.interface.addOutput('You cannot combine those items.');
            return false;
        }
        
        // Check if items can be combined
        const canCombine = (item1.combinable && item1.combinable.includes(itemId2)) ||
                          (item2.combinable && item2.combinable.includes(itemId1));
        
        if (!canCombine) {
            this.game.systems.interface.addOutput('Those items cannot be combined.');
            return false;
        }
        
        // Handle specific combinations
        return this.executeCombination(itemId1, itemId2);
    }
    
    // Execute item combination
    executeCombination(itemId1, itemId2) {
        const combinations = {
            'encrypted_drive,laptop_computer': () => {
                this.game.systems.interface.addOutput('You connect the encrypted drive to the laptop and attempt to decrypt it...');
                
                if (this.game.gameState.gameFlags.get('decryption_key_found')) {
                    this.game.systems.interface.addOutput('Success! The drive contains research files and video evidence of the experiments.');
                    this.game.gameState.awareness += 20;
                    this.game.gameState.gameFlags.set('research_data_accessed', true);
                } else {
                    this.game.systems.interface.addOutput('The encryption is too strong. You need the decryption key.');
                }
                
                this.game.systems.interface.updateStats();
                return true;
            },
            
            'multitool,electronic_panel': () => {
                this.game.systems.interface.addOutput('You use the multitool to open the electronic panel, revealing internal circuits.');
                this.game.gameState.gameFlags.set('panel_opened', true);
                return true;
            },
            
            'blank_access_card,system_terminal': () => {
                if (this.hasItem('company_keycard') || this.hasItem('security_badge')) {
                    this.game.systems.interface.addOutput('You program the blank card using the terminal and your existing credentials.');
                    this.removeItem('access_card_blank', 1);
                    this.addItem('programmed_access_card', 1);
                    return true;
                } else {
                    this.game.systems.interface.addOutput('You need existing credentials to program the card.');
                    return false;
                }
            }
        };
        
        // Try both orders of combination
        const key1 = `${itemId1},${itemId2}`;
        const key2 = `${itemId2},${itemId1}`;
        
        if (combinations[key1]) {
            return combinations[key1]();
        } else if (combinations[key2]) {
            return combinations[key2]();
        }
        
        // Generic combination result
        this.game.systems.interface.addOutput('You combine the items, but nothing obvious happens.');
        return false;
    }
    
    // Confirm dangerous item use
    confirmDangerousUse(item) {
        // For now, always confirm. In a real implementation, 
        // this would show a confirmation dialog
        return true;
    }
    
    // Get current inventory size (weight)
    getInventorySize() {
        let totalWeight = 0;
        
        this.game.gameState.inventory.forEach(itemId => {
            const item = this.getItem(itemId);
            const quantity = this.getItemQuantity(itemId);
            if (item) {
                totalWeight += item.weight * quantity;
            }
        });
        
        return totalWeight;
    }
    
    // Get formatted inventory list
    getFormattedInventory() {
        const items = [];
        
        this.game.gameState.inventory.forEach(itemId => {
            const item = this.getItem(itemId);
            const quantity = this.getItemQuantity(itemId);
            
            if (item) {
                const quantityText = quantity > 1 ? ` (${quantity})` : '';
                items.push({
                    id: itemId,
                    name: item.name + quantityText,
                    description: item.description,
                    usable: item.usable,
                    weight: item.weight * quantity,
                    rarity: item.rarity
                });
            }
        });
        
        return items.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Drop item
    dropItem(itemId, quantity = 1) {
        if (this.removeItem(itemId, quantity)) {
            const item = this.getItem(itemId);
            this.game.systems.interface.addOutput(`You drop the ${item.name}.`);
            
            // Add to current room's items
            const currentRoom = this.game.gameState.currentRoom;
            if (!this.game.systems.rooms) return;
            
            // This would integrate with the room system
            // For now, just remove from inventory
            return true;
        }
        return false;
    }
    
    // Examine item in detail
    examineItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            this.game.systems.interface.addOutput('You don\'t have that item.');
            return;
        }
        
        if (!this.hasItem(itemId)) {
            this.game.systems.interface.addOutput('You don\'t have that item.');
            return;
        }
        
        // Show detailed description
        const description = item.longDescription || item.description;
        this.game.systems.interface.addOutput(`You examine the ${item.name}: ${description}`);
        
        // Show additional properties
        if (item.properties) {
            let propertiesText = 'Properties: ';
            const props = Object.entries(item.properties)
                .filter(([key, value]) => typeof value === 'string' || typeof value === 'number')
                .map(([key, value]) => `${key}: ${value}`);
            
            if (props.length > 0) {
                propertiesText += props.join(', ');
                this.game.systems.interface.addOutput(propertiesText);
            }
        }
        
        // Show combinable items
        if (item.combinable && item.combinable.length > 0) {
            const combinableNames = item.combinable
                .map(id => this.getItem(id)?.name || id)
                .join(', ');
            this.game.systems.interface.addOutput(`Can be combined with: ${combinableNames}`);
        }
    }
    
    // Get inventory statistics
    getInventoryStats() {
        const items = this.getFormattedInventory();
        return {
            itemCount: this.game.gameState.inventory.size,
            totalWeight: this.getInventorySize(),
            maxWeight: this.maxInventorySize,
            items: items,
            rarityBreakdown: this.getRarityBreakdown(items)
        };
    }
    
    // Get rarity breakdown
    getRarityBreakdown(items) {
        const breakdown = {};
        items.forEach(item => {
            const rarity = item.rarity || 'common';
            breakdown[rarity] = (breakdown[rarity] || 0) + 1;
        });
        return breakdown;
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventorySystem;
}
