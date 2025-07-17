// SYNAPSE - Main Entry Point
// Initializes the game and handles global coordination

// Global game state
window.SYNAPSE = {
    version: '1.0.0',
    initialized: false,
    game: null,
    debug: false
};

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', initializeGame);

// Handle page visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// Handle before unload
window.addEventListener('beforeunload', handleBeforeUnload);

// Handle URL parameters
window.addEventListener('load', handleURLParameters);

// Handle PWA install prompt
window.addEventListener('beforeinstallprompt', handleInstallPrompt);

// Handle service worker updates
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
}

async function initializeGame() {
    try {
        console.log('🧠 SYNAPSE - Access Denied v' + window.SYNAPSE.version);
        console.log('Initializing neural network...');
        
        // Check for debug mode
        window.SYNAPSE.debug = localStorage.getItem('synapse_debug') === 'true' || 
                              window.location.search.includes('debug=true');
        
        if (window.SYNAPSE.debug) {
            console.log('🐛 Debug mode enabled');
            enableDebugMode();
        }
        
        // Initialize error handling
        setupErrorHandling();
        
        // Check browser compatibility
        if (!checkBrowserCompatibility()) {
            showBrowserWarning();
            return;
        }
        
        // Initialize PWA features
        await initializePWA();
        
        // Initialize game engine
        window.SYNAPSE.game = new GameEngine();
        
        // Setup global key handlers
        setupGlobalKeyHandlers();
        
        // Setup performance monitoring
        setupPerformanceMonitoring();
        
        // Mark as initialized
        window.SYNAPSE.initialized = true;
        
        console.log('✅ SYNAPSE initialized successfully');
        
        // Trigger any deferred initialization
        triggerDeferredInit();
        
    } catch (error) {
        console.error('❌ Failed to initialize SYNAPSE:', error);
        showCriticalError(error);
    }
}

function checkBrowserCompatibility() {
    const requiredFeatures = [
        'localStorage',
        'JSON',
        'Promise',
        'fetch',
        'addEventListener',
        'querySelector'
    ];
    
    for (const feature of requiredFeatures) {
        if (!(feature in window) && !(feature in document)) {
            console.error('Missing required feature:', feature);
            return false;
        }
    }
    
    // Check for modern JavaScript features
    try {
        // Test ES6 features
        const testArrow = () => true;
        const testConst = 'test';
        const testLet = 'test';
        const testTemplate = `test ${testConst}`;
        
        // Test modern APIs
        if (!window.requestAnimationFrame || !window.crypto) {
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Browser compatibility check failed:', error);
        return false;
    }
}

function showBrowserWarning() {
    document.body.innerHTML = `
        <div class="browser-warning">
            <h1>🧠 SYNAPSE - System Error</h1>
            <p>Your browser is not compatible with SYNAPSE.</p>
            <p>Please update to a modern browser such as:</p>
            <ul>
                <li>Chrome 80+</li>
                <li>Firefox 75+</li>
                <li>Safari 13+</li>
                <li>Edge 80+</li>
            </ul>
            <p>SYNAPSE requires modern web technologies for optimal neural network simulation.</p>
        </div>
    `;
}

async function initializePWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js', {
                scope: './'
            });
            
            console.log('✅ Service Worker registered:', registration.scope);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                }
            });
            
        } catch (error) {
            console.warn('Service Worker registration failed:', error);
        }
    }
    
    // Setup app shortcuts handling
    if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        
        if (action) {
            handleAppShortcut(action);
        }
    }
}

function handleAppShortcut(action) {
    // Store the action to be processed after game initialization
    window.SYNAPSE.pendingAction = action;
}

function triggerDeferredInit() {
    // Handle any pending actions from app shortcuts
    if (window.SYNAPSE.pendingAction && window.SYNAPSE.game) {
        const action = window.SYNAPSE.pendingAction;
        window.SYNAPSE.pendingAction = null;
        
        switch (action) {
            case 'new-game':
                window.SYNAPSE.game.showCharacterSelection();
                break;
            case 'load-game':
                window.SYNAPSE.game.systems.interface.showLoadGameDialog();
                break;
            case 'achievements':
                window.SYNAPSE.game.systems.interface.showAchievementsDialog();
                break;
        }
    }
}

function setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global Error:', event.error);
        logError('JavaScript Error', event.error, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        logError('Promise Rejection', event.reason);
        event.preventDefault(); // Prevent browser error console
    });
    
    // Custom SYNAPSE error handler
    window.SYNAPSE.reportError = function(error, context = {}) {
        logError('SYNAPSE Error', error, context);
    };
}

function logError(type, error, context = {}) {
    const errorData = {
        type,
        message: error?.message || error,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        context
    };
    
    // Log to console
    console.error(`[${type}]`, errorData);
    
    // Store error locally for debugging
    try {
        const errors = JSON.parse(localStorage.getItem('synapse_errors') || '[]');
        errors.push(errorData);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        localStorage.setItem('synapse_errors', JSON.stringify(errors));
    } catch (e) {
        console.warn('Failed to store error data:', e);
    }
}

function setupGlobalKeyHandlers() {
    // Debug console toggle
    document.addEventListener('keydown', (event) => {
        // Ctrl+Shift+D for debug console
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault();
            toggleDebugConsole();
        }
        
        // Ctrl+Shift+E for error log
        if (event.ctrlKey && event.shiftKey && event.key === 'E') {
            event.preventDefault();
            showErrorLog();
        }
        
        // F12 prevention in production (optional)
        if (!window.SYNAPSE.debug && event.key === 'F12') {
            event.preventDefault();
            showDebugWarning();
        }
    });
}

function setupPerformanceMonitoring() {
    if ('performance' in window) {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📊 Performance Metrics:', {
                        loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                        domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
                        firstPaint: getFirstPaintTime()
                    });
                }
            }, 0);
        });
        
        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('⚠️ High memory usage detected');
                    if (window.SYNAPSE.game) {
                        window.SYNAPSE.game.systems.interface.showNotification(
                            'High memory usage detected. Consider restarting the application.',
                            'warning'
                        );
                    }
                }
            }, 30000); // Check every 30 seconds
        }
    }
}

function getFirstPaintTime() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
}

function handleVisibilityChange() {
    if (window.SYNAPSE.game) {
        if (document.hidden) {
            // Page hidden - pause intensive operations
            window.SYNAPSE.game.handleWindowBlur();
        } else {
            // Page visible - resume operations
            window.SYNAPSE.game.handleWindowFocus();
        }
    }
}

function handleBeforeUnload(event) {
    // Only show warning if game is in progress
    if (window.SYNAPSE.game && 
        window.SYNAPSE.game.gameState.currentScreen === 'game' &&
        window.SYNAPSE.game.gameState.turnCounter > 0) {
        
        // Modern browsers only show generic message
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
        
        // Quick save before leaving
        if (window.SYNAPSE.game.systems.save) {
            window.SYNAPSE.game.systems.save.quickSave();
        }
    }
}

function handleURLParameters() {
    const params = new URLSearchParams(window.location.search);
    
    // Debug mode
    if (params.get('debug') === 'true') {
        window.SYNAPSE.debug = true;
        localStorage.setItem('synapse_debug', 'true');
        enableDebugMode();
    }
    
    // Auto-start parameters
    const autoStart = params.get('autostart');
    if (autoStart && window.SYNAPSE.game) {
        setTimeout(() => {
            switch (autoStart) {
                case 'new':
                    window.SYNAPSE.game.showCharacterSelection();
                    break;
                case 'continue':
                    window.SYNAPSE.game.systems.save.loadLatestSave();
                    break;
            }
        }, 1000);
    }
}

let installPromptEvent = null;

function handleInstallPrompt(event) {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    
    // Store the event for later use
    installPromptEvent = event;
    
    // Show custom install UI
    showInstallBanner();
}

function showInstallBanner() {
    if (!installPromptEvent) return;
    
    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
        <div class="install-content">
            <span>📱 Install SYNAPSE for the best experience</span>
            <button class="install-btn">Install</button>
            <button class="install-close">✕</button>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    // Handle install button click
    banner.querySelector('.install-btn').addEventListener('click', async () => {
        if (installPromptEvent) {
            installPromptEvent.prompt();
            const { outcome } = await installPromptEvent.userChoice;
            
            if (outcome === 'accepted') {
                console.log('PWA installed successfully');
            }
            
            installPromptEvent = null;
            banner.remove();
        }
    });
    
    // Handle close button
    banner.querySelector('.install-close').addEventListener('click', () => {
        banner.remove();
        installPromptEvent = null;
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (banner.parentNode) {
            banner.remove();
        }
    }, 10000);
}

function handleServiceWorkerMessage(event) {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'UPDATE_AVAILABLE':
                showUpdateNotification();
                break;
                
            case 'CACHE_UPDATED':
                console.log('🔄 Cache updated');
                break;
        }
    }
}

function showUpdateNotification() {
    if (window.SYNAPSE.game && window.SYNAPSE.game.systems.interface) {
        window.SYNAPSE.game.systems.interface.showModal(`
            <h2>Update Available</h2>
            <p>A new version of SYNAPSE is available. Would you like to update now?</p>
            <div class="modal-actions">
                <button class="btn" onclick="window.SYNAPSE.updateApp()">Update Now</button>
                <button class="btn" onclick="window.SYNAPSE.game.systems.interface.closeModal()">Later</button>
            </div>
        `);
    }
}

function showCriticalError(error) {
    document.body.innerHTML = `
        <div class="critical-error">
            <h1>🧠 SYNAPSE - Critical System Error</h1>
            <p>A critical error has occurred in the neural network:</p>
            <div class="error-details">
                <pre>${error.message || error}</pre>
            </div>
            <p>Please refresh the page to restart the system.</p>
            <button onclick="location.reload()" class="error-btn">Restart SYNAPSE</button>
            ${window.SYNAPSE.debug ? `
                <details class="debug-info">
                    <summary>Debug Information</summary>
                    <pre>${error.stack || 'No stack trace available'}</pre>
                </details>
            ` : ''}
        </div>
    `;
}

// Debug functions
function enableDebugMode() {
    document.body.classList.add('debug-mode');
    
    // Add debug styles
    if (!document.getElementById('debug-styles')) {
        const debugStyles = document.createElement('style');
        debugStyles.id = 'debug-styles';
        debugStyles.textContent = `
            .debug-mode::before {
                content: '🐛 DEBUG MODE';
                position: fixed;
                top: 0;
                right: 0;
                background: #ff0000;
                color: #ffffff;
                padding: 4px 8px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
            }
        `;
        document.head.appendChild(debugStyles);
    }
    
    // Expose debug functions
    window.debug = {
        game: () => window.SYNAPSE.game,
        state: () => window.SYNAPSE.game?.debug(),
        logs: () => showErrorLog(),
        clear: () => clearErrorLog(),
        performance: () => showPerformanceInfo(),
        cache: () => inspectCache()
    };
    
    console.log('🐛 Debug functions available in window.debug');
}

function toggleDebugConsole() {
    if (!window.SYNAPSE.debug) {
        enableDebugMode();
        window.SYNAPSE.debug = true;
        localStorage.setItem('synapse_debug', 'true');
    } else {
        window.SYNAPSE.debug = false;
        localStorage.setItem('synapse_debug', 'false');
        document.body.classList.remove('debug-mode');
        location.reload();
    }
}

function showDebugWarning() {
    if (window.SYNAPSE.game && window.SYNAPSE.game.systems.interface) {
        window.SYNAPSE.game.systems.interface.showModal(`
            <h2>🔒 Developer Tools Restricted</h2>
            <p>Developer tools are disabled in SYNAPSE for security reasons.</p>
            <p>If you need to debug the game, enable debug mode:</p>
            <code>localStorage.setItem('synapse_debug', 'true')</code>
            <div class="modal-actions">
                <button class="btn" onclick="window.SYNAPSE.game.systems.interface.closeModal()">Understood</button>
            </div>
        `);
    }
}

function showErrorLog() {
    try {
        const errors = JSON.parse(localStorage.getItem('synapse_errors') || '[]');
        console.table(errors);
        
        if (window.SYNAPSE.game && window.SYNAPSE.game.systems.interface) {
            const errorHtml = errors.map(error => `
                <div class="error-entry">
                    <strong>${error.type}</strong> - ${error.timestamp}<br>
                    ${error.message}<br>
                    <small>${error.context ? JSON.stringify(error.context) : ''}</small>
                </div>
            `).join('');
            
            window.SYNAPSE.game.systems.interface.showModal(`
                <h2>Error Log</h2>
                <div class="error-log">${errorHtml || 'No errors recorded'}</div>
                <div class="modal-actions">
                    <button class="btn" onclick="window.SYNAPSE.clearErrorLog()">Clear Log</button>
                    <button class="btn" onclick="window.SYNAPSE.game.systems.interface.closeModal()">Close</button>
                </div>
            `);
        }
    } catch (error) {
        console.error('Failed to show error log:', error);
    }
}

function clearErrorLog() {
    localStorage.removeItem('synapse_errors');
    console.log('Error log cleared');
}

function showPerformanceInfo() {
    if ('performance' in window) {
        const perfData = {
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            } : 'Not available',
            timing: performance.timing,
            entries: performance.getEntries().length
        };
        
        console.log('📊 Performance Info:', perfData);
        return perfData;
    }
}

async function inspectCache() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('💾 Available Caches:', cacheNames);
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            console.log(`Cache ${cacheName}:`, requests.map(req => req.url));
        }
    }
}

// Expose update function globally
window.SYNAPSE.updateApp = function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    } else {
        window.location.reload();
    }
};

// Expose clear cache function
window.SYNAPSE.clearCache = async function() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('🗑️ All caches cleared');
        window.location.reload();
    }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeGame,
        checkBrowserCompatibility,
        handleAppShortcut
    };
}

console.log('🧠 SYNAPSE Main Module Loaded');
