// SYNAPSE - Runtime Safety Checks
// Additional safety measures and runtime validation

class RuntimeSafety {
    constructor() {
        this.safetyChecks = new Map();
        this.initialize();
    }
    
    initialize() {
        // Wrap critical functions with safety checks
        this.wrapLocalStorage();
        this.wrapGameEngine();
        this.wrapDOMOperations();
        
        console.log('🛡️ Runtime Safety initialized');
    }
    
    wrapLocalStorage() {
        // Safe localStorage wrapper
        window.safeLocalStorage = {
            getItem: (key) => {
                try {
                    return localStorage.getItem(key);
                } catch (error) {
                    console.warn('localStorage.getItem failed:', error);
                    return null;
                }
            },
            
            setItem: (key, value) => {
                try {
                    localStorage.setItem(key, value);
                    return true;
                } catch (error) {
                    console.warn('localStorage.setItem failed:', error);
                    return false;
                }
            },
            
            removeItem: (key) => {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.warn('localStorage.removeItem failed:', error);
                    return false;
                }
            }
        };
    }
    
    wrapGameEngine() {
        // Ensure GameEngine exists before initializing
        const originalGameEngine = window.GameEngine;
        
        window.GameEngine = function(...args) {
            try {
                return new originalGameEngine(...args);
            } catch (error) {
                console.error('GameEngine initialization failed:', error);
                // Return a fallback object
                return {
                    initialized: false,
                    error: error.message,
                    init: () => console.error('GameEngine failed to initialize')
                };
            }
        };
        
        // Copy prototype
        if (originalGameEngine && originalGameEngine.prototype) {
            window.GameEngine.prototype = originalGameEngine.prototype;
        }
    }
    
    wrapDOMOperations() {
        // Safe DOM query functions
        window.safeQuery = {
            getElementById: (id) => {
                try {
                    const element = document.getElementById(id);
                    if (!element) {
                        console.warn(`Element not found: ${id}`);
                    }
                    return element;
                } catch (error) {
                    console.error('getElementById failed:', error);
                    return null;
                }
            },
            
            querySelector: (selector) => {
                try {
                    return document.querySelector(selector);
                } catch (error) {
                    console.error('querySelector failed:', error);
                    return null;
                }
            },
            
            querySelectorAll: (selector) => {
                try {
                    return document.querySelectorAll(selector);
                } catch (error) {
                    console.error('querySelectorAll failed:', error);
                    return [];
                }
            }
        };
    }
    
    validateGameData() {
        const requiredData = [
            'roomsData',
            'itemsData', 
            'dialogueData',
            'ACHIEVEMENTS'
        ];
        
        const missingData = requiredData.filter(data => typeof window[data] === 'undefined');
        
        if (missingData.length > 0) {
            console.error('Missing game data:', missingData);
            return false;
        }
        
        return true;
    }
    
    validateSystems() {
        const requiredSystems = [
            'GameEngine',
            'InterfaceManager',
            'CommandParser',
            'NarrativeEngine'
        ];
        
        const missingSystems = requiredSystems.filter(system => typeof window[system] === 'undefined');
        
        if (missingSystems.length > 0) {
            console.error('Missing game systems:', missingSystems);
            return false;
        }
        
        return true;
    }
    
    performHealthCheck() {
        const results = {
            gameData: this.validateGameData(),
            systems: this.validateSystems(),
            localStorage: this.testLocalStorage(),
            dom: this.testDOMAccess()
        };
        
        const allHealthy = Object.values(results).every(Boolean);
        
        console.log('🏥 Health Check Results:', results);
        
        if (allHealthy) {
            console.log('✅ All systems healthy');
        } else {
            console.warn('⚠️ Some systems have issues');
        }
        
        return results;
    }
    
    testLocalStorage() {
        try {
            const testKey = 'synapse_health_check';
            localStorage.setItem(testKey, 'test');
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            return retrieved === 'test';
        } catch (error) {
            return false;
        }
    }
    
    testDOMAccess() {
        try {
            const testElement = document.getElementById('loading-screen');
            return testElement !== null;
        } catch (error) {
            return false;
        }
    }
    
    enableSafeMode() {
        console.log('🛡️ Enabling Safe Mode');
        
        // Override risky operations with safe versions
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = (callback, delay, ...args) => {
            try {
                return originalSetTimeout(() => {
                    try {
                        callback(...args);
                    } catch (error) {
                        console.error('setTimeout callback error:', error);
                    }
                }, delay);
            } catch (error) {
                console.error('setTimeout error:', error);
                return -1;
            }
        };
        
        // Override requestAnimationFrame
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = (callback) => {
            try {
                return originalRAF((timestamp) => {
                    try {
                        callback(timestamp);
                    } catch (error) {
                        console.error('requestAnimationFrame callback error:', error);
                    }
                });
            } catch (error) {
                console.error('requestAnimationFrame error:', error);
                return -1;
            }
        };
    }
}

// Initialize runtime safety
document.addEventListener('DOMContentLoaded', () => {
    window.SYNAPSE = window.SYNAPSE || {};
    window.SYNAPSE.runtimeSafety = new RuntimeSafety();
    
    // Enable safe mode in debug builds
    if (window.SYNAPSE.debug) {
        window.SYNAPSE.runtimeSafety.enableSafeMode();
    }
    
    // Perform health check after page load
    setTimeout(() => {
        window.SYNAPSE.runtimeSafety.performHealthCheck();
    }, 1000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RuntimeSafety;
}
