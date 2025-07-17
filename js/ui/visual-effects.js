// SYNAPSE - Visual Effects System
// Handles screen effects, transitions, and visual feedback

class VisualEffects {
    constructor() {
        this.effects = new Map();
        this.activeAnimations = new Set();
        this.settings = {
            intensity: 1.0,
            reducedMotion: false,
            enabled: true
        };
        
        this.initialize();
    }
    
    initialize() {
        // Check for reduced motion preference
        this.settings.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize effect containers
        this.createEffectContainers();
        
        // Setup CSS custom properties for dynamic effects
        this.setupCSSProperties();
        
        console.log('✅ Visual Effects system initialized');
    }
    
    createEffectContainers() {
        // Create main effects container if it doesn't exist
        if (!document.getElementById('visual-effects')) {
            const effectsContainer = document.createElement('div');
            effectsContainer.id = 'visual-effects';
            effectsContainer.className = 'visual-effects-container';
            effectsContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(effectsContainer);
        }
    }
    
    setupCSSProperties() {
        const root = document.documentElement;
        root.style.setProperty('--effect-intensity', this.settings.intensity);
        root.style.setProperty('--motion-enabled', this.settings.reducedMotion ? '0' : '1');
    }
    
    // Glitch effect for corrupted text/horror moments
    glitchText(element, duration = 1000, intensity = 1.0) {
        if (!this.settings.enabled || this.settings.reducedMotion) return;
        
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
        let animationId;
        
        const animate = (startTime) => {
            return (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 1) {
                    // Create glitched version
                    let glitchedText = '';
                    for (let i = 0; i < originalText.length; i++) {
                        if (Math.random() < intensity * 0.1 * (1 - progress)) {
                            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        } else {
                            glitchedText += originalText[i];
                        }
                    }
                    element.textContent = glitchedText;
                    animationId = requestAnimationFrame(animate(startTime));
                } else {
                    element.textContent = originalText;
                    this.activeAnimations.delete(animationId);
                }
            };
        };
        
        animationId = requestAnimationFrame(animate(performance.now()));
        this.activeAnimations.add(animationId);
        
        return animationId;
    }
    
    // Screen shake effect
    screenShake(intensity = 10, duration = 500) {
        if (!this.settings.enabled || this.settings.reducedMotion) return;
        
        const container = document.getElementById('game-interface') || document.body;
        let animationId;
        
        const animate = (startTime) => {
            return (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 1) {
                    const currentIntensity = intensity * (1 - progress);
                    const x = (Math.random() - 0.5) * currentIntensity;
                    const y = (Math.random() - 0.5) * currentIntensity;
                    
                    container.style.transform = `translate(${x}px, ${y}px)`;
                    animationId = requestAnimationFrame(animate(startTime));
                } else {
                    container.style.transform = '';
                    this.activeAnimations.delete(animationId);
                }
            };
        };
        
        animationId = requestAnimationFrame(animate(performance.now()));
        this.activeAnimations.add(animationId);
        
        return animationId;
    }
    
    // Typing effect for text
    typeText(element, text, speed = 50, callback = null) {
        if (!this.settings.enabled) {
            element.textContent = text;
            if (callback) callback();
            return;
        }
        
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        };
        
        type();
    }
    
    // Flash effect for notifications
    flash(color = '#ff0000', duration = 200) {
        if (!this.settings.enabled || this.settings.reducedMotion) return;
        
        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${color};
            opacity: 0.3;
            pointer-events: none;
            z-index: 10000;
            animation: flash ${duration}ms ease-out;
        `;
        
        // Add flash animation if not exists
        if (!document.getElementById('flash-style')) {
            const style = document.createElement('style');
            style.id = 'flash-style';
            style.textContent = `
                @keyframes flash {
                    0% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(flashOverlay);
        
        setTimeout(() => {
            if (flashOverlay.parentNode) {
                flashOverlay.parentNode.removeChild(flashOverlay);
            }
        }, duration);
    }
    
    // Fade transition between screens
    fadeTransition(fromElement, toElement, duration = 500, callback = null) {
        if (!this.settings.enabled || this.settings.reducedMotion) {
            fromElement.classList.add('hidden');
            toElement.classList.remove('hidden');
            if (callback) callback();
            return;
        }
        
        // Fade out
        fromElement.style.transition = `opacity ${duration}ms ease-out`;
        fromElement.style.opacity = '0';
        
        setTimeout(() => {
            fromElement.classList.add('hidden');
            fromElement.style.opacity = '';
            fromElement.style.transition = '';
            
            toElement.classList.remove('hidden');
            toElement.style.opacity = '0';
            toElement.style.transition = `opacity ${duration}ms ease-in`;
            
            // Force reflow
            toElement.offsetHeight;
            
            toElement.style.opacity = '1';
            
            setTimeout(() => {
                toElement.style.opacity = '';
                toElement.style.transition = '';
                if (callback) callback();
            }, duration);
        }, duration);
    }
    
    // Pulse effect for important elements
    pulse(element, color = '#00ff41', duration = 1000) {
        if (!this.settings.enabled || this.settings.reducedMotion) return;
        
        element.style.animation = `pulse-${color.slice(1)} ${duration}ms ease-in-out`;
        
        // Create pulse animation if not exists
        const styleId = `pulse-style-${color.slice(1)}`;
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes pulse-${color.slice(1)} {
                    0%, 100% { box-shadow: 0 0 5px ${color}; }
                    50% { box-shadow: 0 0 20px ${color}, 0 0 30px ${color}; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
    
    // Neural corruption effect
    corruptScreen(intensity = 0.5, duration = 2000) {
        if (!this.settings.enabled || this.settings.reducedMotion) return;
        
        const corruptOverlay = document.createElement('div');
        corruptOverlay.className = 'corrupt-overlay';
        corruptOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 0, 0, ${intensity * 0.1}) 3px,
                rgba(255, 0, 0, ${intensity * 0.1}) 4px
            );
            animation: corruption ${duration}ms linear;
        `;
        
        // Add corruption animation if not exists
        if (!document.getElementById('corruption-style')) {
            const style = document.createElement('style');
            style.id = 'corruption-style';
            style.textContent = `
                @keyframes corruption {
                    0%, 100% { opacity: 0; transform: translateX(0); }
                    25% { opacity: 1; transform: translateX(-2px); }
                    50% { opacity: 0.8; transform: translateX(2px); }
                    75% { opacity: 1; transform: translateX(-1px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(corruptOverlay);
        
        setTimeout(() => {
            if (corruptOverlay.parentNode) {
                corruptOverlay.parentNode.removeChild(corruptOverlay);
            }
        }, duration);
    }
    
    // Stop all active effects
    stopAllEffects() {
        this.activeAnimations.forEach(animationId => {
            cancelAnimationFrame(animationId);
        });
        this.activeAnimations.clear();
        
        // Remove all effect overlays
        const overlays = document.querySelectorAll('.corrupt-overlay, .flash-overlay');
        overlays.forEach(overlay => overlay.remove());
    }
    
    // Update settings
    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        this.setupCSSProperties();
    }
}

// Create global instance
window.VisualEffects = new VisualEffects();
