document.addEventListener("DOMContentLoaded", function() {
    const clientId = '164118449897-pcja0agskhvncjl5mrmt6hp2qmcmret8.apps.googleusercontent.com'; 
    const redirectUri = 'https://hypnos.site/webapp'; 
    const scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    const vapiApiKey = '1c33ba3f-8c46-4a26-aa2f-049a86f96b0c'; 
    //const vapiApiKey = '0bda626b-7fbe-443c-b376-f526a085f25a';
    
    let currentPage = 1;
    let logsPerPage = 10; // Default logs per page
    let callLogs = [];

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

    function fetchCallLogs() {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${vapiApiKey}`
            }
        };

        fetch('https://api.vapi.ai/call?limit=100', options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching call logs: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Call Logs:', data);
            callLogs = data; // Correctly assign data to callLogs
            displayCallLogs();
            // Wait for the DOM to be fully updated before displaying analytics
            DisplayAnalytics(data);
            setTimeout(() => displayAnalytics(data), 3000);
        })
        .catch(error => {
            console.error('Error fetching call logs:', error);
        });
    }

    function displayCallLogs() {
        const callLogList = document.getElementById('call-log-list');
        callLogList.innerHTML = ''; // Clear existing logs

        const start = (currentPage - 1) * logsPerPage;
        const end = start + logsPerPage;
        const paginatedLogs = callLogs.slice(start, end); // Use callLogs for pagination

        paginatedLogs.forEach(log => {
            if (log.summary) {
                const logEntry = document.createElement('div');
                logEntry.className = 'call-log-entry';
                logEntry.innerHTML = `
                    <div class="call-details">
                        <span class="call-date">Date: ${new Date(log.createdAt).toLocaleDateString()}</span>
                        <span class="call-time">Time: ${new Date(log.createdAt).toLocaleTimeString()}</span>
                        <span class="call-duration">Duration: ${Math.round((new Date(log.endedAt) - new Date(log.startedAt)) / 1000 / 60)} mins</span>
                        <span class="call-status ${log.status}">Status: ${log.status.charAt(0).toUpperCase() + log.status.slice(1)}</span>
                    </div>
                    <div class="actions">
                        <button class="btn delete" onclick="deleteLog('${log.id}', this)">Delete</button>
                        <audio controls>
                            <source src="${log.recordingUrl}" type="audio/wav">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                `;
                callLogList.appendChild(logEntry);
            }
        });

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        const prevButton = document.querySelector('.pagination .prev');
        const nextButton = document.querySelector('.pagination .next');

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * logsPerPage >= callLogs.length;
    }

    document.querySelector('.pagination .prev').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCallLogs();
        }
    });

    document.querySelector('.pagination .next').addEventListener('click', () => {
        if (currentPage * logsPerPage < callLogs.length) {
            currentPage++;
            displayCallLogs();
        }
    });

    document.getElementById('logsPerPage').addEventListener('change', (event) => {
        logsPerPage = parseInt(event.target.value);
        currentPage = 1; // Reset to first page
        displayCallLogs();
    });

    function displayAnalytics(callLogs) {
        const metrics = {
            totalCalls: [],
            avgCallDuration: [],
            customerSatisfaction: [],
            firstCallResolution: [],
            netPromoterScore: []
        };

        callLogs.forEach(log => {
            if (log.summary && log.analysis && log.analysis.structuredData) {
                const date = new Date(log.createdAt).toLocaleDateString();
                metrics.totalCalls.push({ date, value: parseFloat(log.analysis.structuredData.RT) || 0 });
                metrics.avgCallDuration.push({ date, value: parseFloat(log.analysis.structuredData.AHT) || 0 });
                metrics.customerSatisfaction.push({ date, value: parseFloat(log.analysis.structuredData.CSAT) || 0 });
                metrics.firstCallResolution.push({ date, value: parseFloat(log.analysis.structuredData.FCR) || 0 });
                metrics.netPromoterScore.push({ date, value: parseFloat(log.analysis.structuredData.NPS) || 0 });
            }
        });

        console.log(metrics); // Debug: Check if metrics are correctly populated

        // Create charts
        createLineChart('totalCallsChart', 'Resolution Time', metrics.totalCalls);
        createLineChart('avgCallDurationChart', 'Average Call Duration', metrics.avgCallDuration);
        createLineChart('customerSatisfactionChart', 'Customer Satisfaction', metrics.customerSatisfaction);
        createLineChart('firstCallResolutionChart', 'First Call Resolution', metrics.firstCallResolution);
        createLineChart('netPromoterScoreChart', 'Net Promoter Score', metrics.netPromoterScore);
    }

    function createLineChart(canvasId, label, data) {
        console.log(`Attempting to create chart for ${canvasId}`); // Debug: Check which chart is being created
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error(`Canvas element with id ${canvasId} not found.`);
            return;
        }

        const chartData = {
            labels: data.map(d => d.date),
            datasets: [{
                label: label,
                data: data.map(d => d.value),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        };

        const chartConfig = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        };

        new Chart(ctx.getContext('2d'), chartConfig);
    }

    function DisplayAnalytics(callLogs) {
        const analyticsSection = document.getElementById('analytics-section');
        analyticsSection.innerHTML = ''; // Clear existing content

        callLogs.forEach(log => {
            if (log.summary && log.analysis && log.analysis.structuredData) {
                const analyticsEntry = document.createElement('div');
                analyticsEntry.className = 'call-log-entry';

                analyticsEntry.innerHTML = `
                    <h3>Call on ${new Date(log.createdAt).toLocaleDateString()} at ${new Date(log.createdAt).toLocaleTimeString()}</h3>
                    <p>AHT: ${log.analysis.structuredData.AHT}</p>
                    <p>CSAT: ${log.analysis.structuredData.CSAT}</p>
                    <p>FCR: ${log.analysis.structuredData.FCR}</p>
                    <p>NPS: ${log.analysis.structuredData.NPS}</p>
                    <p>RT: ${log.analysis.structuredData.RT}</p>
                `;

                analyticsSection.appendChild(analyticsEntry);
            }
        });
    }

    window.deleteLog = function(id, buttonElement) {
        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${vapiApiKey}`
            }
        };

        fetch(`https://api.vapi.ai/call/${id}`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error deleting call log: ${response.statusText}`);
            }
            fetchCallLogs();
        })
        .catch(error => {
            console.error('Error deleting call log:', error);
        });
    };

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

        if (tabName === 'Analytics') {
            displayAnalytics(callLogs);
        }
    }

    // Set default tab to open
    document.querySelector(".tab-link").click();
});
