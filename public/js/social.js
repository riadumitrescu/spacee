// Add floating animation to social links
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach((link, index) => {
        // Add staggered animation delay
        link.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
        
        // Add click effect
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the href
            const href = link.getAttribute('href');
            
            // Add click animation
            link.style.transform = 'scale(1.2)';
            
            // After animation, navigate to the URL
            setTimeout(() => {
                window.open(href, '_blank');
                link.style.transform = '';
            }, 300);
        });
    });
    
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
        });
        
        backButton.addEventListener('mouseleave', () => {
            backButton.style.transform = '';
        });
    }
}); 