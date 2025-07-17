// SYNAPSE - Audio Manager
// Handles all audio playback and ambient sound management

class AudioManager {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.audioContext = null;
        this.masterVolume = 0.7;
        this.musicVolume = 0.8;
        this.effectsVolume = 0.9;
        this.ambientVolume = 0.6;
        
        this.audioCache = new Map();
        this.currentMusic = null;
        this.currentAmbient = null;
        this.activeEffects = new Map();
        
        this.initialized = false;
        this.muted = false;
        
        this.initializeAudio();
    }
    
    async initializeAudio() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes for volume control
            this.masterGain = this.audioContext.createGain();
            this.musicGain = this.audioContext.createGain();
            this.effectsGain = this.audioContext.createGain();
            this.ambientGain = this.audioContext.createGain();
            
            // Connect gain nodes
            this.musicGain.connect(this.masterGain);
            this.effectsGain.connect(this.masterGain);
            this.ambientGain.connect(this.masterGain);
            this.masterGain.connect(this.audioContext.destination);
            
            // Set initial volumes
            this.updateVolumes();
            
            this.initialized = true;
            console.log('🔊 Audio Manager initialized');
            
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            // Fallback to HTML5 audio
            this.initializeHTMLAudio();
        }
    }
    
    initializeHTMLAudio() {
        // Fallback for browsers without Web Audio API support
        this.htmlAudio = {
            music: new Audio(),
            ambient: new Audio(),
            effects: []
        };
        
        // Set up HTML audio elements
        this.htmlAudio.music.loop = true;
        this.htmlAudio.ambient.loop = true;
        
        this.updateHTMLVolumes();
        this.initialized = true;
        console.log('🔊 Audio Manager initialized (HTML5 fallback)');
    }
    
    // Resume audio context (required for user interaction)
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('Audio context resumed');
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }
    
    // Update volume levels
    updateVolumes() {
        if (this.audioContext) {
            this.masterGain.gain.value = this.muted ? 0 : this.masterVolume;
            this.musicGain.gain.value = this.musicVolume;
            this.effectsGain.gain.value = this.effectsVolume;
            this.ambientGain.gain.value = this.ambientVolume;
        } else {
            this.updateHTMLVolumes();
        }
    }
    
    updateHTMLVolumes() {
        if (this.htmlAudio) {
            const masterVol = this.muted ? 0 : this.masterVolume;
            this.htmlAudio.music.volume = masterVol * this.musicVolume;
            this.htmlAudio.ambient.volume = masterVol * this.ambientVolume;
        }
    }
    
    // Load audio file
    async loadAudio(url, type = 'effect') {
        if (this.audioCache.has(url)) {
            return this.audioCache.get(url);
        }
        
        try {
            if (this.audioContext) {
                // Web Audio API approach
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                
                this.audioCache.set(url, {
                    type: 'webaudio',
                    buffer: audioBuffer,
                    url: url
                });
                
                return this.audioCache.get(url);
            } else {
                // HTML5 Audio approach
                const audio = new Audio(url);
                await new Promise((resolve, reject) => {
                    audio.addEventListener('canplaythrough', resolve);
                    audio.addEventListener('error', reject);
                    audio.load();
                });
                
                this.audioCache.set(url, {
                    type: 'html5',
                    element: audio,
                    url: url
                });
                
                return this.audioCache.get(url);
            }
        } catch (error) {
            console.warn(`Failed to load audio: ${url}`, error);
            return null;
        }
    }
    
    // Play sound effect
    async playEffect(soundName, volume = 1.0, pitch = 1.0) {
        if (!this.initialized) return null;
        
        await this.resumeAudioContext();
        
        const audioUrl = this.getSoundUrl(soundName, 'effect');
        const audioData = await this.loadAudio(audioUrl, 'effect');
        
        if (!audioData) return null;
        
        try {
            if (audioData.type === 'webaudio') {
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();
                
                source.buffer = audioData.buffer;
                source.playbackRate.value = pitch;
                gainNode.gain.value = volume;
                
                source.connect(gainNode);
                gainNode.connect(this.effectsGain);
                
                source.start();
                
                // Store reference for potential stopping
                const effectId = Date.now() + Math.random();
                this.activeEffects.set(effectId, source);
                
                // Clean up after playback
                source.onended = () => {
                    this.activeEffects.delete(effectId);
                };
                
                return effectId;
            } else {
                // HTML5 Audio fallback
                const audio = audioData.element.cloneNode();
                audio.volume = (this.muted ? 0 : this.masterVolume) * this.effectsVolume * volume;
                audio.playbackRate = pitch;
                audio.play();
                
                return audio;
            }
        } catch (error) {
            console.warn('Failed to play effect:', error);
            return null;
        }
    }
    
    // Play background music
    async playMusic(musicName, fadeIn = true, loop = true) {
        if (!this.initialized) return;
        
        await this.resumeAudioContext();
        
        // Stop current music
        this.stopMusic(fadeIn);
        
        const audioUrl = this.getSoundUrl(musicName, 'music');
        const audioData = await this.loadAudio(audioUrl, 'music');
        
        if (!audioData) return;
        
        try {
            if (audioData.type === 'webaudio') {
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();
                
                source.buffer = audioData.buffer;
                source.loop = loop;
                
                if (fadeIn) {
                    gainNode.gain.value = 0;
                    gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 2);
                } else {
                    gainNode.gain.value = 1;
                }
                
                source.connect(gainNode);
                gainNode.connect(this.musicGain);
                
                source.start();
                
                this.currentMusic = {
                    source: source,
                    gain: gainNode,
                    name: musicName
                };
            } else {
                // HTML5 Audio fallback
                this.htmlAudio.music.src = audioUrl;
                this.htmlAudio.music.loop = loop;
                
                if (fadeIn) {
                    this.htmlAudio.music.volume = 0;
                    this.htmlAudio.music.play();
                    this.fadeVolume(this.htmlAudio.music, 
                        (this.muted ? 0 : this.masterVolume) * this.musicVolume, 2000);
                } else {
                    this.htmlAudio.music.volume = (this.muted ? 0 : this.masterVolume) * this.musicVolume;
                    this.htmlAudio.music.play();
                }
                
                this.currentMusic = {
                    element: this.htmlAudio.music,
                    name: musicName
                };
            }
        } catch (error) {
            console.warn('Failed to play music:', error);
        }
    }
    
    // Stop background music
    stopMusic(fadeOut = true) {
        if (!this.currentMusic) return;
        
        if (this.currentMusic.source) {
            // Web Audio API
            if (fadeOut) {
                this.currentMusic.gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
                setTimeout(() => {
                    if (this.currentMusic && this.currentMusic.source) {
                        this.currentMusic.source.stop();
                    }
                }, 1000);
            } else {
                this.currentMusic.source.stop();
            }
        } else if (this.currentMusic.element) {
            // HTML5 Audio
            if (fadeOut) {
                this.fadeVolume(this.currentMusic.element, 0, 1000, () => {
                    this.currentMusic.element.pause();
                });
            } else {
                this.currentMusic.element.pause();
            }
        }
        
        this.currentMusic = null;
    }
    
    // Play ambient sound
    async playAmbient(ambientName, volume = 1.0, fadeIn = true) {
        if (!this.initialized) return;
        
        await this.resumeAudioContext();
        
        // Stop current ambient
        this.stopAmbient(fadeIn);
        
        const audioUrl = this.getSoundUrl(ambientName, 'ambient');
        const audioData = await this.loadAudio(audioUrl, 'ambient');
        
        if (!audioData) return;
        
        try {
            if (audioData.type === 'webaudio') {
                const source = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();
                
                source.buffer = audioData.buffer;
                source.loop = true;
                
                if (fadeIn) {
                    gainNode.gain.value = 0;
                    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 3);
                } else {
                    gainNode.gain.value = volume;
                }
                
                source.connect(gainNode);
                gainNode.connect(this.ambientGain);
                
                source.start();
                
                this.currentAmbient = {
                    source: source,
                    gain: gainNode,
                    name: ambientName
                };
            } else {
                // HTML5 Audio fallback
                this.htmlAudio.ambient.src = audioUrl;
                this.htmlAudio.ambient.loop = true;
                
                const targetVolume = (this.muted ? 0 : this.masterVolume) * this.ambientVolume * volume;
                
                if (fadeIn) {
                    this.htmlAudio.ambient.volume = 0;
                    this.htmlAudio.ambient.play();
                    this.fadeVolume(this.htmlAudio.ambient, targetVolume, 3000);
                } else {
                    this.htmlAudio.ambient.volume = targetVolume;
                    this.htmlAudio.ambient.play();
                }
                
                this.currentAmbient = {
                    element: this.htmlAudio.ambient,
                    name: ambientName
                };
            }
        } catch (error) {
            console.warn('Failed to play ambient:', error);
        }
    }
    
    // Stop ambient sound
    stopAmbient(fadeOut = true) {
        if (!this.currentAmbient) return;
        
        if (this.currentAmbient.source) {
            // Web Audio API
            if (fadeOut) {
                this.currentAmbient.gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);
                setTimeout(() => {
                    if (this.currentAmbient && this.currentAmbient.source) {
                        this.currentAmbient.source.stop();
                    }
                }, 2000);
            } else {
                this.currentAmbient.source.stop();
            }
        } else if (this.currentAmbient.element) {
            // HTML5 Audio
            if (fadeOut) {
                this.fadeVolume(this.currentAmbient.element, 0, 2000, () => {
                    this.currentAmbient.element.pause();
                });
            } else {
                this.currentAmbient.element.pause();
            }
        }
        
        this.currentAmbient = null;
    }
    
    // Helper function to fade HTML5 audio volume
    fadeVolume(audioElement, targetVolume, duration, callback) {
        const startVolume = audioElement.volume;
        const volumeChange = targetVolume - startVolume;
        const steps = 60; // 60 FPS
        const stepTime = duration / steps;
        const stepSize = volumeChange / steps;
        
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            currentStep++;
            audioElement.volume = startVolume + (stepSize * currentStep);
            
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                audioElement.volume = targetVolume;
                if (callback) callback();
            }
        }, stepTime);
    }
    
    // Get sound URL based on name and type
    getSoundUrl(soundName, type) {
        // This would normally map to actual audio files
        // For now, return placeholder URLs
        const baseUrl = 'assets/audio/';
        const extension = '.ogg'; // Prefer OGG for better compression
        
        return `${baseUrl}${type}/${soundName}${extension}`;
    }
    
    // Set master volume
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    // Set effects volume
    setEffectsVolume(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    // Set ambient volume
    setAmbientVolume(volume) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        this.updateVolumes();
    }
    
    // Mute/unmute all audio
    toggleMute() {
        this.muted = !this.muted;
        this.updateVolumes();
        return this.muted;
    }
    
    // Stop all audio
    stopAllAudio() {
        this.stopMusic(false);
        this.stopAmbient(false);
        
        // Stop all active effects
        this.activeEffects.forEach(effect => {
            if (effect.stop) {
                effect.stop();
            }
        });
        this.activeEffects.clear();
    }
    
    // Preload audio files
    async preloadAudio(audioList) {
        console.log('Preloading audio files...');
        
        const loadPromises = audioList.map(audio => 
            this.loadAudio(this.getSoundUrl(audio.name, audio.type), audio.type)
        );
        
        try {
            await Promise.all(loadPromises);
            console.log('Audio preloading complete');
        } catch (error) {
            console.warn('Some audio files failed to preload:', error);
        }
    }
    
    // Get audio status
    getStatus() {
        return {
            initialized: this.initialized,
            muted: this.muted,
            volumes: {
                master: this.masterVolume,
                music: this.musicVolume,
                effects: this.effectsVolume,
                ambient: this.ambientVolume
            },
            playing: {
                music: this.currentMusic ? this.currentMusic.name : null,
                ambient: this.currentAmbient ? this.currentAmbient.name : null,
                activeEffects: this.activeEffects.size
            },
            cacheSize: this.audioCache.size
        };
    }
    
    // Clean up resources
    dispose() {
        this.stopAllAudio();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.audioCache.clear();
        this.activeEffects.clear();
    }
}

// Export for use in game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
