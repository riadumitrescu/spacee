import * as THREE from 'three';

// Initialize planet interactions
document.addEventListener('DOMContentLoaded', () => {
    const planetWrappers = document.querySelectorAll('.planet-wrapper');
    
    planetWrappers.forEach(wrapper => {
        // Add click event
        wrapper.addEventListener('click', () => {
            // Add 'clicked' class to show tooltip
            wrapper.classList.add('clicked');
            
            // Remove class after 3 seconds
            setTimeout(() => {
                wrapper.classList.remove('clicked');
            }, 3000);
            
            // Add extra rotation animation
            const planet = wrapper.querySelector('.planet');
            planet.style.transform = 'rotate(360deg) scale(1.1)';
            
            // Reset animation after completion
            setTimeout(() => {
                planet.style.transform = '';
            }, 1000);
        });
    });
    
    // Add 3D floating effect for planets
    setupPlanet3DEffect();
});

// Setup 3D floating effect for planets
function setupPlanet3DEffect() {
    // Create a smaller Three.js scene for planets
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('three-container').appendChild(renderer.domElement);
    
    camera.position.z = 5;
    
    // Create planets in 3D space
    const planets = [];
    const planetData = [
        { id: 'creativity', color: 0xff5588, position: new THREE.Vector3(-4, 1, 0) },
        { id: 'adventure', color: 0x44aaff, position: new THREE.Vector3(0, 0, 0) },
        { id: 'knowledge', color: 0xaaff44, position: new THREE.Vector3(4, -1, 0) }
    ];
    
    planetData.forEach(data => {
        const geometry = new THREE.IcosahedronGeometry(0.8, 3);
        const material = new THREE.MeshPhongMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.5,
            shininess: 100
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.copy(data.position);
        scene.add(planet);
        planets.push({ mesh: planet, id: data.id });
    });
    
    // Add ambient and point lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create star field
    createStarField(scene);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        planets.forEach(planet => {
            planet.mesh.rotation.x += 0.005;
            planet.mesh.rotation.y += 0.01;
            
            // Add floating motion
            const time = Date.now() * 0.001;
            planet.mesh.position.y = planet.mesh.position.y + Math.sin(time) * 0.003;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Create star field
function createStarField(scene) {
    const starCount = 500;
    const stars = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
    }
    
    stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1
    });
    
    const starPoints = new THREE.Points(stars, starMaterial);
    scene.add(starPoints);
    
    // Add rotation animation
    function animateStars() {
        starPoints.rotation.y += 0.0001;
        starPoints.rotation.x += 0.00005;
        
        requestAnimationFrame(animateStars);
    }
    
    animateStars();
} 