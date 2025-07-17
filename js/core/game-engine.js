// SYNAPSE - Game Engine Core
// Main game loop and state management

class GameEngine {
    constructor() {
        this.gameState = {
            isInitialized: false,
            currentScreen: 'loading',
            player: null,
            currentRoom: 'entrance',
            turnCounter: 0,
            sanity: 100,
            awareness: 0,
            inventory: [],
            visitedRooms: new Set(),
            gameFlags: new Map(),
            difficultyLevel: 'normal',
            achievements: new Set(),
            playTime: 0,
            lastSaveTime: null
        };
        
        this.systems = {
            narrative: null,
            ai: null,
            character: null,
            inventory: null,
            achievement: null,
            audio: null,
            save: null,
            interface: null
        };
        
        this.settings = {
            language: 'en',
            textSpeed: 50,
            autoSave: true,
            autoSaveInterval: 30000,
            soundEnabled: true,
            musicEnabled: true,
            visualEffects: true,
            horrorIntensity: 1.0,
            accessibility: {
                screenReader: false,
                highContrast: false,
                reducedMotion: false,
                textToSpeech: false
            }
        };
        
        this.eventHandlers = new Map();
        this.gameLoop = null;
        this.autoSaveTimer = null;
        
        this.initializeEngine();
    }
    
    async initializeEngine() {
        try {
            // Load settings from localStorage
            this.loadSettings();
            
            // Initialize systems
            await this.initializeSystems();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start game loop
            this.startGameLoop();
            
            // Mark as initialized
            this.gameState.isInitialized = true;
            
            // Simulate loading time
            setTimeout(() => this.showMainMenu(), 3000);
            
            console.log('SYNAPSE Game Engine initialized successfully');
        } catch (error) {
            console.error('Failed to initialize game engine:', error);
            this.handleCriticalError(error);
        }
    }
    
    async initializeSystems() {
        // Initialize core systems
        this.systems.save = new SaveSystem(this);
        this.systems.audio = new AudioManager(this);
        this.systems.interface = new InterfaceManager(this);
        this.systems.ai = new AIPersonalitySystem(this);
        this.systems.narrative = new NarrativeEngine(this);
        this.systems.character = new CharacterSystem(this);
        this.systems.inventory = new InventorySystem(this);
        this.systems.achievement = new AchievementSystem(this);
        
        // Initialize data
        await this.loadGameData();
    }
    
    async loadGameData() {
        // Load static game data
        window.gameData = {
            rooms: await this.loadData('rooms'),
            items: await this.loadData('items'),
            dialogue: await this.loadData('dialogue'),
            achievements: await this.loadData('achievements'),
            localization: await this.loadData('localization')
        };
    }
    
    async loadData(type) {
        try {
            // In a real implementation, this would load from external files
            // For now, we'll use the data defined in separate JS files
            return window[`${type}Data`] || {};
        } catch (error) {
            console.warn(`Failed to load ${type} data:`, error);
            return {};
        }
    }
    
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Window events
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
        window.addEventListener('focus', () => this.handleWindowFocus());
        window.addEventListener('blur', () => this.handleWindowBlur());
        
        // Visibility change (for pausing)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Mouse movement for atmospheric effects
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch events for mobile
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    }
    
    startGameLoop() {
        this.gameLoop = setInterval(() => {
            this.updateGameState();
            this.updateVisualEffects();
            this.checkConditions();
        }, 100); // 10 FPS for background processes
        
        // Start auto-save timer if enabled
        if (this.settings.autoSave) {
            this.autoSaveTimer = setInterval(() => {
                if (this.gameState.currentScreen === 'game') {
                    this.systems.save.autoSave();
                }
            }, this.settings.autoSaveInterval);
        }
    }
    
    updateGameState() {
        // Update play time
        if (this.gameState.currentScreen === 'game') {
            this.gameState.playTime += 0.1;
        }
        
        // Update AI personality based on awareness
        if (this.systems.ai) {
            this.systems.ai.updatePersonality();
        }
        
        // Check for ambient events
        this.checkAmbientEvents();
    }
    
    updateVisualEffects() {
        if (!this.settings.visualEffects) return;
        
        // Update sanity-based effects
        this.updateSanityEffects();
        
        // Update awareness-based effects
        this.updateAwarenessEffects();
        
        // Update atmospheric effects
        this.updateAtmosphericEffects();
    }
    
    updateSanityEffects() {
        const body = document.body;
        const sanity = this.gameState.sanity;
        
        // Remove existing sanity classes
        body.classList.remove('sanity-low', 'sanity-critical');
        
        if (sanity < 30) {
            body.classList.add('sanity-critical');
            if (Math.random() < 0.05) {
                this.triggerGlitchEffect();
            }
        } else if (sanity < 60) {
            body.classList.add('sanity-low');
            if (Math.random() < 0.02) {
                this.triggerFlickerEffect();
            }
        }
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--sanity-level', sanity / 100);
    }
    
    updateAwarenessEffects() {
        const awareness = this.gameState.awareness;
        
        if (awareness > 70) {
            document.body.classList.add('awareness-high');
            if (Math.random() < 0.03) {
                this.triggerSurveillanceEffect();
            }
        } else {
            document.body.classList.remove('awareness-high');
        }
        
        document.documentElement.style.setProperty('--awareness-level', awareness / 100);
    }
    
    updateAtmosphericEffects() {
        // Time-based effects
        const time = Date.now();
        const hour = new Date().getHours();
        
        // Night effects (10 PM - 6 AM)
        if (hour >= 22 || hour <= 6) {
            document.body.classList.add('night-mode');
        } else {
            document.body.classList.remove('night-mode');
        }
        
        // Seasonal effects
        this.updateSeasonalEffects();
    }
    
    updateSeasonalEffects() {
        const month = new Date().getMonth();
        const day = new Date().getDate();
        
        // Halloween effects (October)
        if (month === 9) {
            document.body.classList.add('halloween-mode');
        } else {
            document.body.classList.remove('halloween-mode');
        }
        
        // Friday the 13th effects
        if (day === 13 && new Date().getDay() === 5) {
            document.body.classList.add('friday-13th');
        }
    }
    
    checkAmbientEvents() {
        if (this.gameState.currentScreen !== 'game') return;
        
        const room = this.getCurrentRoom();
        if (!room) return;
        
        // Random ambient events
        if (Math.random() < 0.001) { // 0.1% chance per frame
            this.triggerAmbientEvent();
        }
        
        // Room-specific events
        if (room.ambientEvents && Math.random() < 0.0005) {
            this.triggerRoomAmbientEvent(room);
        }
    }
    
    checkConditions() {
        // Check for game over conditions
        if (this.gameState.sanity <= 0) {
            this.triggerGameOver('sanity_loss');
        }
        
        // Check for achievement conditions
        if (this.systems.achievement) {
            this.systems.achievement.checkAchievements();
        }
        
        // Check for ending conditions
        this.checkEndingConditions();
    }
    
    checkEndingConditions() {
        const flags = this.gameState.gameFlags;
        const endings = this.getAvailableEndings();
        
        for (const ending of endings) {
            if (this.meetsEndingConditions(ending)) {
                this.triggerEnding(ending);
                break;
            }
        }
    }
    
    // Event Handlers
    handleGlobalKeydown(event) {
        const key = event.key.toLowerCase();
        
        // Global shortcuts
        switch (key) {
            case 'escape':
                this.handleEscapeKey();
                break;
            case 'f1':
                event.preventDefault();
                this.showHelp();
                break;
            case 'f5':
                event.preventDefault();
                this.quickSave();
                break;
            case 'f9':
                event.preventDefault();
                this.quickLoad();
                break;
            case 'm':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.toggleMute();
                }
                break;
        }
        
        // Screen-specific shortcuts
        if (this.gameState.currentScreen === 'game') {
            this.handleGameKeydown(event);
        }
    }
    
    handleGameKeydown(event) {
        const key = event.key.toLowerCase();
        
        switch (key) {
            case 'tab':
                event.preventDefault();
                this.systems.interface.cyclePanel();
                break;
            case 'enter':
                if (event.target.id !== 'command-input') {
                    this.systems.interface.focusCommandInput();
                }
                break;
            case 'arrowup':
                if (event.target.id === 'command-input') {
                    this.systems.interface.showPreviousCommand();
                }
                break;
            case 'arrowdown':
                if (event.target.id === 'command-input') {
                    this.systems.interface.showNextCommand();
                }
                break;
        }
    }
    
    handleEscapeKey() {
        switch (this.gameState.currentScreen) {
            case 'game':
                this.showPauseMenu();
                break;
            case 'character-selection':
                this.showMainMenu();
                break;
            default:
                // Close any open modals
                this.systems.interface.closeModal();
                break;
        }
    }
    
    handleMouseMove(event) {
        // Update atmospheric effects based on mouse position
        const x = event.clientX / window.innerWidth * 100;
        const y = event.clientY / window.innerHeight * 100;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        
        // Horror atmosphere effects
        if (this.gameState.currentScreen === 'game' && this.gameState.sanity < 50) {
            document.documentElement.style.setProperty('--eye-x', `${Math.random() * 100}px`);
            document.documentElement.style.setProperty('--eye-y', `${Math.random() * 100}px`);
        }
    }
    
    handleTouchStart(event) {
        // Mobile-specific touch handling
        if (event.touches.length === 2) {
            // Two-finger touch - show context menu
            this.showMobileContextMenu(event);
        }
    }
    
    handleTouchMove(event) {
        // Handle swipe gestures
        if (event.touches.length === 1) {
            this.handleSwipeGesture(event);
        }
    }
    
    handleBeforeUnload() {
        // Quick save before closing
        if (this.gameState.currentScreen === 'game') {
            this.systems.save.quickSave();
        }
        
        // Save settings
        this.saveSettings();
    }
    
    handleWindowFocus() {
        // Resume game loop if paused
        if (!this.gameLoop) {
            this.startGameLoop();
        }
        
        // Resume audio
        if (this.systems.audio) {
            this.systems.audio.resume();
        }
    }
    
    handleWindowBlur() {
        // Pause intensive effects when window loses focus
        // Game loop continues but at reduced frequency
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause audio and effects
            if (this.systems.audio) {
                this.systems.audio.pause();
            }
        } else {
            // Page is visible - resume audio
            if (this.systems.audio) {
                this.systems.audio.resume();
            }
        }
    }
    
    // Screen Management
    showMainMenu() {
        this.gameState.currentScreen = 'main-menu';
        this.systems.interface.showScreen('main-menu');
        this.systems.audio.playMusic('menu');
    }
    
    showCharacterSelection() {
        this.gameState.currentScreen = 'character-selection';
        this.systems.interface.showScreen('character-selection');
    }
    
    startNewGame(characterType, difficulty = 'normal') {
        this.gameState.currentScreen = 'game';
        this.gameState.difficultyLevel = difficulty;
        
        // Initialize player
        this.systems.character.createCharacter(characterType);
        
        // Reset game state
        this.resetGameState();
        
        // Show game interface
        this.systems.interface.showScreen('game');
        
        // Start narrative
        this.systems.narrative.startGame();
        
        // Play ambient audio
        this.systems.audio.playAmbient('facility');
        
        // Unlock first achievement
        this.systems.achievement.unlock('first_steps');
    }
    
    resetGameState() {
        this.gameState.turnCounter = 0;
        this.gameState.sanity = this.systems.character.getBaseSanity();
        this.gameState.awareness = 0;
        this.gameState.inventory = [];
        this.gameState.visitedRooms.clear();
        this.gameState.gameFlags.clear();
        this.gameState.playTime = 0;
        this.gameState.currentRoom = 'entrance';
        
        // Visit starting room
        this.gameState.visitedRooms.add('entrance');
    }
    
    // Game Actions
    processCommand(command) {
        if (!command || this.gameState.currentScreen !== 'game') return;
        
        // Increment turn counter
        this.gameState.turnCounter++;
        
        // Process through command parser
        const result = this.systems.interface.parseCommand(command);
        
        // Update AI personality based on command
        this.systems.ai.processPlayerAction(command, result);
        
        // Check for special AI responses
        if (Math.random() < this.getAIResponseChance()) {
            this.systems.ai.generateResponse(command);
        }
        
        // Update interface
        this.systems.interface.addToOutput(result.text, result.type);
        
        // Process any side effects
        this.processCommandEffects(result);
        
        return result;
    }
    
    processCommandEffects(result) {
        // Sanity effects
        if (result.sanityChange) {
            this.modifySanity(result.sanityChange);
        }
        
        // Awareness effects
        if (result.awarenessChange) {
            this.modifyAwareness(result.awarenessChange);
        }
        
        // Flag changes
        if (result.flags) {
            for (const [flag, value] of Object.entries(result.flags)) {
                this.gameState.gameFlags.set(flag, value);
            }
        }
        
        // Achievements
        if (result.achievements) {
            for (const achievement of result.achievements) {
                this.systems.achievement.unlock(achievement);
            }
        }
    }
    
    modifySanity(amount) {
        const oldSanity = this.gameState.sanity;
        this.gameState.sanity = Math.max(0, Math.min(100, this.gameState.sanity + amount));
        
        // Trigger sanity-based events
        if (this.gameState.sanity < 25 && oldSanity >= 25) {
            this.triggerSanityBreakdown();
        } else if (this.gameState.sanity > 75 && oldSanity <= 75) {
            this.triggerSanityRecovery();
        }
        
        // Update UI
        this.systems.interface.updateStats();
    }
    
    modifyAwareness(amount) {
        const oldAwareness = this.gameState.awareness;
        this.gameState.awareness = Math.max(0, Math.min(100, this.gameState.awareness + amount));
        
        // Trigger awareness-based events
        if (this.gameState.awareness > 80 && oldAwareness <= 80) {
            this.triggerHighAwareness();
        }
        
        // Update AI behavior
        this.systems.ai.updateAwarenessBehavior(this.gameState.awareness);
        
        // Update UI
        this.systems.interface.updateStats();
    }
    
    moveToRoom(roomId) {
        const room = this.getRoom(roomId);
        if (!room) return false;
        
        this.gameState.currentRoom = roomId;
        this.gameState.visitedRooms.add(roomId);
        
        // Trigger room events
        this.systems.narrative.enterRoom(room);
        
        // Update map
        this.systems.interface.updateMap();
        
        // Check for room-specific achievements
        this.systems.achievement.checkRoomAchievements(roomId);
        
        return true;
    }
    
    // Utility Methods
    getCurrentRoom() {
        return this.getRoom(this.gameState.currentRoom);
    }
    
    getRoom(roomId) {
        return window.gameData.rooms[roomId];
    }
    
    getAIResponseChance() {
        // Chance increases with awareness
        return Math.min(0.3, this.gameState.awareness / 100 * 0.5);
    }
    
    getAvailableEndings() {
        // Return array of possible endings based on current state
        return this.systems.narrative.getAvailableEndings(this.gameState);
    }
    
    meetsEndingConditions(ending) {
        return this.systems.narrative.checkEndingConditions(ending, this.gameState);
    }
    
    // Effect Triggers
    triggerGlitchEffect() {
        document.body.classList.add('glitch');
        setTimeout(() => document.body.classList.remove('glitch'), 300);
    }
    
    triggerFlickerEffect() {
        document.body.classList.add('flicker');
        setTimeout(() => document.body.classList.remove('flicker'), 150);
    }
    
    triggerSurveillanceEffect() {
        document.body.classList.add('being-watched');
        setTimeout(() => document.body.classList.remove('being-watched'), 2000);
    }
    
    triggerAmbientEvent() {
        const events = [
            'distant_footsteps',
            'electrical_hum',
            'door_slam',
            'whispers',
            'static_burst'
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.systems.audio.playSound(event);
        
        if (Math.random() < 0.3) {
            this.systems.interface.addToOutput(
                this.getRandomAmbientText(event),
                'atmospheric'
            );
        }
    }
    
    triggerRoomAmbientEvent(room) {
        if (!room.ambientEvents) return;
        
        const event = room.ambientEvents[Math.floor(Math.random() * room.ambientEvents.length)];
        this.systems.interface.addToOutput(event.text, 'atmospheric');
        
        if (event.sound) {
            this.systems.audio.playSound(event.sound);
        }
        
        if (event.sanityChange) {
            this.modifySanity(event.sanityChange);
        }
    }
    
    triggerSanityBreakdown() {
        this.systems.interface.addToOutput(
            "Your mind feels like it's fracturing. Reality seems to shift and blur at the edges.",
            'system'
        );
        this.systems.audio.playSound('sanity_break');
        this.triggerGlitchEffect();
    }
    
    triggerSanityRecovery() {
        this.systems.interface.addToOutput(
            "You feel a moment of clarity. Your thoughts begin to stabilize.",
            'system'
        );
        this.systems.audio.playSound('sanity_recover');
    }
    
    triggerHighAwareness() {
        this.systems.interface.addToOutput(
            "You sense that something is watching you. Every shadow seems to hide a presence.",
            'system'
        );
        this.systems.audio.playSound('awareness_spike');
    }
    
    triggerGameOver(reason) {
        this.gameState.currentScreen = 'game-over';
        this.systems.narrative.triggerGameOver(reason);
        this.systems.achievement.unlock(`game_over_${reason}`);
    }
    
    triggerEnding(ending) {
        this.gameState.currentScreen = 'ending';
        this.systems.narrative.triggerEnding(ending);
        this.systems.achievement.unlock(`ending_${ending.id}`);
    }
    
    // Settings Management
    loadSettings() {
        try {
            const saved = localStorage.getItem('synapse_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                Object.assign(this.settings, settings);
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('synapse_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }
    
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        this.applySettings();
    }
    
    applySettings() {
        // Apply visual effects setting
        if (!this.settings.visualEffects) {
            document.body.classList.add('reduced-effects');
        } else {
            document.body.classList.remove('reduced-effects');
        }
        
        // Apply accessibility settings
        if (this.settings.accessibility.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        if (this.settings.accessibility.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        // Apply audio settings
        if (this.systems.audio) {
            this.systems.audio.setMasterVolume(this.settings.soundEnabled ? 1 : 0);
            this.systems.audio.setMusicVolume(this.settings.musicEnabled ? 1 : 0);
        }
    }
    
    // Utility Methods
    getRandomAmbientText(event) {
        const texts = {
            distant_footsteps: [
                "You hear distant footsteps echoing through the corridors.",
                "The sound of someone walking can be heard from somewhere far away.",
                "Footsteps... but you're supposed to be alone here."
            ],
            electrical_hum: [
                "The electrical systems hum with an unsettling frequency.",
                "A low electrical buzz fills the air.",
                "The lights flicker as the electrical system strains."
            ],
            door_slam: [
                "A door slams shut somewhere in the distance.",
                "The sound of a heavy door closing echoes through the facility.",
                "Something just sealed itself away from you."
            ],
            whispers: [
                "You hear faint whispers, too quiet to understand.",
                "Voices seem to drift from the walls themselves.",
                "Someone is speaking, but the words are lost in static."
            ],
            static_burst: [
                "A burst of static fills your ears.",
                "The facility's communication system crackles with interference.",
                "Electronic noise pierces the silence."
            ]
        };
        
        const eventTexts = texts[event] || ["Something strange happens."];
        return eventTexts[Math.floor(Math.random() * eventTexts.length)];
    }
    
    handleCriticalError(error) {
        console.error('Critical game error:', error);
        
        // Show error screen
        document.body.innerHTML = `
            <div class="error-screen">
                <h1>SYSTEM ERROR</h1>
                <p>A critical error has occurred in the SYNAPSE system.</p>
                <p>Error: ${error.message}</p>
                <button onclick="location.reload()">Restart System</button>
            </div>
        `;
    }
    
    // Debug Methods
    debug() {
        return {
            gameState: this.gameState,
            settings: this.settings,
            systems: Object.keys(this.systems)
        };
    }
    
    debugCommand(command) {
        // Allow debug commands in development
        if (command.startsWith('debug.')) {
            const action = command.substring(6);
            return this.executeDebugAction(action);
        }
        return false;
    }
    
    executeDebugAction(action) {
        const [cmd, ...args] = action.split(' ');
        
        switch (cmd) {
            case 'sanity':
                this.gameState.sanity = parseInt(args[0]) || 50;
                this.systems.interface.updateStats();
                return { text: `Sanity set to ${this.gameState.sanity}`, type: 'debug' };
                
            case 'awareness':
                this.gameState.awareness = parseInt(args[0]) || 50;
                this.systems.interface.updateStats();
                return { text: `Awareness set to ${this.gameState.awareness}`, type: 'debug' };
                
            case 'room':
                if (args[0] && this.getRoom(args[0])) {
                    this.moveToRoom(args[0]);
                    return { text: `Moved to room: ${args[0]}`, type: 'debug' };
                }
                return { text: `Invalid room: ${args[0]}`, type: 'error' };
                
            case 'flag':
                if (args[0] && args[1]) {
                    this.gameState.gameFlags.set(args[0], args[1]);
                    return { text: `Flag ${args[0]} set to ${args[1]}`, type: 'debug' };
                }
                return { text: 'Usage: debug.flag <name> <value>', type: 'error' };
                
            default:
                return { text: `Unknown debug command: ${cmd}`, type: 'error' };
        }
    }
}

// Global game instance
window.game = null;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
});

// Expose game to global scope for debugging
if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
}
