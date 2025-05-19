// js/suspension-alerts.js - Handles real-time suspension alerts

/**
 * Global variables for suspension alert functionality
 */
let suspensionCheckInterval;
const POLLING_INTERVAL = 30000; // 30 seconds

/**
 * Initializes the suspension alert system
 */
function initSuspensionAlerts() {
    // Create a container for suspension alerts if it doesn't exist
    createAlertContainer();
    
    // Start polling for alerts
    startSuspensionAlertPolling();
    
    console.log('Suspension alert system initialized');
}

/**
 * Creates a container for suspension alerts if it doesn't exist
 */
function createAlertContainer() {
    if (!document.querySelector('.suspension-alerts-container')) {
        const container = document.createElement('div');
        container.className = 'suspension-alerts-container';
        container.style.marginBottom = '2rem';
        
        // Insert the container at the top of the page content
        const mainContent = document.querySelector('.container.mt-5.pt-5');
        if (mainContent) {
            mainContent.insertBefore(container, mainContent.firstChild);
        }
    }
}

/**
 * Starts polling for suspension alerts
 */
function startSuspensionAlertPolling() {
    // Clear any existing interval
    if (suspensionCheckInterval) {
        clearInterval(suspensionCheckInterval);
    }
    
    // Check for suspension alerts immediately
    checkForSuspensionAlerts();
    
    // Then check periodically
    suspensionCheckInterval = setInterval(checkForSuspensionAlerts, POLLING_INTERVAL);
}

/**
 * Checks for active suspension alerts from the OPWA API
 */
async function checkForSuspensionAlerts() {
    try {
        const response = await fetch('http://localhost:8081/api/suspensions?active=true');
        
        if (!response.ok) {
            console.error('Failed to fetch suspension alerts:', response.status);
            return;
        }
        
        const suspensions = await response.json();
        
        // If there are active suspensions, display alerts
        if (suspensions && suspensions.length > 0) {
            displaySuspensionAlerts(suspensions);
            
            // Send acknowledgment to OPWA
            acknowledgeAlerts(suspensions);
        } else {
            // Remove any existing alerts if there are no active suspensions
            removeAllAlerts();
        }
    } catch (error) {
        console.error('Error checking for suspension alerts:', error);
    }
}

/**
 * Removes all suspension alerts from the page
 */
function removeAllAlerts() {
    const existingAlerts = document.querySelectorAll('.suspension-alert');
    existingAlerts.forEach(alert => {
        alert.remove();
    });
}

/**
 * Displays suspension alerts on the page
 * @param {Array} suspensions - Array of suspension objects
 */
function displaySuspensionAlerts(suspensions) {
    // Get container for alerts
    const alertsContainer = document.querySelector('.suspension-alerts-container');
    
    // Process each suspension
    suspensions.forEach(suspension => {
        // Check if this alert is already displayed
        const existingAlert = document.getElementById(`suspension-${suspension.suspensionId}`);
        if (existingAlert) {
            // Update existing alert if needed
            updateExistingAlert(existingAlert, suspension);
            return;
        }
        
        // Create new alert element
        const alertElement = document.createElement('div');
        alertElement.className = 'suspension-alert fade-in';
        alertElement.id = `suspension-${suspension.suspensionId}`;
        
        // Format times for display
        const formattedTimes = formatSuspensionTimes(suspension);
        
        // Get affected stations if available
        const affectedStationsInfo = getAffectedStationsInfo(suspension);
        
        // Alert content
        alertElement.innerHTML = `
            <div class="suspension-alert-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="suspension-alert-content">
                <h4>Metro Line Service Disruption</h4>
                <p><strong>${suspension.lineName}</strong> is currently experiencing a service disruption due to ${suspension.reason || 'operational issues'}.</p>
                
                <div class="suspension-alert-details">
                    <div class="suspension-alert-detail">
                        <div class="suspension-alert-label">Affected Line:</div>
                        <div class="suspension-alert-value">${suspension.lineName}</div>
                    </div>
                    ${affectedStationsInfo}
                    <div class="suspension-alert-detail">
                        <div class="suspension-alert-label">Reason:</div>
                        <div class="suspension-alert-value">${suspension.reason || 'Operational issues'}</div>
                    </div>
                    <div class="suspension-alert-detail">
                        <div class="suspension-alert-label">Started:</div>
                        <div class="suspension-alert-value">${formattedTimes.startTime}</div>
                    </div>
                    <div class="suspension-alert-detail">
                        <div class="suspension-alert-label">Expected Resolution:</div>
                        <div class="suspension-alert-value">${formattedTimes.endTime}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add close button to dismiss the alert
        const closeButton = document.createElement('button');
        closeButton.className = 'btn-close btn-close-white';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.style.position = 'absolute';
        closeButton.style.top = '1rem';
        closeButton.style.right = '1rem';
        
        closeButton.addEventListener('click', () => {
            alertElement.remove();
        });
        
        alertElement.appendChild(closeButton);
        
        // Add the alert to the page
        alertsContainer.appendChild(alertElement);
    });
}

/**
 * Updates an existing alert element with new suspension info
 * @param {HTMLElement} alertElement - The existing alert element
 * @param {Object} suspension - Updated suspension info
 */
function updateExistingAlert(alertElement, suspension) {
    // Update relevant parts if needed (like expected end time)
    const formattedTimes = formatSuspensionTimes(suspension);
    const endTimeElement = alertElement.querySelector('.suspension-alert-detail:last-child .suspension-alert-value');
    
    if (endTimeElement) {
        endTimeElement.textContent = formattedTimes.endTime;
    }
    
    // Could update other parts as needed
}

/**
 * Gets HTML for affected stations if available
 * @param {Object} suspension - Suspension object
 * @returns {string} - HTML for displaying affected stations
 */
function getAffectedStationsInfo(suspension) {
    if (suspension.affectedStationIds && suspension.affectedStationIds.length > 0) {
        return `
            <div class="suspension-alert-detail">
                <div class="suspension-alert-label">Affected Stations:</div>
                <div class="suspension-alert-value">${suspension.affectedStationIds.length} stations affected</div>
            </div>
        `;
    }
    return '';
}

/**
 * Formats suspension times for display
 * @param {Object} suspension - Suspension object
 * @returns {Object} - Object containing formatted start and end times
 */
function formatSuspensionTimes(suspension) {
    let startTimeDisplay = 'Unknown';
    if (suspension.startTime) {
        const startTime = new Date(suspension.startTime);
        startTimeDisplay = startTime.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
    
    let endTimeDisplay = 'Unknown';
    if (suspension.expectedEndTime) {
        const endTime = new Date(suspension.expectedEndTime);
        endTimeDisplay = endTime.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
    
    return {
        startTime: startTimeDisplay,
        endTime: endTimeDisplay
    };
}

/**
 * Sends acknowledgment to OPWA for the alerts
 * @param {Array} suspensions - Array of suspension objects
 */
async function acknowledgeAlerts(suspensions) {
    try {
        // For each suspension, send acknowledgment to OPWA
        for (const suspension of suspensions) {
            await fetch(`http://localhost:8081/api/suspensions/${suspension.suspensionId}/acknowledge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    acknowledged: true,
                    passengerApp: 'PAWA',
                    timestamp: new Date().toISOString()
                })
            });
            console.log(`Acknowledged suspension alert ${suspension.suspensionId}`);
        }
    } catch (error) {
        console.error('Error acknowledging suspension alerts:', error);
    }
}

// Initialize suspension alerts when the DOM is loaded
document.addEventListener('DOMContentLoaded', initSuspensionAlerts);