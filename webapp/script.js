document.addEventListener("DOMContentLoaded", function() {
    const clientId = 'YOUR_CLIENT_ID'; // Replace with your actual client ID
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const redirectUri = 'https://hypnos.site/webapp'; // Ensure this matches the registered URI exactly
    const scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    const discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    console.log('Page loaded');
    console.log('Redirect URI:', redirectUri);

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init({
            apiKey: apiKey,
            clientId: clientId,
            discoveryDocs: discoveryDocs,
            scope: scope
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle initial sign-in state. (Determine if user is already signed in.)
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

            document.getElementById('google-signin-btn').addEventListener('click', handleAuthClick);
            document.getElementById('google-signout-btn').addEventListener('click', handleSignoutClick);
        });
    }

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('google-signin-btn').style.display = 'none';
            document.getElementById('google-signout-btn').style.display = 'block';
            getPrimaryCalendarId();
        } else {
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('google-signin-btn').style.display = 'block';
            document.getElementById('google-signout-btn').style.display = 'none';
        }
    }

    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
        localStorage.removeItem('access_token');
        window.location.href = redirectUri;
    }

    function getPrimaryCalendarId() {
        gapi.client.calendar.calendarList.list().then(response => {
            const primaryCalendar = response.result.items.find(calendar => calendar.primary);
            if (primaryCalendar) {
                updateCalendarIframe(primaryCalendar.id);
            }
        });
    }

    function updateCalendarIframe(calendarId) {
        const iframe = document.getElementById('calendar-iframe');
        iframe.src = `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=America/New_York`;
    }

    handleClientLoad();
});
