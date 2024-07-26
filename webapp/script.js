document.addEventListener("DOMContentLoaded", function() {
    const clientId = '164118449897-pcja0agskhvncjl5mrmt6hp2qmcmret8.apps.googleusercontent.com'; // Replace with your actual client ID
    const redirectUri = 'https://hypnos.site/webapp'; // Replace with your actual redirect URI
    const scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    const vapiApiKey = '1c33ba3f-8c46-4a26-aa2f-049a86f96b0c'; // Replace with your actual Vapi.ai API key

    console.log('Page loaded');

    // Google OAuth Sign-In
    document.getElementById('google-signin-btn').addEventListener('click', () => {
        console.log('Sign in button clicked');
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    });

    // Get started button click event
    document.getElementById('getstarted').addEventListener('click', () => {
        console.log('Get started button clicked');
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
        document.getElementById('indexhero').style.display = 'none';
        displayDashboard();
    } else if (localStorage.getItem('access_token')) {
        console.log('Access token found in localStorage');
        document.getElementById('indexhero').style.display = 'none';
        displayDashboard();
    } else {
        console.log('No access token found');
    }

    function displayDashboard() {
        console.log('Displaying dashboard');
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('google-signin-btn').style.display = 'none';
        document.getElementById('google-signout-btn').style.display = 'block';

        // Fetch user's primary calendar ID and update the calendar iframe
        const accessToken = localStorage.getItem('access_token');
        fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Calendar List:', data);
            const primaryCalendar = data.items.find(calendar => calendar.primary);
            if (primaryCalendar) {
                updateCalendarIframe(primaryCalendar.id);
            } else {
                console.error('Primary calendar not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching calendar list:', error);
        });

        // Fetch and display call logs
        fetchCallLogs();
    }

    function updateCalendarIframe(calendarId) {
        console.log('Updating calendar iframe with calendar ID:', calendarId);
        const iframe = document.getElementById('calendar-iframe');
        iframe.src = `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=America/New_York`;
    }

    const jwt = require('jsonwebtoken');

    const orgId = '7db8f0b6-9aa0-4ec8-9b1f-99a9b635a1a3';
    const privateKey = '1c33ba3f-8c46-4a26-aa2f-049a86f96b0c';

     const payload = { orgId };
     const options = { expiresIn: '1h' };

     // Generate the token
     const token = jwt.sign(payload, privateKey, options);

function fetchCallLogs() {
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${vapiApiKey}`
        }
    };

    fetch('https://api.vapi.ai/call', options)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Call Logs:', data);
        displayCallLogs(data);
    })
    .catch(error => {
        console.error('Error fetching call logs:', error);
    });
}
    
function displayCallLogs(callLogs) {
    const callLogList = document.getElementById('call-log-list');
    callLogList.innerHTML = ''; // Clear existing logs

    callLogs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'call-log-entry';

        logEntry.innerHTML = `
            <div class="call-details">
                <span class="call-type">${log.type}</span>
                <span class="call-status">${log.status}</span>
                <span class="call-date">${new Date(log.createdAt).toLocaleDateString()}</span>
                <span class="call-time">${new Date(log.createdAt).toLocaleTimeString()}</span>
            </div>
        `;

        callLogList.appendChild(logEntry);
    });
}

    // Tab switching functionality
    window.openTab = function(event, tabName) {
        // Get all elements with class="tab-content" and hide them
        var tabContents = document.getElementsByClassName("tab-content");
        for (var i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = "none";
        }

        // Get all elements with class="tab-link" and remove the class "active"
        var tabLinks = document.getElementsByClassName("tab-link");
        for (var i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }

        // Show the current tab and add an "active" class to the button that opened the tab
        document.getElementById(tabName).style.display = "block";
        event.currentTarget.className += " active";
    }

    // Set default tab to open
    document.querySelector(".tab-link").click();
});
