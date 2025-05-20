// suspension-alerts.js - Handles the display of real-time metro line suspension alerts

document.addEventListener('DOMContentLoaded', function() {
    // Create container for suspension alerts
    const alertsContainer = document.createElement('div');
    alertsContainer.className = 'row suspension-alerts-container';
    
    // Add it below Ticket Types
    const alertsSlot = document.querySelector('.suspension-alerts-container');
    if (alertsSlot) {
    alertsSlot.appendChild(alertsContainer);
    }

    // Fetch suspension alerts from API
    fetchSuspensionAlerts();

    // Set up polling for real-time updates (every 60 seconds)
    setInterval(fetchSuspensionAlerts, 60000);
});

/**
 * Fetches current suspension alerts from the API
 */
async function fetchSuspensionAlerts() {
    const container = document.querySelector('.suspension-alerts-container');
    if (!container) return;
    
    try {
        // Make API request to get active suspensions
        const response = await fetch('http://localhost:8081/api/suspensions?active=true', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            // Don't throw errors for 403 responses - handle them gracefully
            credentials: 'omit'
        });
        
        if (!response.ok) {
            // If response is not OK but not 403, log error
            if (response.status !== 403) {
                console.warn(`Failed to fetch suspension alerts: ${response.status}`);
            }
            return;
        }
        
        const suspensions = await response.json();
        
        // Clear existing alerts
        container.innerHTML = '';
        
        // If there are no active suspensions, exit
        if (!suspensions || suspensions.length === 0) {
            return;
        }
        
        // Add alert header if we have suspensions
        const alertHeader = document.createElement('div');
        alertHeader.className = 'col-12 mb-3';
        alertHeader.innerHTML = `
            <h3 class="text-center"><i class="fas fa-exclamation-triangle me-2"></i>Current Service Disruptions</h3>
        `;
        container.appendChild(alertHeader);
        
        // Create a new column for the alerts
        const alertColumn = document.createElement('div');
        alertColumn.className = 'col-12';
        container.appendChild(alertColumn);
        
        // Display each suspension alert
        suspensions.forEach(suspension => {
            displaySuspensionAlert(suspension, alertColumn);
        });
        
    } catch (error) {
        console.error('Error fetching suspension alerts:', error);
    }
}

/**
 * Displays a single suspension alert
 * @param {Object} suspension - Suspension alert data
 * @param {HTMLElement} container - Container to display the alert
 */
function displaySuspensionAlert(suspension, container) {
    // Format dates for displaying
    const startTime = formatDateTime(suspension.startTime);
    const endTime = formatDateTime(suspension.expectedEndTime);
    
    // Create the alert element
    const alertElement = document.createElement('div');
    alertElement.className = 'suspension-alert fade-in';
    alertElement.setAttribute('data-suspension-id', suspension.suspensionId || suspension.id);
    
    // Create alert content
    alertElement.innerHTML = `
        <div class="suspension-alert-icon">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        
        <div class="suspension-alert-content">
            <h4>${suspension.lineName || 'Metro Line'} Service Disruption</h4>
            <p>${suspension.reason || 'Service disruption due to maintenance.'}</p>
            
            <div class="suspension-alert-details">
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Affected Line:</div>
                    <div class="suspension-alert-value">${suspension.lineName || 'Unknown'}</div>
                </div>
                
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Affected Stations:</div>
                    <div class="suspension-alert-value">${suspension.affectedStationIds ? suspension.affectedStationIds.length : 0} stations affected</div>
                </div>
                
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Started:</div>
                    <div class="suspension-alert-value">${startTime}</div>
                </div>
                
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Expected Resolution:</div>
                    <div class="suspension-alert-value">${endTime}</div>
                </div>
            </div>
        </div>
        
        <button type="button" class="btn-close btn-close-white suspension-alert-dismiss" aria-label="Close"></button>
    `;
    
    // Add dismiss functionality
    const dismissButton = alertElement.querySelector('.suspension-alert-dismiss');
    if (dismissButton) {
        dismissButton.addEventListener('click', function() {
            alertElement.style.opacity = '0';
            setTimeout(() => {
                alertElement.remove();
            }, 300);
        });
    }
    
    // Add to container
    container.appendChild(alertElement);
}

/**
 * Formats a date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDateTime(dateString) {
    if (!dateString) return 'Unknown';
    
    try {
        const date = new Date(dateString);
        
        // Format for display: Mon, May 19, 7:42 PM
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        return 'Invalid date';
    }
}