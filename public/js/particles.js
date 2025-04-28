import * as THREE from 'three';

// Create star particles
function createStarParticles(scene, count = 5000, radius = 1500) {
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
        // Position stars randomly within a sphere
        const i3 = i * 3;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = radius * Math.sqrt(Math.random());
        
        positions[i3] = r * Math.sin(theta) * Math.cos(phi);
        positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        positions[i3 + 2] = r * Math.cos(theta);
        
        // Set random star sizes
        sizes[i] = Math.random() * 3 + 0.5;
        
        // Set star colors (mostly white with subtle variations)
        color.setHSL(Math.random() * 0.1 + 0.6, 0.2, Math.random() * 0.2 + 0.8);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        sizeAttenuation: true,
        opacity: 0.8
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    return particleSystem;
}

// Create background sphere
function createBackgroundSphere(scene, radius = 1400) {
    const backgroundGeometry = new THREE.SphereGeometry(radius, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load('/assets/space-bg.webp');
    
    const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.8
    });
    
    const backgroundSphere = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    scene.add(backgroundSphere);
    
    return backgroundSphere;
}

// Create sparkles (smaller, brighter stars)
function createSparkles(scene, count = 500, radius = 1200) {
    const sparkleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = radius * Math.cbrt(Math.random());
        
        positions[i3] = r * Math.sin(theta) * Math.cos(phi);
        positions[i3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        positions[i3 + 2] = r * Math.cos(theta);
        
        // Vary sizes for sparkles
        sizes[i] = Math.random() * 2 + 0.5;
        
        // Set sparkle colors (brighter, more saturated)
        color.setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.9);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sparkleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    sparkleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Custom shader material for sparkles
    const sparkleVertexShader = `
        attribute float size;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;
    
    const sparkleFragmentShader = `
        varying vec3 vColor;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            gl_FragColor = vec4(vColor, 1.0 - (dist * 1.5));
        }
    `;
    
    const sparkleMaterial = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: sparkleVertexShader,
        fragmentShader: sparkleFragmentShader,
        transparent: true,
        vertexColors: true
    });
    
    const sparkleSystem = new THREE.Points(sparkleGeometry, sparkleMaterial);
    scene.add(sparkleSystem);
    
    return sparkleSystem;
}

// Create pulsing stars
function createPulsingStars(scene, count = 200, radius = 1000) {
    const starGroup = new THREE.Group();
    const pulseSpeeds = [];
    const starMeshes = [];
    
    const starGeometry = new THREE.SphereGeometry(1, 8, 8);
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load('/assets/star-glow.png');
    
    for (let i = 0; i < count; i++) {
        // Random position in sphere
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = radius * Math.random();
        
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        
        // Create star with glow
        const starMaterial = new THREE.SpriteMaterial({
            map: starTexture,
            color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.8),
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const star = new THREE.Sprite(starMaterial);
        star.position.set(x, y, z);
        
        // Random initial scale
        const scale = Math.random() * 5 + 3;
        star.scale.set(scale, scale, 1);
        
        // Store pulse rate
        pulseSpeeds.push(Math.random() * 0.03 + 0.01);
        starMeshes.push(star);
        
        starGroup.add(star);
    }
    
    scene.add(starGroup);
    
    // Animate pulsing stars
    function animatePulsingStars() {
        for (let i = 0; i < starMeshes.length; i++) {
            const scale = starMeshes[i].scale.x;
            const pulseSpeed = pulseSpeeds[i];
            
            // Pulse effect
            starMeshes[i].scale.x = scale * (1 + Math.sin(Date.now() * pulseSpeed) * 0.1);
            starMeshes[i].scale.y = starMeshes[i].scale.x;
        }
    }
    
    return {
        group: starGroup,
        animate: animatePulsingStars
    };
}

export {
    createStarParticles,
    createBackgroundSphere,
    createSparkles,
    createPulsingStars
}; 