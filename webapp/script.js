document.addEventListener("DOMContentLoaded", function() {
    const clientId = '164118449897-pcja0agskhvncjl5mrmt6hp2qmcmret8.apps.googleusercontent.com'; // Replace with your actual client ID
    const redirectUri = 'https://hypnos.site/webapp'; // Replace with your actual redirect URI
    const scope = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

    console.log('Page loaded');

    // Google OAuth Sign-In
    document.getElementById('google-signin-btn').addEventListener('click', () => {
        console.log('Sign in button clicked');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    });

    // Sign out functionality
    document.getElementById('google-signout-btn').addEventListener('click', () => {
        console.log('Sign out button clicked');
        localStorage.removeItem('access_token');
        window.location.href = redirectUri; // Redirect to the correct URI after logout
    });

    // Handle OAuth 2.0 response
    if (window.location.hash.includes('access_token')) {
        console.log('Access token found in URL');
        const accessToken = window.location.hash.split('&')[0].split('=')[1];
        localStorage.setItem('access_token', accessToken);
        displayDashboard();
    } else if (localStorage.getItem('access_token')) {
        console.log('Access token found in localStorage');
        displayDashboard();
    } else {
        console.log('No access token found');
    }

    function displayDashboard() {
        console.log('Displaying dashboard');
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
