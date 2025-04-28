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
            
            // Start tracking position for flame center from the rocket turbine
            const rocket = rocketContainer.querySelector('.rocket');
            const rocketRect = rocket.getBoundingClientRect();
            const rocketFlameContainer = rocketContainer.querySelector('.rocket-flame-container');
            const flameRect = rocketFlameContainer ? rocketFlameContainer.getBoundingClientRect() : null;
            
            // Position the flame precisely at the rocket turbine position
            const flamePosX = flameRect ? (flameRect.left + flameRect.width / 2) : (rocketRect.left + rocketRect.width / 2);
            const flamePosY = flameRect ? (flameRect.top + flameRect.height) : (rocketRect.top + rocketRect.height);
            
            // Create a small initial flame that will grow
            const initialFlame = document.createElement('div');
            initialFlame.className = 'initial-flame';
            initialFlame.style.position = 'fixed';
            initialFlame.style.zIndex = '9998';
            initialFlame.style.left = flamePosX + 'px';
            initialFlame.style.top = flamePosY + 'px';
            initialFlame.style.width = '20px';
            initialFlame.style.height = '30px';
            initialFlame.style.background = 'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,200,100,0.95) 20%, rgba(255,140,50,0.9) 40%, rgba(255,80,0,0.8) 60%, rgba(200,0,0,0.4) 80%, rgba(100,0,0,0.2) 100%)';
            initialFlame.style.borderRadius = '50%';
            initialFlame.style.transform = 'translate(-50%, -50%)';
            initialFlame.style.boxShadow = '0 0 20px 10px rgba(255,100,0,0.5)';
            initialFlame.style.transition = 'width 4s cubic-bezier(0.22, 1, 0.36, 1), height 4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease';
            document.body.appendChild(initialFlame);
            
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
            flameOverlay.style.width = '100vw';
            flameOverlay.style.height = '100vh';
            flameOverlay.style.background = 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,200,100,0.95) 10%, rgba(255,120,50,0.9) 20%, rgba(255,80,30,0.85) 40%, rgba(200,50,10,0.8) 60%, rgba(150,30,10,0.7) 100%)';
            flameOverlay.style.opacity = '0';
            flameOverlay.style.zIndex = '9999';
            flameOverlay.style.pointerEvents = 'none';
            flameOverlay.style.transition = 'opacity 3s cubic-bezier(0.22, 1, 0.36, 1)';
            document.body.appendChild(flameOverlay);
            
            // Start the flame growth sequence
            setTimeout(() => {
                // First grow the small flame from the turbine
                initialFlame.style.width = '300px';
                initialFlame.style.height = '300px';
                
                // After initial growth, start expanding to full screen
                setTimeout(() => {
                    initialFlame.style.width = '1000px';
                    initialFlame.style.height = '1000px';
                    
                    // Start fading in the full overlay as the initial flame grows
                    setTimeout(() => {
                        flameOverlay.style.opacity = '1';
                        
                        // As full overlay becomes visible, fade out the initial flame
                        setTimeout(() => {
                            initialFlame.style.opacity = '0';
                            
                            // When overlay is fully visible, navigate - with longer delay
                            setTimeout(() => {
                                window.location.href = 'social.html';
                            }, 2000);
                        }, 1000);
                    }, 800);
                }, 800);
            }, 400);
        });
    }
    
    // Set up galaxy transition
    if (galaxyContainer) {
        galaxyContainer.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Disable pointer events during transition
            document.body.style.pointerEvents = 'none';
            
            // Get galaxy position to start the effect from
            const galaxy = galaxyContainer.querySelector('.galaxy');
            const galaxyRect = galaxy.getBoundingClientRect();
            const galaxyCenterX = galaxyRect.left + galaxyRect.width / 2;
            const galaxyCenterY = galaxyRect.top + galaxyRect.height / 2;
            
            // Create the initial galaxy circle that will grow
            const initialGalaxy = document.createElement('div');
            initialGalaxy.className = 'initial-galaxy';
            initialGalaxy.style.position = 'fixed';
            initialGalaxy.style.zIndex = '9998';
            initialGalaxy.style.left = galaxyCenterX + 'px';
            initialGalaxy.style.top = galaxyCenterY + 'px';
            initialGalaxy.style.width = '40px';
            initialGalaxy.style.height = '40px';
            initialGalaxy.style.background = 'radial-gradient(circle at center, rgba(130,70,230,0.9) 0%, rgba(100,50,200,0.85) 20%, rgba(70,30,170,0.8) 40%, rgba(50,20,140,0.7) 60%, rgba(40,10,120,0.6) 80%, rgba(30,5,100,0.5) 100%)';
            initialGalaxy.style.borderRadius = '50%';
            initialGalaxy.style.transform = 'translate(-50%, -50%)';
            initialGalaxy.style.boxShadow = '0 0 30px 15px rgba(100,50,200,0.4)';
            initialGalaxy.style.transition = 'width 3s cubic-bezier(0.19, 1, 0.22, 1), height 3s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease';
            document.body.appendChild(initialGalaxy);
            
            // Create a full-screen black hole overlay for final transition
            const blackHoleOverlay = document.createElement('div');
            blackHoleOverlay.style.position = 'fixed';
            blackHoleOverlay.style.top = '0';
            blackHoleOverlay.style.left = '0';
            blackHoleOverlay.style.width = '100vw';
            blackHoleOverlay.style.height = '100vh';
            blackHoleOverlay.style.background = 'radial-gradient(circle at center, rgba(100,50,200,0.9) 0%, rgba(70,30,150,0.85) 20%, rgba(40,10,100,0.8) 40%, rgba(20,5,60,0.7) 70%, rgba(10,2,30,0.6) 100%)';
            blackHoleOverlay.style.opacity = '0';
            blackHoleOverlay.style.zIndex = '9999';
            blackHoleOverlay.style.pointerEvents = 'none';
            blackHoleOverlay.style.transition = 'opacity 2.2s cubic-bezier(0.19, 1, 0.22, 1)';
            document.body.appendChild(blackHoleOverlay);
            
            // Add animation classes to elements
            galaxyContainer.classList.add('transition-active');
            galaxyContainer.classList.add('galaxy-animate');
            
            // Set transition source for incoming page
            setOutgoingTransition('galaxy');
            
            // Start the galaxy growth sequence
            setTimeout(() => {
                // First grow the small galaxy
                initialGalaxy.style.width = '300px';
                initialGalaxy.style.height = '300px';
                
                // After initial growth, expand to mid-size
                setTimeout(() => {
                    initialGalaxy.style.width = '800px';
                    initialGalaxy.style.height = '800px';
                    
                    // Start fading in the full black hole overlay
                    setTimeout(() => {
                        blackHoleOverlay.style.opacity = '1';
                        
                        // As full overlay becomes visible, fade out the initial galaxy
                        setTimeout(() => {
                            initialGalaxy.style.opacity = '0';
                            
                            // Navigate to worlds page after complete transition
                            setTimeout(() => {
                                window.location.href = 'worlds.html';
                            }, 1600);
                        }, 1000);
                    }, 700);
                }, 700);
            }, 300);
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
            content.style.transition = 'opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)';
            
            // Navigate back to home after fade out
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1800);
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
                flameOverlay.style.width = '100vw';
                flameOverlay.style.height = '100vh';
                flameOverlay.style.background = 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,200,100,0.95) 10%, rgba(255,120,50,0.9) 20%, rgba(255,80,30,0.85) 40%, rgba(200,50,10,0.8) 60%, rgba(150,30,10,0.7) 100%)';
                flameOverlay.style.opacity = '1';
                flameOverlay.style.zIndex = '9999';
                flameOverlay.style.pointerEvents = 'none';
                flameOverlay.style.transition = 'opacity 2.5s cubic-bezier(0.22, 1, 0.36, 1)';
                document.body.appendChild(flameOverlay);
                
                // Make page content visible immediately but behind the overlay
                content.style.opacity = '1';
                
                // Fade out flame overlay - slower fade out
                setTimeout(() => {
                    flameOverlay.style.opacity = '0';
                    
                    // Remove overlay once animation is done
                    setTimeout(() => {
                        flameOverlay.remove();
                    }, 2500);
                }, 600);
            } else {
                // Original transition
                content.style.opacity = '0';
                content.style.transition = 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)';
                
                setTimeout(() => {
                    content.style.opacity = '1';
                }, 300);
            }
        } else if (transitionSource === 'galaxy') {
            // Add galaxy incoming transition
            const content = document.querySelector('.scene-container');
            
            // Create a full-screen black hole fade out effect
            const blackHoleOverlay = document.createElement('div');
            blackHoleOverlay.style.position = 'fixed';
            blackHoleOverlay.style.top = '0';
            blackHoleOverlay.style.left = '0';
            blackHoleOverlay.style.width = '100vw';
            blackHoleOverlay.style.height = '100vh';
            blackHoleOverlay.style.background = 'radial-gradient(circle at center, rgba(100,50,200,0.9) 0%, rgba(70,30,150,0.85) 20%, rgba(40,10,100,0.8) 40%, rgba(20,5,60,0.7) 70%, rgba(10,2,30,0.6) 100%)';
            blackHoleOverlay.style.opacity = '1';
            blackHoleOverlay.style.zIndex = '9999';
            blackHoleOverlay.style.pointerEvents = 'none';
            blackHoleOverlay.style.transition = 'opacity 2s cubic-bezier(0.19, 1, 0.22, 1)';
            document.body.appendChild(blackHoleOverlay);
            
            content.style.opacity = '1';
            content.style.transform = 'scale(1.2)';
            content.style.transition = 'transform 2.2s cubic-bezier(0.22, 1, 0.36, 1)';
            
            setTimeout(() => {
                blackHoleOverlay.style.opacity = '0';
                content.style.transform = 'scale(1)';
                
                // Remove overlay once animation is done
                setTimeout(() => {
                    blackHoleOverlay.remove();
                }, 2000);
            }, 500);
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