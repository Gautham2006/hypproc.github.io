document.addEventListener("DOMContentLoaded", function() {
    const clientId = '164118449897-pcja0agskhvncjl5mrmt6hp2qmcmret8.apps.googleusercontent.com'; // Replace with your actual client ID
    const redirectUri = 'https://www.hypnos.site/webapp'; // Replace with your main page URL
    const scope = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    
    // Google OAuth Sign-In
    document.getElementById('google-signin-btn').addEventListener('click', () => {
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    });

    // Sign out functionality
    document.getElementById('google-signout-btn').addEventListener('click', () => {
        localStorage.removeItem('access_token');
        window.location.href = '/';
    });

    // Handle OAuth 2.0 response
    if (window.location.hash.includes('access_token')) {
        const accessToken = window.location.hash.split('&')[0].split('=')[1];
        localStorage.setItem('access_token', accessToken);
        displayDashboard();
    } else if (localStorage.getItem('access_token')) {
        displayDashboard();
    }

    function displayDashboard() {
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('google-signin-btn').style.display = 'none';
        document.getElementById('google-signout-btn').style.display = 'block';

        // Optional: Make authenticated requests to Google APIs using the access token
        // Example: Fetch user profile
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('User profile data:', data);
        });
    }
});
