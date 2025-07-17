// SYNAPSE - Error Diagnostics
// Comprehensive error detection and reporting system

class ErrorDiagnostics {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.startTime = Date.now();
        
        this.initialize();
    }
    
    initialize() {
        // Set up global error handlers
        this.setupErrorHandlers();
        
        // Run initial diagnostics
        this.runDiagnostics();
        
        console.log('🔍 Error Diagnostics initialized');
    }
    
    setupErrorHandlers() {
        // Catch JavaScript errors
        window.addEventListener('error', (event) => {
            this.addError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.addError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
        
        // Catch resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.addError('Resource Loading Error', {
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    type: event.target.type
                });
            }
        }, true);
    }
    
    runDiagnostics() {
        this.checkDOMElements();
        this.checkJavaScriptObjects();
        this.checkCSSFiles();
        this.checkBrowserSupport();
        this.checkLocalStorage();
        this.checkServiceWorker();
        this.checkManifest();
        this.checkPerformance();
    }
    
    checkDOMElements() {
        const requiredElements = [
            'loading-screen', 'main-menu', 'character-selection',
            'game-interface', 'game-output', 'command-input',
            'modal-overlay', 'side-panel'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            this.addError('Missing DOM Elements', {
                missing: missingElements,
                count: missingElements.length
            });
        } else {
            this.addInfo('DOM Elements', 'All required elements found');
        }
    }
    
    checkJavaScriptObjects() {
        const requiredObjects = [
            'GameEngine', 'InterfaceManager', 'CommandParser',
            'NarrativeEngine', 'AIPersonality', 'CharacterSystem',
            'InventorySystem', 'AchievementSystem', 'SaveSystem',
            'AudioManager', 'VisualEffects'
        ];
        
        const missingObjects = requiredObjects.filter(obj => typeof window[obj] === 'undefined');
        
        if (missingObjects.length > 0) {
            this.addWarning('Missing JavaScript Objects', {
                missing: missingObjects,
                count: missingObjects.length
            });
        } else {
            this.addInfo('JavaScript Objects', 'All classes available');
        }
    }
    
    checkCSSFiles() {
        const requiredCSSFiles = ['main.css', 'effects.css', 'neural-effects.css', 'mobile.css'];
        const loadedCSS = Array.from(document.styleSheets)
            .map(sheet => sheet.href)
            .filter(href => href)
            .map(href => href.split('/').pop());
        
        const missingCSS = requiredCSSFiles.filter(file => 
            !loadedCSS.some(loaded => loaded.includes(file))
        );
        
        if (missingCSS.length > 0) {
            this.addError('Missing CSS Files', {
                missing: missingCSS,
                loaded: loadedCSS
            });
        } else {
            this.addInfo('CSS Files', `${requiredCSSFiles.length} files loaded successfully`);
        }
    }
    
    checkBrowserSupport() {
        const requiredFeatures = {
            'localStorage': () => 'localStorage' in window,
            'sessionStorage': () => 'sessionStorage' in window,
            'JSON': () => 'JSON' in window,
            'Promise': () => 'Promise' in window,
            'fetch': () => 'fetch' in window,
            'requestAnimationFrame': () => 'requestAnimationFrame' in window,
            'crypto': () => 'crypto' in window,
            'serviceWorker': () => 'serviceWorker' in navigator,
            'ES6 Arrow Functions': () => {
                try { eval('() => {}'); return true; } catch { return false; }
            },
            'ES6 Template Literals': () => {
                try { eval('`test`'); return true; } catch { return false; }
            },
            'ES6 Classes': () => {
                try { eval('class Test {}'); return true; } catch { return false; }
            }
        };
        
        const unsupportedFeatures = Object.entries(requiredFeatures)
            .filter(([name, test]) => !test())
            .map(([name]) => name);
        
        if (unsupportedFeatures.length > 0) {
            this.addError('Browser Compatibility', {
                unsupported: unsupportedFeatures,
                userAgent: navigator.userAgent
            });
        } else {
            this.addInfo('Browser Compatibility', 'All required features supported');
        }
    }
    
    checkLocalStorage() {
        try {
            const testKey = 'synapse_test_' + Date.now();
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            this.addInfo('Local Storage', 'Working correctly');
        } catch (error) {
            this.addError('Local Storage', {
                error: error.message,
                available: 'localStorage' in window
            });
        }
    }
    
    checkServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration()
                .then(registration => {
                    if (registration) {
                        this.addInfo('Service Worker', 'Registered and active');
                    } else {
                        this.addWarning('Service Worker', 'Not registered');
                    }
                })
                .catch(error => {
                    this.addError('Service Worker', {
                        error: error.message
                    });
                });
        } else {
            this.addWarning('Service Worker', 'Not supported in this browser');
        }
    }
    
    checkManifest() {
        fetch('./manifest.json')
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            })
            .then(manifest => {
                this.addInfo('PWA Manifest', 'Valid and accessible');
                
                // Check manifest completeness
                const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
                const missingFields = requiredFields.filter(field => !manifest[field]);
                
                if (missingFields.length > 0) {
                    this.addWarning('PWA Manifest', {
                        message: 'Missing recommended fields',
                        missing: missingFields
                    });
                }
            })
            .catch(error => {
                this.addError('PWA Manifest', {
                    error: error.message
                });
            });
    }
    
    checkPerformance() {
        if ('performance' in window) {
            const loadTime = Date.now() - this.startTime;
            
            if (loadTime > 5000) {
                this.addWarning('Performance', {
                    message: 'Slow page load detected',
                    loadTime: loadTime + 'ms'
                });
            } else {
                this.addInfo('Performance', `Page loaded in ${loadTime}ms`);
            }
            
            // Check memory usage if available
            if (performance.memory) {
                const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                if (memoryMB > 100) {
                    this.addWarning('Memory Usage', {
                        message: 'High memory usage detected',
                        memory: memoryMB + 'MB'
                    });
                } else {
                    this.addInfo('Memory Usage', `${memoryMB}MB used`);
                }
            }
        }
    }
    
    addError(category, details) {
        const error = {
            type: 'error',
            category,
            details,
            timestamp: Date.now()
        };
        this.errors.push(error);
        console.error(`[SYNAPSE Error] ${category}:`, details);
    }
    
    addWarning(category, details) {
        const warning = {
            type: 'warning',
            category,
            details,
            timestamp: Date.now()
        };
        this.warnings.push(warning);
        console.warn(`[SYNAPSE Warning] ${category}:`, details);
    }
    
    addInfo(category, details) {
        const info = {
            type: 'info',
            category,
            details,
            timestamp: Date.now()
        };
        this.info.push(info);
        console.log(`[SYNAPSE Info] ${category}:`, details);
    }
    
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            errors: this.errors,
            warnings: this.warnings,
            info: this.info,
            summary: {
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length,
                totalInfo: this.info.length,
                status: this.errors.length === 0 ? 'healthy' : 'issues detected'
            },
            environment: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now(),
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }
        };
        
        return report;
    }
    
    exportReport() {
        const report = this.generateReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `synapse-diagnostic-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    displayReport() {
        console.group('🔍 SYNAPSE Diagnostic Report');
        console.log('Generated:', new Date().toISOString());
        
        if (this.errors.length > 0) {
            console.group('❌ Errors');
            this.errors.forEach(error => {
                console.error(error.category, error.details);
            });
            console.groupEnd();
        }
        
        if (this.warnings.length > 0) {
            console.group('⚠️ Warnings');
            this.warnings.forEach(warning => {
                console.warn(warning.category, warning.details);
            });
            console.groupEnd();
        }
        
        if (this.info.length > 0) {
            console.group('ℹ️ Information');
            this.info.forEach(info => {
                console.log(info.category, info.details);
            });
            console.groupEnd();
        }
        
        console.log('Summary:', {
            errors: this.errors.length,
            warnings: this.warnings.length,
            info: this.info.length,
            status: this.errors.length === 0 ? '✅ Healthy' : '⚠️ Issues Detected'
        });
        
        console.groupEnd();
    }
}

// Auto-initialize diagnostics in debug mode
document.addEventListener('DOMContentLoaded', () => {
    if (window.SYNAPSE && window.SYNAPSE.debug) {
        window.SYNAPSE.diagnostics = new ErrorDiagnostics();
        
        // Add global debug commands
        window.SYNAPSE.diagnose = () => {
            window.SYNAPSE.diagnostics.displayReport();
        };
        
        window.SYNAPSE.exportDiagnostics = () => {
            window.SYNAPSE.diagnostics.exportReport();
        };
        
        // Run report after a delay to allow everything to load
        setTimeout(() => {
            window.SYNAPSE.diagnostics.displayReport();
        }, 2000);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorDiagnostics;
}
