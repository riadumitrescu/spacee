import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global variables
let scene, camera, renderer, controls;
let starParticles, backgroundSphere, sparkles, pulsingStars;
let mouseX = 0, mouseY = 0;

// Initialize the Three.js scene
function init() {
    // Create scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('three-container').appendChild(renderer.domElement);
    
    // Set camera position
    camera.position.z = 1000;
    
    // Create orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.1;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 1500;
    controls.enablePan = false;
    
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
    
    // Start animation loop
    animate();
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
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update cat cursor position and rotation
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        cursor.style.left = event.clientX + 'px';
        cursor.style.top = event.clientY + 'px';
        
        // Slightly rotate cursor based on mouse movement
        const rotateX = mouseY * 15;
        const rotateY = mouseX * -15;
        cursor.style.transform = `rotate(${rotateY}deg)`;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate star particles with different speeds for parallax effect
    if (starParticles) {
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
    
    // Update controls
    controls.update();
    
    // Slightly move camera based on mouse position
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.01;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.01;
    camera.lookAt(scene.position);
    
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
        
        rocketContainer.addEventListener('click', () => {
            rocketContainer.style.transform = 'translate(200%, -50%) scale(0.5)';
            setTimeout(() => {
                window.location.href = 'social.html';
            }, 1000);
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
        
        galaxyContainer.addEventListener('click', () => {
            camera.position.z = 2000;
            setTimeout(() => {
                window.location.href = 'worlds.html';
            }, 1000);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initInteractiveElements();
    
    // Ensure cat cursor is visible
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        cursor.style.display = 'block';
        cursor.style.zIndex = '9999';
    }
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        document.getElementById('custom-cursor').style.display = 'none';
    });
    
    document.addEventListener('mouseenter', () => {
        document.getElementById('custom-cursor').style.display = 'block';
    });
}); 