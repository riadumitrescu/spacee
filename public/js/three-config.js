import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Global Three.js variables
let scene, camera, renderer, controls;

// Initialize the Three.js scene
function initThree(containerId) {
    // Create scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const threeContainer = document.getElementById(containerId);
    threeContainer.appendChild(renderer.domElement);
    
    // Set camera position
    camera.position.z = 1000;
    
    // Create orbit controls with limitations
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 700;
    controls.maxDistance = 1300;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI * 0.65;
    controls.minPolarAngle = Math.PI * 0.35;
    
    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    
    // Setup cursor behavior
    threeContainer.style.cursor = 'grab';
    threeContainer.addEventListener('mousedown', () => {
        threeContainer.style.cursor = 'grabbing';
        document.body.classList.add('dragging');
    });
    
    document.addEventListener('mouseup', () => {
        threeContainer.style.cursor = 'grab';
        document.body.classList.remove('dragging');
    });
    
    return {
        scene,
        camera,
        renderer,
        controls
    };
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Generic animation loop
function createAnimationLoop(callback) {
    function animate() {
        requestAnimationFrame(animate);
        
        // Update controls
        if (controls) {
            controls.update();
        }
        
        // Run custom animation callback if provided
        if (callback && typeof callback === 'function') {
            callback();
        }
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    return animate;
}

// Add basic lighting to the scene
function addBasicLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x8844ff, 1, 1000);
    pointLight.position.set(0, 0, 200);
    scene.add(pointLight);
}

// Helper to create a texture loader
function createTextureLoader() {
    return new THREE.TextureLoader();
}

// Export Three.js functionality
export {
    initThree,
    createAnimationLoop,
    addBasicLighting,
    createTextureLoader
}; 