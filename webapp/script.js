document.addEventListener("DOMContentLoaded", function() {
    // Add event listeners or any interactive JavaScript functionality here

    // Adding animation for hero section background
    const hero = document.querySelector('.hero');
    const heroOverlay = document.querySelector('.hero-overlay');
    hero.addEventListener('mousemove', (e) => {
        const { offsetX, offsetY } = e;
        const xPos = (offsetX / hero.clientWidth) - 0.5;
        const yPos = (offsetY / hero.clientHeight) - 0.5;

        heroOverlay.style.transform = `translate(${xPos * 10}px, ${yPos * 10}px)`;
    });

    // Testimonial carousel animation
    const carousel = document.querySelector('.testimonial-carousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Google OAuth Sign-In
    document.getElementById('google-signin-btn').addEventListener('click', () => {
        // Redirect to Google OAuth page
        // Replace with actual OAuth URL
        window.location.href = 'https://accounts.google.com/o/oauth2/auth?client_id=164118449897-pcja0agskhvncjl5mrmt6hp2qmcmret8.apps.googleusercontent.com&redirect_uri=https://www.hypnos.site/webapp&response_type=token&scope=email profile';
    });

    // Simulate successful login for demo purposes
    if (window.location.hash.includes('access_token')) {
        document.getElementById('dashboard').style.display = 'block';
    }
});
