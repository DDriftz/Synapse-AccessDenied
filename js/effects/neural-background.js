// SYNAPSE - Neural Background Effects Generator
// Dynamically creates animated neural network background

class NeuralEffects {
    constructor() {
        this.particleContainer = document.getElementById('neural-particles');
        this.synapticContainer = document.getElementById('synaptic-web');
        this.particles = [];
        this.nodes = [];
        this.connections = [];
        this.isActive = true;
        
        this.init();
        console.log('🧠 Neural Effects System initialized');
    }
    
    init() {
        if (!this.particleContainer || !this.synapticContainer) {
            console.warn('Neural effect containers not found');
            return;
        }
        
        this.createParticles();
        this.createNeuralNodes();
        this.createSynapticConnections();
        this.startAnimationLoop();
        
        // Handle reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isActive = false;
        }
    }
    
    createParticles() {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'neural-particle';
            
            // Random starting position
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight + 50;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            // Random animation delay
            particle.style.animationDelay = (Math.random() * 8) + 's';
            
            // Random horizontal drift
            particle.style.setProperty('--drift-x', (Math.random() * 200 - 100) + 'px');
            
            this.particleContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    createNeuralNodes() {
        const nodeCount = 15;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            
            // Random position
            const x = Math.random() * (window.innerWidth - 20);
            const y = Math.random() * (window.innerHeight - 20);
            
            node.style.left = x + 'px';
            node.style.top = y + 'px';
            
            // Random animation delay
            node.style.animationDelay = (Math.random() * 4) + 's';
            
            this.synapticContainer.appendChild(node);
            this.nodes.push({ element: node, x: x, y: y });
        }
    }
    
    createSynapticConnections() {
        const connectionCount = 8;
        
        for (let i = 0; i < connectionCount; i++) {
            // Random start and end points
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            const endX = Math.random() * window.innerWidth;
            const endY = Math.random() * window.innerHeight;
            
            const connection = this.createConnection(startX, startY, endX, endY);
            this.synapticContainer.appendChild(connection);
            this.connections.push(connection);
        }
    }
    
    createConnection(x1, y1, x2, y2) {
        const connection = document.createElement('div');
        connection.className = 'synapse-connection';
        
        // Calculate distance and angle
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        // Position and style the connection
        connection.style.left = x1 + 'px';
        connection.style.top = y1 + 'px';
        connection.style.width = distance + 'px';
        connection.style.transform = `rotate(${angle}deg)`;
        
        // Random animation delay
        connection.style.animationDelay = (Math.random() * 6) + 's';
        
        return connection;
    }
    
    startAnimationLoop() {
        if (!this.isActive) return;
        
        // Periodically create new connections between existing nodes
        setInterval(() => {
            if (this.nodes.length >= 2) {
                const node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                const node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                
                if (node1 !== node2) {
                    const newConnection = this.createConnection(
                        node1.x + 2, node1.y + 2,
                        node2.x + 2, node2.y + 2
                    );
                    
                    this.synapticContainer.appendChild(newConnection);
                    
                    // Remove the connection after animation
                    setTimeout(() => {
                        if (newConnection.parentNode) {
                            newConnection.parentNode.removeChild(newConnection);
                        }
                    }, 6000);
                }
            }
        }, 3000);
    }
    
    // Method to update particle positions on window resize
    handleResize() {
        if (!this.isActive) return;
        
        // Update particle positions
        this.particles.forEach(particle => {
            if (Math.random() > 0.7) { // Only update some particles
                const newX = Math.random() * window.innerWidth;
                particle.style.left = newX + 'px';
            }
        });
        
        // Update node positions
        this.nodes.forEach(nodeData => {
            if (Math.random() > 0.8) { // Only update some nodes
                const newX = Math.random() * (window.innerWidth - 20);
                const newY = Math.random() * (window.innerHeight - 20);
                
                nodeData.element.style.left = newX + 'px';
                nodeData.element.style.top = newY + 'px';
                nodeData.x = newX;
                nodeData.y = newY;
            }
        });
    }
    
    // Method to toggle effects based on performance or user preference
    toggleEffects(enable = true) {
        this.isActive = enable;
        
        if (enable) {
            this.particleContainer.style.display = 'block';
            this.synapticContainer.style.display = 'block';
        } else {
            this.particleContainer.style.display = 'none';
            this.synapticContainer.style.display = 'none';
        }
    }
    
    // Method to adjust effect intensity
    setIntensity(level = 'normal') {
        const intensityLevels = {
            low: { particles: 15, nodes: 8, connections: 4 },
            normal: { particles: 30, nodes: 15, connections: 8 },
            high: { particles: 50, nodes: 25, connections: 12 }
        };
        
        const settings = intensityLevels[level] || intensityLevels.normal;
        
        // Clear existing effects
        this.particleContainer.innerHTML = '';
        this.synapticContainer.innerHTML = '';
        this.particles = [];
        this.nodes = [];
        this.connections = [];
        
        // Recreate with new intensity
        this.createParticles();
        this.createNeuralNodes();
        this.createSynapticConnections();
    }
    
    // Clean up method
    destroy() {
        this.isActive = false;
        
        if (this.particleContainer) {
            this.particleContainer.innerHTML = '';
        }
        
        if (this.synapticContainer) {
            this.synapticContainer.innerHTML = '';
        }
        
        this.particles = [];
        this.nodes = [];
        this.connections = [];
    }
}

// Initialize neural effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const neuralEffects = new NeuralEffects();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            neuralEffects.handleResize();
        }, 250);
    });
    
    // Handle visibility change to pause effects when tab is not active
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            neuralEffects.toggleEffects(false);
        } else {
            neuralEffects.toggleEffects(true);
        }
    });
    
    // Store reference globally for potential access from game engine
    window.neuralEffects = neuralEffects;
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeuralEffects;
}
