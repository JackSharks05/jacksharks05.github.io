// Galaxy Configuration
const config = {
    starCount: 800,
    starSpeed: 0.02,
    twinkleSpeed: 0.005,
    parallaxLayers: 3,
    constellationColor: '#4a9eff',
    constellationHoverColor: '#ffffff',
    lineWidth: 1.5
};

// Global variables
let canvas, ctx;
let stars = [];
let constellations = [];
let userLocation = null;
let currentTime = new Date();
let hoveredConstellation = null;
let activeSection = null;

// Star class
class Star {
    constructor(layer) {
        this.layer = layer;
        this.reset();
        this.y = Math.random() * canvas.height; // Random initial Y position
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.z = Math.random() * this.layer;
        this.size = (Math.random() * 1.5 + 0.5) * (this.layer / config.parallaxLayers);
        this.brightness = Math.random();
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.speed = config.starSpeed * (this.layer / config.parallaxLayers);
    }
    
    update() {
        // Slow vertical drift
        this.y += this.speed;
        
        // Slight horizontal drift
        this.x += Math.sin(this.y * 0.01) * 0.1;
        
        // Twinkling effect
        this.twinkleOffset += config.twinkleSpeed;
        this.brightness = 0.5 + Math.sin(this.twinkleOffset) * 0.5;
        
        // Reset if off screen
        if (this.y > canvas.height + 10) {
            this.x = Math.random() * canvas.width;
            this.y = -10;
        }
        if (this.x < -10 || this.x > canvas.width + 10) {
            this.x = Math.random() * canvas.width;
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness * 0.8})`;
        ctx.fill();
        
        // Add glow for brighter stars
        if (this.brightness > 0.7 && this.size > 1) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness * 0.1})`;
            ctx.fill();
        }
    }
}

// Constellation definitions with real star positions (simplified)
// These will be adjusted based on user location and time
const constellationData = {
    ursaMajor: {
        name: 'Ursa Major',
        section: 'about',
        stars: [
            { x: 0.25, y: 0.3 },
            { x: 0.28, y: 0.32 },
            { x: 0.32, y: 0.32 },
            { x: 0.35, y: 0.30 },
            { x: 0.32, y: 0.27 },
            { x: 0.28, y: 0.27 },
            { x: 0.25, y: 0.28 }
        ],
        connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0]]
    },
    orion: {
        name: 'Orion',
        section: 'projects',
        stars: [
            { x: 0.50, y: 0.25 },
            { x: 0.47, y: 0.30 },
            { x: 0.53, y: 0.30 },
            { x: 0.48, y: 0.38 },
            { x: 0.50, y: 0.40 },
            { x: 0.52, y: 0.38 },
            { x: 0.47, y: 0.50 },
            { x: 0.53, y: 0.50 }
        ],
        connections: [[0,1], [0,2], [1,3], [2,5], [3,4], [4,5], [3,6], [5,7]]
    },
    cassiopeia: {
        name: 'Cassiopeia',
        section: 'research',
        stars: [
            { x: 0.70, y: 0.35 },
            { x: 0.73, y: 0.32 },
            { x: 0.76, y: 0.35 },
            { x: 0.79, y: 0.32 },
            { x: 0.82, y: 0.35 }
        ],
        connections: [[0,1], [1,2], [2,3], [3,4]]
    },
    lyra: {
        name: 'Lyra',
        section: 'music',
        stars: [
            { x: 0.65, y: 0.60 },
            { x: 0.63, y: 0.65 },
            { x: 0.67, y: 0.65 },
            { x: 0.65, y: 0.70 },
            { x: 0.68, y: 0.62 }
        ],
        connections: [[0,1], [0,2], [1,3], [2,3], [0,4]]
    },
    aquila: {
        name: 'Aquila',
        section: 'thoughts',
        stars: [
            { x: 0.35, y: 0.60 },
            { x: 0.37, y: 0.65 },
            { x: 0.35, y: 0.70 },
            { x: 0.33, y: 0.65 },
            { x: 0.37, y: 0.58 }
        ],
        connections: [[0,1], [1,2], [0,3], [3,1], [0,4]]
    },
    gemini: {
        name: 'Gemini',
        section: 'experience',
        stars: [
            { x: 0.15, y: 0.55 },
            { x: 0.15, y: 0.65 },
            { x: 0.15, y: 0.75 },
            { x: 0.20, y: 0.55 },
            { x: 0.20, y: 0.65 },
            { x: 0.20, y: 0.75 }
        ],
        connections: [[0,1], [1,2], [3,4], [4,5], [0,3], [2,5]]
    }
};

// Initialize
function init() {
    canvas = document.getElementById('galaxyCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars with different parallax layers
    for (let i = 0; i < config.starCount; i++) {
        const layer = Math.floor(Math.random() * config.parallaxLayers) + 1;
        stars.push(new Star(layer));
    }
    
    // Get user location and setup constellations
    getUserLocation();
    
    // Setup event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    // Start animation
    animate();
    
    // Hide loading screen after initialization
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('fade-out');
    }, 1500);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Rebuild constellations on resize
    buildConstellations();
}

function getUserLocation() {
    // Try to get user's location via IP geolocation API
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            userLocation = {
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city
            };
            console.log('User location:', userLocation);
            buildConstellations();
        })
        .catch(error => {
            console.log('Could not get location, using default');
            // Default location (Greenwich)
            userLocation = {
                latitude: 51.4779,
                longitude: 0,
                city: 'Default'
            };
            buildConstellations();
        });
}

function buildConstellations() {
    constellations = [];
    
    for (let key in constellationData) {
        const data = constellationData[key];
        const constellation = {
            name: data.name,
            section: data.section,
            stars: data.stars.map(star => ({
                x: star.x * canvas.width,
                y: star.y * canvas.height,
                size: 3
            })),
            connections: data.connections,
            bounds: null
        };
        
        // Calculate bounding box
        const xs = constellation.stars.map(s => s.x);
        const ys = constellation.stars.map(s => s.y);
        constellation.bounds = {
            minX: Math.min(...xs) - 30,
            maxX: Math.max(...xs) + 30,
            minY: Math.min(...ys) - 30,
            maxY: Math.max(...ys) + 30
        };
        
        constellations.push(constellation);
    }
}

function drawConstellations() {
    constellations.forEach(constellation => {
        const isHovered = hoveredConstellation === constellation;
        const alpha = isHovered ? 1.0 : 0.3;
        const starSize = isHovered ? 4 : 3;
        const color = isHovered ? config.constellationHoverColor : config.constellationColor;
        
        // Draw constellation stars
        constellation.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, starSize, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            // Add glow when hovered
            if (isHovered) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, starSize * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
                ctx.fill();
            }
        });
        
        // Draw connections
        if (isHovered || alpha > 0.2) {
            ctx.strokeStyle = `rgba(${isHovered ? '255,255,255' : '74,158,255'}, ${alpha})`;
            ctx.lineWidth = isHovered ? config.lineWidth * 1.5 : config.lineWidth;
            
            constellation.connections.forEach(([start, end]) => {
                const startStar = constellation.stars[start];
                const endStar = constellation.stars[end];
                
                ctx.beginPath();
                ctx.moveTo(startStar.x, startStar.y);
                ctx.lineTo(endStar.x, endStar.y);
                ctx.stroke();
            });
        }
    });
}

function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    let foundConstellation = null;
    
    // Check if mouse is over any constellation
    for (let constellation of constellations) {
        if (isPointInConstellation(mouseX, mouseY, constellation)) {
            foundConstellation = constellation;
            break;
        }
    }
    
    if (foundConstellation !== hoveredConstellation) {
        hoveredConstellation = foundConstellation;
        canvas.style.cursor = foundConstellation ? 'pointer' : 'crosshair';
        
        // Update tooltip
        const tooltip = document.getElementById('constellationTooltip');
        if (foundConstellation) {
            tooltip.querySelector('.tooltip-name').textContent = foundConstellation.name;
            tooltip.style.left = event.clientX + 'px';
            tooltip.style.top = event.clientY + 'px';
            tooltip.classList.remove('hidden');
        } else {
            tooltip.classList.add('hidden');
        }
    } else if (foundConstellation) {
        // Update tooltip position
        const tooltip = document.getElementById('constellationTooltip');
        tooltip.style.left = event.clientX + 'px';
        tooltip.style.top = event.clientY + 'px';
    }
}

function isPointInConstellation(x, y, constellation) {
    // Check if point is within bounding box
    if (x < constellation.bounds.minX || x > constellation.bounds.maxX ||
        y < constellation.bounds.minY || y > constellation.bounds.maxY) {
        return false;
    }
    
    // Check if point is near any star
    for (let star of constellation.stars) {
        const distance = Math.sqrt(Math.pow(x - star.x, 2) + Math.pow(y - star.y, 2));
        if (distance < 20) {
            return true;
        }
    }
    
    return false;
}

function handleClick() {
    if (hoveredConstellation && !activeSection) {
        openSection(hoveredConstellation.section);
    }
}

function openSection(sectionId) {
    activeSection = sectionId;
    const contentContainer = document.getElementById('contentContainer');
    const section = document.getElementById(sectionId);
    
    contentContainer.classList.remove('hidden');
    setTimeout(() => {
        section.classList.add('active');
    }, 50);
    
    // Hide tooltip
    document.getElementById('constellationTooltip').classList.add('hidden');
}

function closeSection() {
    if (activeSection) {
        const section = document.getElementById(activeSection);
        section.classList.remove('active');
        
        setTimeout(() => {
            document.getElementById('contentContainer').classList.add('hidden');
            activeSection = null;
        }, 500);
    }
}

// Animation loop
function animate() {
    // Clear canvas with subtle trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw stars
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    // Draw constellations
    drawConstellations();
    
    requestAnimationFrame(animate);
}

// Start when page loads
window.addEventListener('load', init);

// Make closeSection available globally
window.closeSection = closeSection;
