// Add floating animation to social links
document.addEventListener('DOMContentLoaded', function() {
    // Force reload SVG icons
    const socialIcons = document.querySelectorAll('.social-link img');
    socialIcons.forEach(icon => {
        const currentSrc = icon.getAttribute('src');
        if (currentSrc) {
            // Add a random parameter to force reload
            icon.setAttribute('src', currentSrc + '?v=' + new Date().getTime());
        }
    });

    // Add hover animations to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const iconWrapper = this.querySelector('.icon-wrapper');
            if (iconWrapper) {
                iconWrapper.style.animation = 'socialPulse 1.5s infinite';
            }
            
            const icon = this.querySelector('img');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 5px white)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const iconWrapper = this.querySelector('.icon-wrapper');
            if (iconWrapper) {
                iconWrapper.style.animation = '';
            }
            
            const icon = this.querySelector('img');
            if (icon) {
                icon.style.transform = '';
                icon.style.filter = 'brightness(0) invert(1)';
            }
        });
    });

    // Ensure back button is visible
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.style.opacity = '1';
        backLink.style.visibility = 'visible';
    }

    // Add initial animation to social links
    socialLinks.forEach((link, index) => {
        // Set initial state
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        // Add delayed appearance
        setTimeout(() => {
            link.style.transition = 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });

    // Add particles to background
    addParticles();
});

function addParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.zIndex = '1';
    particlesContainer.style.pointerEvents = 'none';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random styles for particle
    const size = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    particle.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = Math.random() * 0.6 + 0.4;
    
    // Animation
    particle.style.animation = `twinkle ${duration}s linear ${delay}s infinite`;
    container.appendChild(particle);
    
    // Add keyframes if they don't exist
    if (!document.querySelector('#particle-animation')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particle-animation';
        styleSheet.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; transform: scale(0.5); }
                50% { opacity: 0.8; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// Add rocket animation
const rocket = document.querySelector('.parked-rocket');
if (rocket) {
    // Initial animation
    setTimeout(() => {
        rocket.style.animation = 'float 4s ease-in-out infinite';
    }, 1000);
}

// Add back button effect
const backButton = document.querySelector('.back-link');
if (backButton) {
    backButton.addEventListener('mouseenter', () => {
        backButton.style.transform = 'scale(1.1)';
        backButton.style.boxShadow = '0 0 20px rgba(99, 184, 255, 0.8)';
    });
    
    backButton.addEventListener('mouseleave', () => {
        backButton.style.transform = '';
        backButton.style.boxShadow = '';
    });
} 