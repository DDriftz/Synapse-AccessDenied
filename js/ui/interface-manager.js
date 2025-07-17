// SYNAPSE - Interface Manager
// Handles all UI interactions and screen management

class InterfaceManager {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentScreen = 'loading';
        this.activePanel = null;
        this.commandHistory = [];
        this.commandHistoryIndex = -1;
        this.maxCommandHistory = 50;
        
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            characterSelection: document.getElementById('character-selection'),
            gameInterface: document.getElementById('game-interface'),
            gameOutput: document.getElementById('game-output'),
            outputContent: document.getElementById('output-content'),
            commandInput: document.getElementById('command-input'),
            sendBtn: document.getElementById('send-btn'),
            commandSuggestions: document.getElementById('command-suggestions'),
            sidePanel: document.getElementById('side-panel'),
            mapPanel: document.getElementById('map-panel'),
            inventoryPanel: document.getElementById('inventory-panel'),
            achievementsPanel: document.getElementById('achievements-panel'),
            modalOverlay: document.getElementById('modal-overlay'),
            modalContent: document.getElementById('modal-content'),
            sanityBar: document.getElementById('sanity-bar'),
            awarenessBar: document.getElementById('awareness-bar'),
            sanityValue: document.getElementById('sanity-value'),
            awarenessValue: document.getElementById('awareness-value')
        };
        
        this.typewriterSettings = {
            speed: 50,
            enabled: true
        };
        
        this.commandSuggestions = [
            'look around', 'examine', 'take', 'use', 'go north', 'go south',
            'go east', 'go west', 'inventory', 'help', 'talk to synapse'
        ];
        
        this.visualEffects = {
            screenShake: false,
            scanlines: true,
            glitch: false,
            interference: false
        };
        
        this.initializeInterface();
    }
    
    initializeInterface() {
        this.setupEventListeners();
        this.updateCommandSuggestions();
        this.initializeAccessibility();
        
        // Initialize with loading screen
        this.showScreen('loading');
    }
    
    setupEventListeners() {
        // Main menu buttons
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleMenuClick(e));
        });
        
        // Character selection
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleCharacterSelection(e));
        });
        
        // Header buttons
        document.querySelectorAll('.header-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleHeaderClick(e));
        });
        
        // Command input
        if (this.elements.commandInput) {
            this.elements.commandInput.addEventListener('keydown', (e) => this.handleCommandKeydown(e));
            this.elements.commandInput.addEventListener('input', (e) => this.handleCommandInput(e));
        }
        
        // Send button
        if (this.elements.sendBtn) {
            this.elements.sendBtn.addEventListener('click', () => this.sendCommand());
        }
        
        // Command suggestions
        if (this.elements.commandSuggestions) {
            this.elements.commandSuggestions.addEventListener('click', (e) => {
                if (e.target.classList.contains('suggestion')) {
                    this.selectSuggestion(e.target.textContent);
                }
            });
        }
        
        // Modal overlay
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.modalOverlay) {
                    this.closeModal();
                }
            });
        }
        
        // Mobile side panel close
        document.addEventListener('click', (e) => {
            if (e.target.matches('.side-panel::before')) {
                this.closeSidePanel();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
    }
    
    initializeAccessibility() {
        // Screen reader support
        this.addAriaLabels();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // High contrast mode
        if (this.game.settings.accessibility.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // Reduced motion
        if (this.game.settings.accessibility.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    addAriaLabels() {
        // Add accessibility labels
        const elements = {
            'command-input': 'Enter game commands',
            'send-btn': 'Send command',
            'sanity-bar': 'Sanity level indicator',
            'awareness-bar': 'Awareness level indicator'
        };
        
        for (const [id, label] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('aria-label', label);
            }
        }
    }
    
    setupKeyboardNavigation() {
        // Make interactive elements focusable
        document.querySelectorAll('.menu-btn, .character-card, .header-btn').forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }
    
    // Screen Management
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.elements).forEach(element => {
            if (element && element.classList.contains('hidden')) {
                return; // Already hidden
            }
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        // Show target screen
        const screenMap = {
            'loading': this.elements.loadingScreen,
            'main-menu': this.elements.mainMenu,
            'character-selection': this.elements.characterSelection,
            'game': this.elements.gameInterface
        };
        
        const targetScreen = screenMap[screenName];
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.currentScreen = screenName;
            
            // Focus management
            this.manageFocus(screenName);
        }
    }
    
    manageFocus(screenName) {
        setTimeout(() => {
            switch (screenName) {
                case 'main-menu':
                    const firstMenuBtn = document.querySelector('.menu-btn');
                    if (firstMenuBtn) firstMenuBtn.focus();
                    break;
                case 'character-selection':
                    const firstCharCard = document.querySelector('.character-card');
                    if (firstCharCard) firstCharCard.focus();
                    break;
                case 'game':
                    if (this.elements.commandInput) {
                        this.elements.commandInput.focus();
                    }
                    break;
            }
        }, 100);
    }
    
    // Event Handlers
    handleMenuClick(event) {
        const action = event.currentTarget.dataset.action;
        
        switch (action) {
            case 'new-game':
                this.showScreen('character-selection');
                break;
            case 'load-game':
                this.showLoadGameDialog();
                break;
            case 'achievements':
                this.showAchievementsDialog();
                break;
            case 'settings':
                this.showSettingsDialog();
                break;
            case 'about':
                this.showAboutDialog();
                break;
        }
    }
    
    handleCharacterSelection(event) {
        const characterType = event.currentTarget.dataset.character;
        
        // Visual selection feedback
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        
        // Show difficulty selection or start game directly
        setTimeout(() => {
            this.showDifficultySelection(characterType);
        }, 500);
    }
    
    handleHeaderClick(event) {
        const action = event.currentTarget.dataset.action;
        
        switch (action) {
            case 'map':
                this.togglePanel('map');
                break;
            case 'inventory':
                this.togglePanel('inventory');
                break;
            case 'achievements':
                this.togglePanel('achievements');
                break;
            case 'save':
                this.quickSave();
                break;
            case 'settings':
                this.showSettingsDialog();
                break;
        }
    }
    
    handleCommandKeydown(event) {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                this.sendCommand();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.showPreviousCommand();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.showNextCommand();
                break;
            case 'Tab':
                event.preventDefault();
                this.autocompleteCommand();
                break;
            case 'Escape':
                this.clearCommand();
                break;
        }
    }
    
    handleCommandInput(event) {
        const input = event.target.value;
        this.updateCommandSuggestions(input);
    }
    
    handleGlobalKeydown(event) {
        // Handle global shortcuts that work across all screens
        if (event.ctrlKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    if (this.currentScreen === 'game') {
                        this.quickSave();
                    }
                    break;
                case 'l':
                    event.preventDefault();
                    if (this.currentScreen === 'game') {
                        this.showLoadGameDialog();
                    }
                    break;
            }
        }
    }
    
    // Command Processing
    sendCommand() {
        const input = this.elements.commandInput;
        if (!input) return;
        
        const command = input.value.trim();
        if (!command) return;
        
        // Add to history
        this.addToCommandHistory(command);
        
        // Clear input
        input.value = '';
        this.commandHistoryIndex = -1;
        
        // Add command to output
        this.addToOutput(`> ${command}`, 'command');
        
        // Process command through game engine
        const result = this.game.processCommand(command);
        
        // Update suggestions
        this.updateCommandSuggestions();
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Focus back on input
        input.focus();
    }
    
    addToCommandHistory(command) {
        // Avoid duplicates
        if (this.commandHistory[0] !== command) {
            this.commandHistory.unshift(command);
        }
        
        // Limit history size
        if (this.commandHistory.length > this.maxCommandHistory) {
            this.commandHistory.pop();
        }
    }
    
    showPreviousCommand() {
        if (this.commandHistory.length === 0) return;
        
        if (this.commandHistoryIndex < this.commandHistory.length - 1) {
            this.commandHistoryIndex++;
            this.elements.commandInput.value = this.commandHistory[this.commandHistoryIndex];
        }
    }
    
    showNextCommand() {
        if (this.commandHistoryIndex > 0) {
            this.commandHistoryIndex--;
            this.elements.commandInput.value = this.commandHistory[this.commandHistoryIndex];
        } else if (this.commandHistoryIndex === 0) {
            this.commandHistoryIndex = -1;
            this.elements.commandInput.value = '';
        }
    }
    
    autocompleteCommand() {
        const input = this.elements.commandInput.value.toLowerCase();
        if (!input) return;
        
        const matches = this.commandSuggestions.filter(cmd => 
            cmd.toLowerCase().startsWith(input)
        );
        
        if (matches.length > 0) {
            this.elements.commandInput.value = matches[0];
        }
    }
    
    clearCommand() {
        this.elements.commandInput.value = '';
        this.commandHistoryIndex = -1;
        this.updateCommandSuggestions();
    }
    
    selectSuggestion(suggestion) {
        this.elements.commandInput.value = suggestion;
        this.elements.commandInput.focus();
    }
    
    updateCommandSuggestions(input = '') {
        if (!this.elements.commandSuggestions) return;
        
        const suggestions = input ? 
            this.commandSuggestions.filter(cmd => 
                cmd.toLowerCase().includes(input.toLowerCase())
            ).slice(0, 6) :
            this.commandSuggestions.slice(0, 6);
        
        this.elements.commandSuggestions.innerHTML = suggestions
            .map(suggestion => `<span class="suggestion">${suggestion}</span>`)
            .join('');
    }
    
    // Output Management
    addToOutput(text, type = 'narrative') {
        const outputElement = this.createOutputElement(text, type);
        this.addElementToOutput(outputElement);
    }
    
    createOutputElement(text, type) {
        const element = document.createElement('div');
        element.className = `text-output text-${type}`;
        
        if (this.typewriterSettings.enabled && type === 'narrative') {
            this.addTypewriterEffect(element, text);
        } else {
            element.textContent = text;
        }
        
        return element;
    }
    
    addElementToOutput(element) {
        if (this.elements.outputContent) {
            this.elements.outputContent.appendChild(element);
            this.scrollToBottom();
            
            // Limit output length to prevent memory issues
            this.limitOutputLength();
        }
    }
    
    addTypewriterEffect(element, text) {
        element.classList.add('typewriter');
        element.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                element.classList.remove('typewriter');
            }
        }, this.typewriterSettings.speed);
    }
    
    limitOutputLength() {
        const outputs = this.elements.outputContent.children;
        const maxOutputs = 200;
        
        while (outputs.length > maxOutputs) {
            this.elements.outputContent.removeChild(outputs[0]);
        }
    }
    
    scrollToBottom() {
        if (this.elements.gameOutput) {
            this.elements.gameOutput.scrollTop = this.elements.gameOutput.scrollHeight;
        }
    }
    
    clearOutput() {
        if (this.elements.outputContent) {
            this.elements.outputContent.innerHTML = '';
        }
    }
    
    // Panel Management
    togglePanel(panelName) {
        if (this.activePanel === panelName) {
            this.closeSidePanel();
        } else {
            this.showPanel(panelName);
        }
    }
    
    showPanel(panelName) {
        // Hide all panels
        document.querySelectorAll('.panel-content').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show target panel
        const targetPanel = document.getElementById(`${panelName}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            this.activePanel = panelName;
            
            // Show side panel on mobile
            if (this.elements.sidePanel) {
                this.elements.sidePanel.classList.add('open');
            }
            
            // Update panel content
            this.updatePanelContent(panelName);
        }
    }
    
    closeSidePanel() {
        if (this.elements.sidePanel) {
            this.elements.sidePanel.classList.remove('open');
        }
        this.activePanel = null;
    }
    
    cyclePanel() {
        const panels = ['map', 'inventory', 'achievements'];
        const currentIndex = panels.indexOf(this.activePanel);
        const nextIndex = (currentIndex + 1) % panels.length;
        this.showPanel(panels[nextIndex]);
    }
    
    updatePanelContent(panelName) {
        switch (panelName) {
            case 'map':
                this.updateMap();
                break;
            case 'inventory':
                this.updateInventory();
                break;
            case 'achievements':
                this.updateAchievements();
                break;
        }
    }
    
    // Stats Update
    updateStats() {
        const sanity = this.game.gameState.sanity;
        const awareness = this.game.gameState.awareness;
        
        // Update bars
        if (this.elements.sanityBar) {
            this.elements.sanityBar.style.width = `${sanity}%`;
        }
        if (this.elements.awarenessBar) {
            this.elements.awarenessBar.style.width = `${awareness}%`;
        }
        
        // Update values
        if (this.elements.sanityValue) {
            this.elements.sanityValue.textContent = Math.round(sanity);
        }
        if (this.elements.awarenessValue) {
            this.elements.awarenessValue.textContent = Math.round(awareness);
        }
        
        // Update visual effects based on stats
        this.updateStatsEffects(sanity, awareness);
    }
    
    updateStatsEffects(sanity, awareness) {
        // Sanity effects
        const sanityBar = this.elements.sanityBar;
        if (sanityBar) {
            sanityBar.classList.remove('critical', 'low', 'medium', 'high');
            if (sanity < 25) {
                sanityBar.classList.add('critical');
            } else if (sanity < 50) {
                sanityBar.classList.add('low');
            } else if (sanity < 75) {
                sanityBar.classList.add('medium');
            } else {
                sanityBar.classList.add('high');
            }
        }
        
        // Awareness effects
        const awarenessBar = this.elements.awarenessBar;
        if (awarenessBar) {
            awarenessBar.classList.remove('low', 'medium', 'high', 'critical');
            if (awareness > 80) {
                awarenessBar.classList.add('critical');
            } else if (awareness > 60) {
                awarenessBar.classList.add('high');
            } else if (awareness > 30) {
                awarenessBar.classList.add('medium');
            } else {
                awarenessBar.classList.add('low');
            }
        }
    }
    
    // Map Update
    updateMap() {
        const mapGrid = document.getElementById('map-grid');
        if (!mapGrid) return;
        
        const rooms = window.gameData.rooms || {};
        const visitedRooms = this.game.gameState.visitedRooms;
        const currentRoom = this.game.gameState.currentRoom;
        
        // Clear existing map
        mapGrid.innerHTML = '';
        
        // Generate map grid (5x5 for demo)
        for (let i = 0; i < 25; i++) {
            const roomElement = document.createElement('div');
            roomElement.className = 'map-room';
            
            // Find room for this grid position
            const roomId = this.getRoomForGridPosition(i);
            if (roomId && rooms[roomId]) {
                const room = rooms[roomId];
                roomElement.textContent = room.mapSymbol || '?';
                roomElement.title = room.name;
                
                if (visitedRooms.has(roomId)) {
                    roomElement.classList.add('visited');
                }
                
                if (roomId === currentRoom) {
                    roomElement.classList.add('current');
                }
                
                roomElement.addEventListener('click', () => {
                    this.showRoomInfo(room);
                });
            }
            
            mapGrid.appendChild(roomElement);
        }
    }
    
    getRoomForGridPosition(position) {
        // Map grid positions to room IDs
        const roomMap = {
            12: 'entrance',      // Center
            7: 'hallway_north',  // North
            17: 'hallway_south', // South
            11: 'hallway_west',  // West
            13: 'hallway_east',  // East
            6: 'office',         // Northwest
            8: 'laboratory',     // Northeast
            16: 'storage',       // Southwest
            18: 'server_room'    // Southeast
        };
        
        return roomMap[position] || null;
    }
    
    // Inventory Update
    updateInventory() {
        const inventoryGrid = document.getElementById('inventory-grid');
        const weightIndicator = document.querySelector('.weight-indicator');
        
        if (!inventoryGrid) return;
        
        const inventory = this.game.gameState.inventory || [];
        const maxWeight = 5; // From game state
        const currentWeight = inventory.length; // Simplified weight calculation
        
        // Update weight indicator
        if (weightIndicator) {
            weightIndicator.textContent = `(${currentWeight}/${maxWeight})`;
        }
        
        // Clear existing inventory
        inventoryGrid.innerHTML = '';
        
        // Add inventory items
        inventory.forEach(item => {
            const itemElement = this.createInventoryItemElement(item);
            inventoryGrid.appendChild(itemElement);
        });
        
        // Add empty slots
        for (let i = inventory.length; i < maxWeight; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'inventory-item empty';
            emptySlot.innerHTML = '<div class="item-icon">➕</div>';
            inventoryGrid.appendChild(emptySlot);
        }
    }
    
    createInventoryItemElement(item) {
        const element = document.createElement('div');
        element.className = 'inventory-item';
        element.innerHTML = `
            <div class="item-icon">${item.icon || '📦'}</div>
            <div class="item-name">${item.name}</div>
        `;
        
        element.addEventListener('click', () => {
            this.showItemDetails(item);
        });
        
        return element;
    }
    
    // Achievements Update
    updateAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;
        
        const achievements = window.gameData.achievements || {};
        const unlockedAchievements = this.game.gameState.achievements;
        
        achievementsList.innerHTML = '';
        
        Object.entries(achievements).forEach(([id, achievement]) => {
            const achievementElement = this.createAchievementElement(id, achievement, unlockedAchievements.has(id));
            achievementsList.appendChild(achievementElement);
        });
    }
    
    createAchievementElement(id, achievement, unlocked) {
        const element = document.createElement('div');
        element.className = `achievement ${unlocked ? 'unlocked' : ''}`;
        
        const progress = this.game.systems.achievement.getProgress(id);
        const progressPercent = progress.max > 0 ? (progress.current / progress.max) * 100 : 0;
        
        element.innerHTML = `
            <div class="achievement-header">
                <span class="achievement-icon">${achievement.icon || '🏆'}</span>
                <span class="achievement-title">${achievement.name}</span>
            </div>
            <div class="achievement-description">${achievement.description}</div>
            ${progress.max > 0 ? `
                <div class="achievement-progress">
                    <div class="achievement-progress-bar" style="width: ${progressPercent}%"></div>
                </div>
            ` : ''}
        `;
        
        return element;
    }
    
    // Modal Dialogs
    showModal(content) {
        if (this.elements.modalContent) {
            this.elements.modalContent.innerHTML = content;
        }
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.classList.remove('hidden');
        }
        
        // Focus management
        const firstFocusable = this.elements.modalContent.querySelector('button, input, select, textarea');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
    
    closeModal() {
        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.classList.add('hidden');
        }
        
        // Return focus to command input if in game
        if (this.currentScreen === 'game' && this.elements.commandInput) {
            this.elements.commandInput.focus();
        }
    }
    
    showDifficultySelection(characterType) {
        const content = `
            <h2>Select Difficulty</h2>
            <div class="difficulty-options">
                <button class="btn difficulty-btn" data-difficulty="beginner">
                    <h3>Beginner</h3>
                    <p>Gentle introduction with helpful hints</p>
                </button>
                <button class="btn difficulty-btn" data-difficulty="easy">
                    <h3>Easy</h3>
                    <p>Some guidance and forgiving mechanics</p>
                </button>
                <button class="btn difficulty-btn" data-difficulty="normal">
                    <h3>Normal</h3>
                    <p>Balanced challenge for most players</p>
                </button>
                <button class="btn difficulty-btn" data-difficulty="hard">
                    <h3>Hard</h3>
                    <p>Challenging experience for veterans</p>
                </button>
                <button class="btn difficulty-btn" data-difficulty="nightmare">
                    <h3>Nightmare</h3>
                    <p>Brutal difficulty for true masochists</p>
                </button>
            </div>
        `;
        
        this.showModal(content);
        
        // Add event listeners to difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const difficulty = e.currentTarget.dataset.difficulty;
                this.closeModal();
                this.game.startNewGame(characterType, difficulty);
            });
        });
    }
    
    showSettingsDialog() {
        const settings = this.game.settings;
        const content = `
            <h2>Settings</h2>
            <div class="settings-form">
                <div class="setting-group">
                    <h3>Audio</h3>
                    <label>
                        <input type="checkbox" ${settings.soundEnabled ? 'checked' : ''} data-setting="soundEnabled">
                        Sound Effects
                    </label>
                    <label>
                        <input type="checkbox" ${settings.musicEnabled ? 'checked' : ''} data-setting="musicEnabled">
                        Background Music
                    </label>
                </div>
                <div class="setting-group">
                    <h3>Visual</h3>
                    <label>
                        <input type="checkbox" ${settings.visualEffects ? 'checked' : ''} data-setting="visualEffects">
                        Visual Effects
                    </label>
                    <label>
                        Text Speed: 
                        <input type="range" min="10" max="200" value="${settings.textSpeed}" data-setting="textSpeed">
                    </label>
                    <label>
                        Horror Intensity: 
                        <input type="range" min="0" max="2" step="0.1" value="${settings.horrorIntensity}" data-setting="horrorIntensity">
                    </label>
                </div>
                <div class="setting-group">
                    <h3>Accessibility</h3>
                    <label>
                        <input type="checkbox" ${settings.accessibility.highContrast ? 'checked' : ''} data-setting="accessibility.highContrast">
                        High Contrast Mode
                    </label>
                    <label>
                        <input type="checkbox" ${settings.accessibility.reducedMotion ? 'checked' : ''} data-setting="accessibility.reducedMotion">
                        Reduced Motion
                    </label>
                    <label>
                        <input type="checkbox" ${settings.accessibility.screenReader ? 'checked' : ''} data-setting="accessibility.screenReader">
                        Screen Reader Support
                    </label>
                </div>
                <div class="setting-actions">
                    <button class="btn" onclick="window.game.systems.interface.applySettings()">Apply</button>
                    <button class="btn" onclick="window.game.systems.interface.closeModal()">Close</button>
                </div>
            </div>
        `;
        
        this.showModal(content);
    }
    
    applySettings() {
        // Collect settings from form
        const inputs = document.querySelectorAll('[data-setting]');
        inputs.forEach(input => {
            const settingPath = input.dataset.setting;
            const value = input.type === 'checkbox' ? input.checked : 
                         input.type === 'range' ? parseFloat(input.value) : input.value;
            
            // Update setting (handle nested paths)
            if (settingPath.includes('.')) {
                const [parent, child] = settingPath.split('.');
                this.game.settings[parent][child] = value;
            } else {
                this.game.settings[settingPath] = value;
            }
        });
        
        // Apply settings
        this.game.applySettings();
        
        // Close modal
        this.closeModal();
    }
    
    // Utility Methods
    focusCommandInput() {
        if (this.elements.commandInput) {
            this.elements.commandInput.focus();
        }
    }
    
    quickSave() {
        if (this.game.systems.save) {
            this.game.systems.save.quickSave();
            this.showNotification('Game saved!');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Command parsing (basic implementation)
    parseCommand(command) {
        // This is a simplified parser - a real implementation would be much more sophisticated
        const cmd = command.toLowerCase().trim();
        const words = cmd.split(' ');
        const verb = words[0];
        const object = words.slice(1).join(' ');
        
        // Basic command processing
        switch (verb) {
            case 'look':
                return this.handleLookCommand(object);
            case 'go':
                return this.handleGoCommand(object);
            case 'take':
                return this.handleTakeCommand(object);
            case 'use':
                return this.handleUseCommand(object);
            case 'examine':
                return this.handleExamineCommand(object);
            case 'help':
                return this.handleHelpCommand();
            case 'inventory':
            case 'inv':
                return this.handleInventoryCommand();
            default:
                return {
                    text: "I don't understand that command. Type 'help' for assistance.",
                    type: 'error'
                };
        }
    }
    
    handleLookCommand(object) {
        const room = this.game.getCurrentRoom();
        if (!room) {
            return { text: "You can't see anything here.", type: 'error' };
        }
        
        if (!object || object === 'around') {
            return { text: room.description, type: 'narrative' };
        } else {
            // Look at specific object
            const item = room.items && room.items.find(item => 
                item.name.toLowerCase().includes(object)
            );
            if (item) {
                return { text: item.description, type: 'narrative' };
            } else {
                return { text: `You don't see any ${object} here.`, type: 'error' };
            }
        }
    }
    
    handleGoCommand(direction) {
        const room = this.game.getCurrentRoom();
        if (!room || !room.exits) {
            return { text: "You can't go anywhere from here.", type: 'error' };
        }
        
        const exit = room.exits[direction];
        if (exit) {
            const success = this.game.moveToRoom(exit.to);
            if (success) {
                const newRoom = this.game.getCurrentRoom();
                return { 
                    text: `You go ${direction}.\n\n${newRoom.description}`, 
                    type: 'narrative',
                    awarenessChange: 1 
                };
            } else {
                return { text: exit.blockedMessage || "You can't go that way.", type: 'error' };
            }
        } else {
            return { text: `You can't go ${direction}.`, type: 'error' };
        }
    }
    
    handleTakeCommand(object) {
        const room = this.game.getCurrentRoom();
        if (!room || !room.items) {
            return { text: `There's no ${object} here to take.`, type: 'error' };
        }
        
        const item = room.items.find(item => 
            item.name.toLowerCase().includes(object.toLowerCase())
        );
        
        if (item && item.canTake) {
            // Add to inventory
            this.game.gameState.inventory.push(item);
            
            // Remove from room
            room.items = room.items.filter(i => i !== item);
            
            // Update inventory display
            this.updateInventory();
            
            return { 
                text: `You take the ${item.name}.`, 
                type: 'narrative',
                awarenessChange: 1 
            };
        } else if (item) {
            return { text: item.cantTakeMessage || "You can't take that.", type: 'error' };
        } else {
            return { text: `There's no ${object} here.`, type: 'error' };
        }
    }
    
    handleUseCommand(object) {
        // Check inventory first
        const inventoryItem = this.game.gameState.inventory.find(item =>
            item.name.toLowerCase().includes(object.toLowerCase())
        );
        
        if (inventoryItem && inventoryItem.onUse) {
            return inventoryItem.onUse(this.game);
        }
        
        // Check room items
        const room = this.game.getCurrentRoom();
        if (room && room.items) {
            const roomItem = room.items.find(item =>
                item.name.toLowerCase().includes(object.toLowerCase())
            );
            
            if (roomItem && roomItem.onUse) {
                return roomItem.onUse(this.game);
            }
        }
        
        return { text: `You can't use the ${object}.`, type: 'error' };
    }
    
    handleExamineCommand(object) {
        // Similar to look but more detailed
        return this.handleLookCommand(object);
    }
    
    handleHelpCommand() {
        return {
            text: `Available commands:
            
Movement: go [north/south/east/west/up/down]
Interaction: look [at object], examine [object], take [object], use [object]
Inventory: inventory (or inv)
System: help, save, load

You can also talk to SYNAPSE by typing questions or statements.
            
Type commands in natural language - the system will try to understand what you mean.`,
            type: 'system'
        };
    }
    
    handleInventoryCommand() {
        const inventory = this.game.gameState.inventory;
        if (inventory.length === 0) {
            return { text: "Your inventory is empty.", type: 'system' };
        } else {
            const itemList = inventory.map(item => `- ${item.name}`).join('\n');
            return { text: `You are carrying:\n${itemList}`, type: 'system' };
        }
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InterfaceManager;
}
