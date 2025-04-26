/**
 * Space Theme Page Transitions
 * Handles the animated transitions between pages
 */

document.addEventListener('DOMContentLoaded', () => {
    initTransitions();
    fixIconPaths();
});

/**
 * Initialize the page transitions
 */
function initTransitions() {
    // Get elements
    const rocketContainer = document.getElementById('rocket-social');
    const galaxyContainer = document.getElementById('galaxy-worlds');
    const rocketTransition = document.getElementById('rocket-transition');
    const galaxyTransition = document.getElementById('galaxy-transition');
    const rocketFlame = document.querySelector('#rocket-transition .rocket-flame');
    const backToHomeLink = document.getElementById('back-to-home');
    
    // Set up rocket transition
    if (rocketContainer) {
        rocketContainer.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Disable pointer events during transition
            document.body.style.pointerEvents = 'none';
            
            // Start tracking mouse position for flame center
            const rocket = rocketContainer.querySelector('.rocket');
            const rocketRect = rocket.getBoundingClientRect();
            
            // Position the flame at the bottom center of the rocket
            rocketFlame.style.left = (rocketRect.left + rocketRect.width / 2) + 'px';
            rocketFlame.style.top = (rocketRect.top + rocketRect.height) + 'px';
            
            // Make transition visible
            rocketTransition.style.opacity = '1';
            rocketTransition.style.visibility = 'visible';
            
            // Add animation classes to elements
            rocketContainer.classList.add('transition-active');
            rocketContainer.classList.add('rocket-animate');
            
            // Set transition source for incoming page
            setOutgoingTransition('rocket-fullscreen');
            
            // Create fullscreen flame overlay that will take over the whole screen
            const flameOverlay = document.createElement('div');
            flameOverlay.className = 'flame-overlay';
            flameOverlay.style.position = 'fixed';
            flameOverlay.style.top = '0';
            flameOverlay.style.left = '0';
            flameOverlay.style.width = '100%';
            flameOverlay.style.height = '100%';
            flameOverlay.style.background = 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,200,100,0.95) 10%, rgba(255,120,50,0.9) 20%, rgba(255,80,30,0.85) 40%, rgba(200,50,10,0.8) 60%, rgba(150,30,10,0.7) 100%)';
            flameOverlay.style.opacity = '0';
            flameOverlay.style.zIndex = '9999';
            flameOverlay.style.pointerEvents = 'none';
            flameOverlay.style.transition = 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
            document.body.appendChild(flameOverlay);
            
            // Grow the flame after a short delay - slower timing for more dramatic effect
            setTimeout(() => {
                rocketFlame.classList.add('rocket-flame-grow');
                
                // After flame starts growing, start fading in the overlay more slowly
                setTimeout(() => {
                    flameOverlay.style.opacity = '1';
                    
                    // When overlay is fully visible, navigate immediately - with longer delay
                    setTimeout(() => {
                        window.location.href = 'social.html';
                    }, 1200); // Increased time for slower transition
                }, 800); // More delay before overlay fades in
            }, 600);
        });
    }
    
    // Set up galaxy transition
    if (galaxyContainer) {
        galaxyContainer.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Disable pointer events during transition
            document.body.style.pointerEvents = 'none';
            
            // Make transition visible
            galaxyTransition.style.opacity = '1';
            galaxyTransition.style.visibility = 'visible';
            
            // Add animation classes to elements
            galaxyContainer.classList.add('transition-active');
            galaxyContainer.classList.add('galaxy-animate');
            
            // Set transition source for incoming page
            setOutgoingTransition('galaxy');
            
            // Expand the galaxy background after delay
            setTimeout(() => {
                galaxyTransition.style.transform = 'scale(1)';
                galaxyTransition.style.opacity = '1';
                
                // Navigate to worlds page after animation completes
                setTimeout(() => {
                    window.location.href = 'worlds.html';
                }, 1400); // Increased time for smoother transition
            }, 500);
        });
    }
    
    // Set up back to home transitions
    if (backToHomeLink) {
        backToHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Disable pointer events during transition
            document.body.style.pointerEvents = 'none';
            
            // Fade out the current page
            const content = document.querySelector('.scene-container');
            content.style.opacity = '0';
            content.style.transition = 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
            
            // Navigate back to home after fade out
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 700);
        });
    }
}

/**
 * Handle incoming page transitions (when arriving at a page)
 */
function handleIncomingTransition() {
    // Check if we're coming from another page
    const transitionSource = sessionStorage.getItem('transitionSource');
    
    if (transitionSource) {
        // Clear transition source
        sessionStorage.removeItem('transitionSource');
        
        // Add incoming transition effects based on source
        if (transitionSource === 'rocket' || transitionSource === 'rocket-fullscreen') {
            // Add rocket incoming transition
            const content = document.querySelector('.scene-container');
            
            if (transitionSource === 'rocket-fullscreen') {
                // Create flame-out effect
                const flameOverlay = document.createElement('div');
                flameOverlay.className = 'flame-overlay';
                flameOverlay.style.position = 'fixed';
                flameOverlay.style.top = '0';
                flameOverlay.style.left = '0';
                flameOverlay.style.width = '100%';
                flameOverlay.style.height = '100%';
                flameOverlay.style.background = 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,200,100,0.95) 10%, rgba(255,120,50,0.9) 20%, rgba(255,80,30,0.85) 40%, rgba(200,50,10,0.8) 60%, rgba(150,30,10,0.7) 100%)';
                flameOverlay.style.opacity = '1';
                flameOverlay.style.zIndex = '9999';
                flameOverlay.style.pointerEvents = 'none';
                flameOverlay.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)'; // Faster fade-out
                document.body.appendChild(flameOverlay);
                
                // Make page content visible immediately but behind the overlay
                content.style.opacity = '1';
                
                // Fade out flame overlay - faster fade out
                setTimeout(() => {
                    flameOverlay.style.opacity = '0';
                    
                    // Remove overlay once animation is done - quicker removal
                    setTimeout(() => {
                        flameOverlay.remove();
                    }, 600); // Faster removal time
                }, 100);
            } else {
                // Original transition
                content.style.opacity = '0';
                content.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1)';
                
                setTimeout(() => {
                    content.style.opacity = '1';
                }, 100);
            }
        } else if (transitionSource === 'galaxy') {
            // Add galaxy incoming transition
            const content = document.querySelector('.scene-container');
            content.style.opacity = '0';
            content.style.transform = 'scale(1.5)';
            content.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            
            setTimeout(() => {
                content.style.opacity = '1';
                content.style.transform = 'scale(1)';
            }, 100);
        }
    }
}

/**
 * Fix icon paths if needed - sometimes SVG paths need correction
 */
function fixIconPaths() {
    // Check if we're on the social page
    if (document.querySelector('.social-links')) {
        // Get all social icon images
        const socialIcons = document.querySelectorAll('.social-link img');
        
        // For each icon, ensure it displays correctly
        socialIcons.forEach(icon => {
            // Force a reload of the image
            const currentSrc = icon.getAttribute('src');
            if (currentSrc) {
                // Add a cache-busting parameter
                if (currentSrc.indexOf('?') === -1) {
                    icon.setAttribute('src', currentSrc + '?v=' + new Date().getTime());
                }
                
                // Make sure image is visible
                icon.style.display = 'block';
                icon.style.width = '40px';
                icon.style.height = '40px';
            }
        });
    }
}

// Set up outgoing transition markers
function setOutgoingTransition(source) {
    sessionStorage.setItem('transitionSource', source);
}

// Initialize incoming transitions
handleIncomingTransition(); 