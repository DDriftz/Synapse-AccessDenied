// SYNAPSE - Service Worker
// Provides offline functionality and caching for PWA

const CACHE_NAME = 'synapse-v1.0.0';
const STATIC_CACHE = 'synapse-static-v1.0.0';
const DYNAMIC_CACHE = 'synapse-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    './',
    './index.html',
    './manifest.json',
    
    // Stylesheets
    './css/main.css',
    './css/effects.css',
    './css/mobile.css',
    
    // Core JavaScript
    './js/core/game-engine.js',
    './js/core/save-system.js',
    './js/core/audio-manager.js',
    
    // Systems
    './js/systems/ai-personality.js',
    './js/systems/narrative-engine.js',
    './js/systems/character-system.js',
    './js/systems/inventory-system.js',
    './js/systems/achievement-system.js',
    
    // UI
    './js/ui/interface-manager.js',
    './js/ui/command-parser.js',
    './js/ui/visual-effects.js',
    
    // Data
    './js/data/rooms.js',
    './js/data/items.js',
    './js/data/dialogue.js',
    './js/data/achievements.js',
    './js/data/localization.js',
    
    // Main entry point
    './js/main.js',
    
    // Fonts (from Google Fonts CDN)
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap',
    
    // Icons (placeholder paths - actual icons would need to be created)
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Network-first resources (always try to fetch fresh)
const NETWORK_FIRST = [
    './js/data/',
    './api/'
];

// Cache-first resources (serve from cache, update in background)
const CACHE_FIRST = [
    './css/',
    './js/',
    './icons/',
    './audio/',
    './images/'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('SYNAPSE Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('SYNAPSE Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('SYNAPSE Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('SYNAPSE Service Worker: Failed to cache static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('SYNAPSE Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE &&
                            cacheName.startsWith('synapse-')) {
                            console.log('SYNAPSE Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('SYNAPSE Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other special schemes
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (isStaticFile(request.url)) {
        event.respondWith(cacheFirst(request));
    } else if (isNetworkFirst(request.url)) {
        event.respondWith(networkFirst(request));
    } else if (isGameData(request.url)) {
        event.respondWith(staleWhileRevalidate(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('SYNAPSE Service Worker: Cache-first failed', error);
        return new Response('Offline - Resource not available', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('SYNAPSE Service Worker: Network failed, trying cache', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('./index.html');
        }
        
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stale-while-revalidate strategy (for game data)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(error => {
            console.warn('SYNAPSE Service Worker: Network failed for game data', error);
            return cachedResponse;
        });
    
    return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticFile(url) {
    return CACHE_FIRST.some(pattern => url.includes(pattern)) ||
           STATIC_FILES.includes(url) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.svg') ||
           url.includes('.woff') ||
           url.includes('.woff2');
}

function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function isGameData(url) {
    return url.includes('/data/') ||
           url.includes('rooms.js') ||
           url.includes('items.js') ||
           url.includes('dialogue.js') ||
           url.includes('achievements.js') ||
           url.includes('localization.js');
}

// Background sync for save data
self.addEventListener('sync', event => {
    if (event.tag === 'save-game-data') {
        event.waitUntil(syncSaveData());
    }
});

async function syncSaveData() {
    try {
        // Get pending save data from IndexedDB
        const pendingSaves = await getPendingSaves();
        
        for (const save of pendingSaves) {
            try {
                // Attempt to sync save data
                await syncSaveToServer(save);
                await markSaveAsSynced(save.id);
            } catch (error) {
                console.warn('Failed to sync save:', save.id, error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Placeholder functions for save sync (would need backend implementation)
async function getPendingSaves() {
    // This would retrieve pending saves from IndexedDB
    return [];
}

async function syncSaveToServer(save) {
    // This would send save data to a backend server
    return Promise.resolve();
}

async function markSaveAsSynced(saveId) {
    // This would mark the save as synced in IndexedDB
    return Promise.resolve();
}

// Push notifications (for game events or updates)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'New update available in SYNAPSE',
            icon: './icons/icon-192.png',
            badge: './icons/badge-72.png',
            vibrate: [200, 100, 200],
            data: data,
            actions: [
                {
                    action: 'open',
                    title: 'Open Game',
                    icon: './icons/action-open.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: './icons/action-dismiss.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'SYNAPSE', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle messages from the main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
                
            case 'GET_VERSION':
                event.ports[0].postMessage({ version: CACHE_NAME });
                break;
                
            case 'CLEAR_CACHE':
                event.waitUntil(clearAllCaches());
                break;
                
            case 'UPDATE_CACHE':
                event.waitUntil(updateCache(event.data.files));
                break;
        }
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

async function updateCache(files) {
    const cache = await caches.open(STATIC_CACHE);
    return cache.addAll(files);
}

// Error handling
self.addEventListener('error', event => {
    console.error('SYNAPSE Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('SYNAPSE Service Worker Unhandled Rejection:', event.reason);
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', event => {
        if (event.tag === 'check-for-updates') {
            event.waitUntil(checkForGameUpdates());
        }
    });
}

async function checkForGameUpdates() {
    try {
        // Check for game content updates
        const response = await fetch('./api/version');
        if (response.ok) {
            const versionData = await response.json();
            if (versionData.version !== CACHE_NAME) {
                // Notify main thread about available update
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'UPDATE_AVAILABLE',
                        version: versionData.version
                    });
                });
            }
        }
    } catch (error) {
        console.warn('Update check failed:', error);
    }
}

console.log('SYNAPSE Service Worker: Loaded');
