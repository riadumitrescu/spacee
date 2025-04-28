import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global variables
let scene, camera, renderer, controls;
let starParticles, backgroundSphere, sparkles, pulsingStars;
let mouseX = 0, mouseY = 0;
let isDragging = false;

// Initialize the Three.js scene
function init() {
    // Create scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    const threeContainer = document.getElementById('three-container');
    threeContainer.appendChild(renderer.domElement);
    
    // Set camera position
    camera.position.z = 1000;
    
    // Set custom cursor for the scene
    renderer.domElement.style.cursor = `url('images/cat_cursor.svg'), auto`;
    
    // Create orbit controls with limitations
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 50;
    controls.maxDistance = 150;
    controls.maxPolarAngle = Math.PI;
    controls.rotateSpeed = 0.5;
    
    // Debug controls status
    console.log("OrbitControls initialized:", controls);
    
    // Add custom cursor change when grabbing/rotating
    controls.addEventListener('start', function() {
        renderer.domElement.style.cursor = `url('images/cat_paw_grabbing.svg'), grabbing`;
    });
    
    controls.addEventListener('end', function() {
        renderer.domElement.style.cursor = `url('images/cat_cursor.svg'), auto`;
    });
    
    // Create background elements
    createBackgroundSphere();
    createPointParticles();
    createPointComet();
    createSparkles();
    createPulsingStars();
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x8844ff, 1, 1000);
    pointLight.position.set(0, 0, 200);
    scene.add(pointLight);
    
    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    
    // Add custom cursor when hovering over the background
    threeContainer.style.cursor = 'none';
    threeContainer.addEventListener('mousedown', () => {
        threeContainer.style.cursor = 'none';
        document.body.classList.add('dragging');
        isDragging = true;
        
        // Update to astronaut glove grabbing cursor
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            cursor.style.backgroundImage = "url('public/images/glove_grab-Photoroom.png')";
            // Scale effect gives impression of hand grabbing
            cursor.style.transform = `rotate(${mouseX * 5}deg) scale(0.9)`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        threeContainer.style.cursor = 'none';
        document.body.classList.remove('dragging');
        isDragging = false;
        
        // Reset to default astronaut glove cursor
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            cursor.style.backgroundImage = "url('public/images/glove_open-Photoroom.png')";
            cursor.style.transform = `rotate(${mouseX * 5}deg)`;
        }
    });
    
    // Add initial interactive tutorial
    showInteractionTutorial();
    
    // Ensure clicks on foreground don't affect background
    setupInteractiveElements();
    
    // Start animation loop
    animate();
}

// Setup interactive elements and prevent event propagation
function setupInteractiveElements() {
    const foregroundElements = document.querySelector('.foreground-elements');
    
    // Make sure interactive elements prevent events from reaching Three.js canvas
    const interactiveSelectors = [
        '.rocket-container', 
        '.galaxy-container',
        '.welcome-text',
        '.social-icon',
        '.back-link'
    ];
    
    if (foregroundElements) {
        // Prevent mouse events on entire foreground container from reaching Three.js
        foregroundElements.addEventListener('mousedown', (e) => {
            // Check if the target is a non-interactive element
            if (e.target === foregroundElements) {
                e.stopPropagation();
            }
        });
        
        // Setup event prevention for each interactive element
        interactiveSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.addEventListener('mousedown', (e) => {
                    e.stopPropagation(); // Prevent the event from reaching the Three.js canvas
                });
            });
        });
    }
    
    // Setup navigation for rocket and galaxy
    setupPageLinks();
}

// Setup page navigation links
function setupPageLinks() {
    const rocketContainer = document.getElementById('rocket-social');
    const galaxyContainer = document.getElementById('galaxy-worlds');
    
    if (rocketContainer) {
        rocketContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'social.html';
        });
    }
    
    if (galaxyContainer) {
        galaxyContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'worlds.html';
        });
    }
}

// Create background sphere
function createBackgroundSphere() {
    const geometry = new THREE.SphereGeometry(800, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.8
    });
    
    backgroundSphere = new THREE.Mesh(geometry, material);
    scene.add(backgroundSphere);
}

// Create star particles
function createPointParticles() {
    const particleCount = 1500;  // Increased particle count
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    // Generate different color themes for stars
    const colorOptions = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xccffff), // Light blue
        new THREE.Color(0xffccff), // Light pink
        new THREE.Color(0xffffcc), // Light yellow
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;
        
        sizes[i] = Math.random() * 4;
        
        // Assign random colors from the options
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('public/images/p1.svg');
    
    const material = new THREE.PointsMaterial({
        size: 10,
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);
}

// Create sparkles - small twinkling stars
function createSparkles() {
    const sparkleCount = 200;
    const positions = new Float32Array(sparkleCount * 3);
    const scales = new Float32Array(sparkleCount);
    
    for (let i = 0; i < sparkleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 1500;
        positions[i3 + 1] = (Math.random() - 0.5) * 1500;
        positions[i3 + 2] = (Math.random() - 0.5) * 1500;
        
        scales[i] = Math.random();
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    
    const textureLoader = new THREE.TextureLoader();
    const sparkleTexture = textureLoader.load('public/images/p7.svg');
    
    const material = new THREE.PointsMaterial({
        size: 15,
        map: sparkleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xaaddff
    });
    
    sparkles = new THREE.Points(geometry, material);
    scene.add(sparkles);
}

// Create pulsing stars - larger glowing elements
function createPulsingStars() {
    const starCount = 20;
    const stars = [];
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load('public/images/p2.svg');
    
    for (let i = 0; i < starCount; i++) {
        const size = Math.random() * 30 + 20;
        const material = new THREE.SpriteMaterial({
            map: starTexture,
            color: new THREE.Color(0xffffff).setHSL(Math.random(), 0.2, 0.8),
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const star = new THREE.Sprite(material);
        
        // Position randomly
        star.position.x = (Math.random() - 0.5) * 1500;
        star.position.y = (Math.random() - 0.5) * 1500;
        star.position.z = (Math.random() - 0.5) * 1500;
        
        star.scale.set(size, size, 1);
        star.userData = {
            originalSize: size,
            pulseSpeed: Math.random() * 0.04 + 0.01,
            pulseOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(star);
        stars.push(star);
    }
    
    pulsingStars = stars;
}

// Create comet
function createPointComet() {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorStart = new THREE.Color(0x44aaff);
    const colorEnd = new THREE.Color(0x8844ff);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ratio = i / particleCount;
        
        positions[i3] = -500 + (i * 3);
        positions[i3 + 1] = 300;
        positions[i3 + 2] = -100;
        
        const color = new THREE.Color().lerpColors(colorStart, colorEnd, ratio);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('public/images/p2.svg');
    
    const material = new THREE.PointsMaterial({
        size: 15,
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const comet = new THREE.Points(geometry, material);
    scene.add(comet);
    
    // Animate the comet
    let cometPosition = -500;
    setInterval(() => {
        const positions = comet.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = cometPosition + (i * 3);
        }
        comet.geometry.attributes.position.needsUpdate = true;
        
        cometPosition += 10;
        if (cometPosition > 1000) {
            cometPosition = -500;
        }
    }, 50);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
function onMouseMove(event) {
    // Only update mouseX and mouseY for custom cursor movement
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update astronaut hand cursor position with improved precision tracking
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        // Use requestAnimationFrame for smoother tracking
        requestAnimationFrame(() => {
            cursor.style.left = `${event.clientX}px`;
            cursor.style.top = `${event.clientY}px`;
            
            // Subtle rotation based on mouse movement for more dynamic feel
            const rotateZ = mouseX * 5; // Less rotation for the astronaut hand
            cursor.style.transform = `rotate(${rotateZ}deg)`;
        });
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Very subtle auto-rotation of star particles when not being controlled
    if (starParticles && !controls.isActive) {
        starParticles.rotation.y += 0.0001;
        starParticles.rotation.x += 0.00005;
    }
    
    // Animate sparkles - make them twinkle
    if (sparkles) {
        const time = Date.now() * 0.001;
        const scales = sparkles.geometry.attributes.scale;
        
        for (let i = 0; i < scales.count; i++) {
            const twinkleSpeed = 0.3 + (i % 5) * 0.2;
            scales.array[i] = 0.5 + Math.sin(time * twinkleSpeed + i) * 0.5;
        }
        
        scales.needsUpdate = true;
    }
    
    // Animate pulsing stars
    if (pulsingStars) {
        const time = Date.now() * 0.001;
        
        pulsingStars.forEach(star => {
            const { originalSize, pulseSpeed, pulseOffset } = star.userData;
            const size = originalSize * (1 + 0.2 * Math.sin(time * pulseSpeed + pulseOffset));
            star.scale.set(size, size, 1);
        });
    }
    
    // Update controls - this is what makes the OrbitControls work
    if (controls) {
        controls.update();
    }
    
    // Render scene
    renderer.render(scene, camera);
}

// Initialize interactive elements
function initInteractiveElements() {
    const rocketContainer = document.querySelector('.rocket-container');
    const galaxyContainer = document.querySelector('.galaxy-container');
    
    if (rocketContainer) {
        // Add hover effect for social icons - make sure they're visible
        rocketContainer.addEventListener('mouseenter', () => {
            const socialIcons = rocketContainer.querySelector('.social-icons');
            if (socialIcons) {
                socialIcons.style.opacity = '1';
                socialIcons.style.right = '-160px'; // Make sure they're visible
            }
            
            // Add thruster glow effect
            const rocket = rocketContainer.querySelector('.rocket');
            if (rocket) {
                rocket.style.filter = 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.7))';
            }
        });
        
        rocketContainer.addEventListener('mouseleave', () => {
            const socialIcons = rocketContainer.querySelector('.social-icons');
            if (socialIcons) {
                socialIcons.style.opacity = '';
                socialIcons.style.right = '';
            }
            
            // Remove thruster glow effect
            const rocket = rocketContainer.querySelector('.rocket');
            if (rocket) {
                rocket.style.filter = '';
            }
        });
    }
    
    if (galaxyContainer) {
        // Add glow effect on hover
        galaxyContainer.addEventListener('mouseenter', () => {
            const galaxy = galaxyContainer.querySelector('.galaxy');
            if (galaxy) {
                galaxy.style.filter = 'drop-shadow(0 0 15px rgba(138, 43, 226, 0.7))';
                galaxy.style.opacity = '1';
            }
        });
        
        galaxyContainer.addEventListener('mouseleave', () => {
            const galaxy = galaxyContainer.querySelector('.galaxy');
            if (galaxy) {
                galaxy.style.filter = '';
                galaxy.style.opacity = '';
            }
        });
    }
}

// Show an initial tutorial overlay to educate users about the interaction
function showInteractionTutorial() {
    // Only show tutorial if it hasn't been shown before
    if (localStorage.getItem('spaceTutorialShown')) {
        return;
    }
    
    // Only show on index.html page
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath === '/' || 
                         currentPath === '/index.html' || 
                         currentPath.endsWith('/index.html') ||
                         currentPath === '';
    
    // Skip if not on index page
    if (!isIndexPage) {
        return;
    }
    
    // Create tutorial overlay
    const tutorial = document.createElement('div');
    tutorial.className = 'interaction-tutorial';
    tutorial.innerHTML = `
        <div class="tutorial-content">
            <h3>Interactive Space Environment</h3>
            <div class="tutorial-step">
                <div class="tutorial-icon">✋</div>
                <p>Click and drag anywhere to <strong>rotate</strong> the starfield</p>
            </div>
            <div class="tutorial-step">
                <div class="tutorial-icon">🔍</div>
                <p>Use your mouse wheel to <strong>zoom</strong> in and out</p>
            </div>
            <div class="tutorial-step">
                <div class="tutorial-icon">🚀</div>
                <p>Click the rocket or galaxy to navigate</p>
            </div>
            <button id="tutorial-close">Got it!</button>
        </div>
    `;
    document.body.appendChild(tutorial);
    
    // Add click handler to close
    document.getElementById('tutorial-close').addEventListener('click', () => {
        tutorial.classList.add('closing');
        setTimeout(() => {
            if (tutorial.parentNode) {
                tutorial.parentNode.removeChild(tutorial);
            }
            localStorage.setItem('spaceTutorialShown', 'true');
        }, 500);
    });
    
    // Auto-close after 15 seconds
    setTimeout(() => {
        if (tutorial.parentNode && !tutorial.classList.contains('closing')) {
            tutorial.classList.add('closing');
            setTimeout(() => {
                if (tutorial.parentNode) {
                    tutorial.parentNode.removeChild(tutorial);
                }
                localStorage.setItem('spaceTutorialShown', 'true');
            }, 500);
        }
    }, 15000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initInteractiveElements();
    
    // Ensure cat cursor is visible and properly positioned initially
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        cursor.style.display = 'block';
        cursor.style.zIndex = '9999';
        
        // Set initial position to center of screen to avoid flicker
        cursor.style.left = `${window.innerWidth / 2}px`;
        cursor.style.top = `${window.innerHeight / 2}px`;
        
        // Force cursor update on first mouse move
        document.addEventListener('mousemove', function initialMove(e) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            document.removeEventListener('mousemove', initialMove);
        }, { once: true });
    }
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        const cursor = document.getElementById('custom-cursor');
        if (cursor) cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        const cursor = document.getElementById('custom-cursor');
        if (cursor) cursor.style.opacity = '1';
    });
    
    // Only show custom cursor when not interacting with the background
    const threeContainer = document.getElementById('three-container');
    threeContainer.addEventListener('mousedown', () => {
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            // Always keep the grabbing cursor visible during dragging
            cursor.style.opacity = '1';
            cursor.style.backgroundImage = "url('public/images/glove_grab-Photoroom.png')";
            cursor.style.transform = `rotate(${mouseX * 5}deg) scale(0.9)`; // Scale down less for astronaut hand
        }
    });
    
    threeContainer.addEventListener('mouseup', () => {
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            cursor.style.opacity = '1';
            cursor.style.backgroundImage = "url('public/images/glove_open-Photoroom.png')";
            cursor.style.transform = `rotate(${mouseX * 5}deg)`;
        }
    });
    
    // Show initial rotating space message
    showInitialRotateMessage();
});

// Show a brief initial message suggesting to rotate the space
function showInitialRotateMessage() {
    // Check if we're on the index page
    const path = window.location.pathname;
    const isIndexPage = path === '/' || path === '/index.html' || path.endsWith('/index.html') || path === '';
    if (!isIndexPage) return;

    const rotateMessage = document.createElement('div');
    rotateMessage.className = 'initial-rotate-message';
    
    // Text-only version without the image
    rotateMessage.innerHTML = `
        <span class="main-instruction">Try rotating the space!</span>
        <span class="sub-instruction">Grab and drag + scroll to zoom in/out.</span>
    `;
    
    document.body.appendChild(rotateMessage);
    
    setTimeout(() => {
        rotateMessage.classList.add('visible');
    }, 1000);
    
    setTimeout(() => {
        rotateMessage.classList.remove('visible');
        setTimeout(() => {
            document.body.removeChild(rotateMessage);
        }, 1000);
    }, 4000);
} 