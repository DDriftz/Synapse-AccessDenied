// SYNAPSE - Save System
// Handles game state persistence and loading

class SaveSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.autoSaveEnabled = true;
        this.maxSaveSlots = 10;
        this.savePrefix = 'synapse_save_';
        this.autoSaveKey = 'synapse_autosave';
        this.quickSaveKey = 'synapse_quicksave';
        
        this.initializeSaveSystem();
    }
    
    initializeSaveSystem() {
        // Check for existing saves
        this.migrateLegacySaves();
        console.log('💾 Save System initialized');
    }
    
    // Create a save state from current game state
    createSaveState() {
        return {
            version: this.game.constructor.version || '1.0.0',
            timestamp: Date.now(),
            gameState: {
                ...this.game.gameState,
                // Convert Sets and Maps to arrays for JSON serialization
                visitedRooms: Array.from(this.game.gameState.visitedRooms),
                gameFlags: Object.fromEntries(this.game.gameState.gameFlags),
                achievements: Array.from(this.game.gameState.achievements)
            },
            settings: { ...this.game.settings }
        };
    }
    
    // Restore game state from save data
    restoreGameState(saveData) {
        try {
            // Restore basic game state
            Object.assign(this.game.gameState, saveData.gameState);
            
            // Restore complex types
            this.game.gameState.visitedRooms = new Set(saveData.gameState.visitedRooms || []);
            this.game.gameState.gameFlags = new Map(Object.entries(saveData.gameState.gameFlags || {}));
            this.game.gameState.achievements = new Set(saveData.gameState.achievements || []);
            
            // Restore settings
            if (saveData.settings) {
                Object.assign(this.game.settings, saveData.settings);
                this.game.applySettings();
            }
            
            return true;
        } catch (error) {
            console.error('Failed to restore game state:', error);
            return false;
        }
    }
    
    // Quick save to slot 0
    quickSave() {
        try {
            const saveData = this.createSaveState();
            localStorage.setItem(this.quickSaveKey, JSON.stringify(saveData));
            
            this.game.systems.interface.showNotification('Quick saved!', 'success');
            return true;
        } catch (error) {
            console.error('Quick save failed:', error);
            this.game.systems.interface.showNotification('Quick save failed!', 'error');
            return false;
        }
    }
    
    // Quick load from slot 0
    quickLoad() {
        try {
            const saveData = localStorage.getItem(this.quickSaveKey);
            if (saveData) {
                const parsed = JSON.parse(saveData);
                if (this.restoreGameState(parsed)) {
                    this.game.systems.interface.showNotification('Quick loaded!', 'success');
                    this.game.systems.interface.updateStats();
                    return true;
                }
            } else {
                this.game.systems.interface.showNotification('No quick save found!', 'warning');
            }
            return false;
        } catch (error) {
            console.error('Quick load failed:', error);
            this.game.systems.interface.showNotification('Quick load failed!', 'error');
            return false;
        }
    }
    
    // Auto save
    autoSave() {
        if (!this.autoSaveEnabled) return false;
        
        try {
            const saveData = this.createSaveState();
            localStorage.setItem(this.autoSaveKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Auto save failed:', error);
            return false;
        }
    }
    
    // Save to specific slot
    saveToSlot(slotNumber, name = '') {
        try {
            const saveData = this.createSaveState();
            saveData.name = name || `Save ${slotNumber}`;
            saveData.slotNumber = slotNumber;
            
            const key = this.savePrefix + slotNumber;
            localStorage.setItem(key, JSON.stringify(saveData));
            
            this.game.systems.interface.showNotification(`Saved to slot ${slotNumber}!`, 'success');
            return true;
        } catch (error) {
            console.error('Save to slot failed:', error);
            this.game.systems.interface.showNotification(`Save to slot ${slotNumber} failed!`, 'error');
            return false;
        }
    }
    
    // Load from specific slot
    loadFromSlot(slotNumber) {
        try {
            const key = this.savePrefix + slotNumber;
            const saveData = localStorage.getItem(key);
            
            if (saveData) {
                const parsed = JSON.parse(saveData);
                if (this.restoreGameState(parsed)) {
                    this.game.systems.interface.showNotification(`Loaded from slot ${slotNumber}!`, 'success');
                    this.game.systems.interface.updateStats();
                    return true;
                }
            } else {
                this.game.systems.interface.showNotification(`No save in slot ${slotNumber}!`, 'warning');
            }
            return false;
        } catch (error) {
            console.error('Load from slot failed:', error);
            this.game.systems.interface.showNotification(`Load from slot ${slotNumber} failed!`, 'error');
            return false;
        }
    }
    
    // Get all save slots
    getAllSaves() {
        const saves = [];
        
        for (let i = 0; i < this.maxSaveSlots; i++) {
            const key = this.savePrefix + i;
            const saveData = localStorage.getItem(key);
            
            if (saveData) {
                try {
                    const parsed = JSON.parse(saveData);
                    saves.push({
                        slot: i,
                        name: parsed.name || `Save ${i}`,
                        timestamp: parsed.timestamp,
                        playTime: parsed.gameState.playTime,
                        currentRoom: parsed.gameState.currentRoom,
                        turnCounter: parsed.gameState.turnCounter
                    });
                } catch (error) {
                    console.warn(`Invalid save data in slot ${i}:`, error);
                }
            } else {
                saves.push({
                    slot: i,
                    empty: true
                });
            }
        }
        
        return saves;
    }
    
    // Delete save from slot
    deleteSave(slotNumber) {
        try {
            const key = this.savePrefix + slotNumber;
            localStorage.removeItem(key);
            this.game.systems.interface.showNotification(`Save slot ${slotNumber} deleted!`, 'success');
            return true;
        } catch (error) {
            console.error('Delete save failed:', error);
            return false;
        }
    }
    
    // Export save data
    exportSave(slotNumber) {
        try {
            const key = this.savePrefix + slotNumber;
            const saveData = localStorage.getItem(key);
            
            if (saveData) {
                const blob = new Blob([saveData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `synapse_save_${slotNumber}_${Date.now()}.syn`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Export save failed:', error);
            return false;
        }
    }
    
    // Import save data
    importSave(file, slotNumber) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const saveData = JSON.parse(event.target.result);
                    
                    // Validate save data
                    if (this.validateSaveData(saveData)) {
                        const key = this.savePrefix + slotNumber;
                        localStorage.setItem(key, JSON.stringify(saveData));
                        resolve(true);
                    } else {
                        reject(new Error('Invalid save file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
    
    // Validate save data structure
    validateSaveData(saveData) {
        const requiredFields = ['version', 'timestamp', 'gameState'];
        
        for (const field of requiredFields) {
            if (!(field in saveData)) {
                return false;
            }
        }
        
        // Check game state structure
        const gameStateFields = ['currentRoom', 'turnCounter', 'sanity', 'awareness'];
        for (const field of gameStateFields) {
            if (!(field in saveData.gameState)) {
                return false;
            }
        }
        
        return true;
    }
    
    // Load latest save
    loadLatestSave() {
        const saves = this.getAllSaves().filter(save => !save.empty);
        
        if (saves.length > 0) {
            // Sort by timestamp and load the most recent
            saves.sort((a, b) => b.timestamp - a.timestamp);
            return this.loadFromSlot(saves[0].slot);
        } else {
            this.game.systems.interface.showNotification('No saves found!', 'warning');
            return false;
        }
    }
    
    // Check if auto save exists
    hasAutoSave() {
        return localStorage.getItem(this.autoSaveKey) !== null;
    }
    
    // Load auto save
    loadAutoSave() {
        try {
            const saveData = localStorage.getItem(this.autoSaveKey);
            if (saveData) {
                const parsed = JSON.parse(saveData);
                return this.restoreGameState(parsed);
            }
            return false;
        } catch (error) {
            console.error('Load auto save failed:', error);
            return false;
        }
    }
    
    // Clear all saves
    clearAllSaves() {
        try {
            // Remove all save slots
            for (let i = 0; i < this.maxSaveSlots; i++) {
                localStorage.removeItem(this.savePrefix + i);
            }
            
            // Remove special saves
            localStorage.removeItem(this.autoSaveKey);
            localStorage.removeItem(this.quickSaveKey);
            
            this.game.systems.interface.showNotification('All saves cleared!', 'success');
            return true;
        } catch (error) {
            console.error('Clear saves failed:', error);
            return false;
        }
    }
    
    // Migrate saves from older versions
    migrateLegacySaves() {
        // Check for saves from older versions and migrate them
        // This is a placeholder for future version compatibility
        console.log('Checking for legacy saves...');
    }
    
    // Get save statistics
    getSaveStats() {
        const saves = this.getAllSaves();
        const validSaves = saves.filter(save => !save.empty);
        
        return {
            totalSlots: this.maxSaveSlots,
            usedSlots: validSaves.length,
            hasAutoSave: this.hasAutoSave(),
            oldestSave: validSaves.length > 0 ? Math.min(...validSaves.map(s => s.timestamp)) : null,
            newestSave: validSaves.length > 0 ? Math.max(...validSaves.map(s => s.timestamp)) : null
        };
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveSystem;
}
