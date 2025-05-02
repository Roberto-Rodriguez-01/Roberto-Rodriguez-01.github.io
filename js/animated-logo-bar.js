document.addEventListener('DOMContentLoaded', function() {
    const animatedBar = document.getElementById('animated-logo-bar');
    const progressBar = document.getElementById('animated-logo-bar-progress');
    
    // Function to show the animated bar
    function showAnimatedBar(event) {
        // Prevent default behavior for links
        if (event.target.tagName === 'A' || event.target.closest('a')) {
            event.preventDefault();
            const link = event.target.tagName === 'A' ? event.target : event.target.closest('a');
            
            // Reset and show the progress bar
            progressBar.style.width = '0%';
            animatedBar.style.display = 'block';

            // Simulate loading progress with faster animation
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        animatedBar.style.display = 'none';
                        window.location.href = link.href;
                    }, 200);
                }
            }, 30);
        } else if (event.target.tagName === 'BUTTON') {
            // Reset and show the progress bar
            progressBar.style.width = '0%';
            animatedBar.style.display = 'block';

            // Simulate loading progress with faster animation
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        animatedBar.style.display = 'none';
                    }, 200);
                }
            }, 30);
        }
    }

    // Add click event listeners to all buttons and links
    document.querySelectorAll('a, button').forEach(element => {
        // Skip if it's a button with type="submit" or if it's a link to an external site
        if ((element.tagName === 'BUTTON' && element.type === 'submit') || 
            (element.tagName === 'A' && element.href && !element.href.includes(window.location.hostname))) {
            return;
        }
        
        element.addEventListener('click', showAnimatedBar);
    });
}); 