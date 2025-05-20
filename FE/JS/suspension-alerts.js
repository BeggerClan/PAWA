// suspension-alerts.js - Enhanced to show affected station names

document.addEventListener("DOMContentLoaded", function() {
    // Fetch suspension alerts when the document loads
    fetchSuspensionAlerts();
});

/**
 * Fetches active suspension alerts from the API and displays them
 */
async function fetchSuspensionAlerts() {
    const container = document.querySelector('.suspension-alerts-container');
    
    if (!container) {
        console.warn("Suspension alerts container not found");
        return;
    }
    
    try {
        // 1. First, fetch all metro lines to map IDs to names
        const linesResponse = await fetch('http://localhost:8081/api/metro-lines/get-all-metro-lines');
        if (!linesResponse.ok) {
            throw new Error(`Failed to fetch metro lines: ${linesResponse.status}`);
        }
        
        const metroLines = await linesResponse.json();
        console.log("Metro lines data:", metroLines);
        
        // Create line name mapping for quick lookup
        const lineNameMap = {};
        metroLines.forEach(line => {
            lineNameMap[line.lineId] = line.lineName;
        });
        
        // 2. Fetch all stations to map station IDs to names
        const stationsResponse = await fetch('http://localhost:8081/api/stations/get-all-stations');
        if (!stationsResponse.ok) {
            throw new Error(`Failed to fetch stations: ${stationsResponse.status}`);
        }
        
        const stations = await stationsResponse.json();
        console.log("Stations data:", stations);
        
        // Create station name mapping for quick lookup
        const stationNameMap = {};
        stations.forEach(station => {
            stationNameMap[station.stationId] = station;
        });
        
        // 3. Now fetch active suspensions
        const response = await fetch('http://localhost:8081/api/suspensions?active=true');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch suspension alerts: ${response.status}`);
        }
        
        const suspensions = await response.json();
        console.log("Suspension data:", suspensions);
        
        // Check if there are any active suspensions
        if (!suspensions || suspensions.length === 0) {
            // Hide the alerts section
            const alertHeader = document.getElementById('current-service-disruptions');
            if (alertHeader) {
                alertHeader.style.display = 'none';
            }
            return;
        }
        
        // Clear any existing alerts
        container.innerHTML = '';
        
        // Process and display each suspension
        for (const suspension of suspensions) {
            // Look up the line name using metroLineId
            if (suspension.metroLineId && lineNameMap[suspension.metroLineId]) {
                // Use the looked-up line name from our map
                suspension.displayLineName = lineNameMap[suspension.metroLineId];
            } else {
                // Fallback to the lineName in the suspension or 'Unknown'
                suspension.displayLineName = suspension.lineName || 'Unknown';
            }
            
            // Add the station details for each affected station ID
            if (suspension.affectedStationIds && suspension.affectedStationIds.length > 0) {
                suspension.affectedStations = suspension.affectedStationIds.map(stationId => {
                    const station = stationNameMap[stationId];
                    return station ? {
                        id: stationId,
                        name: station.stationName || `Station ${stationId}`,
                        latitude: station.latitude,
                        longitude: station.longitude
                    } : {
                        id: stationId,
                        name: `Station ${stationId}`,
                        latitude: null,
                        longitude: null
                    };
                });
            } else {
                suspension.affectedStations = [];
            }
            
            // Create and append the alert
            container.appendChild(createSuspensionAlert(suspension));
        }
        
        // Show the alerts section
        const alertHeader = document.getElementById('current-service-disruptions');
        if (alertHeader) {
            alertHeader.style.display = 'block';
        }
        
    } catch (error) {
        console.error("Error fetching suspension alerts:", error);
        // Optionally show an error message in the UI
    }
}

/**
 * Creates a suspension alert DOM element
 * @param {Object} suspension - The suspension data object
 * @returns {HTMLElement} - The suspension alert element
 */
function createSuspensionAlert(suspension) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'suspension-alert fade-in';
    
    // Format dates
    const startTime = new Date(suspension.startTime);
    const formattedStart = startTime.toLocaleString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric' 
    });
    
    let formattedEnd = 'Unknown';
    if (suspension.expectedEndTime) {
        const endTime = new Date(suspension.expectedEndTime);
        formattedEnd = endTime.toLocaleString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
        });
    }
    
    // Get affected stations information
    const stationsCount = suspension.affectedStations ? suspension.affectedStations.length : 0;
    
    // Generate HTML for affected stations list
    let stationsHtml = '';
    if (stationsCount > 0) {
        stationsHtml = `
            <div class="affected-stations-list mt-2">
                <div class="suspension-alert-label mb-1">Affected Stations:</div>
                <ul class="list-unstyled ps-2 mb-0">
                    ${suspension.affectedStations.map(station => 
                        `<li><i class="fas fa-map-marker-alt text-danger me-2"></i>${station.name}</li>`
                    ).join('')}
                </ul>
            </div>
        `;
    }
    
    // Use the displayLineName that was set during processing
    const lineNameDisplay = suspension.displayLineName || 'Metro Line';
    
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle suspension-alert-icon"></i>
        <div class="suspension-alert-content">
            <h4>${lineNameDisplay} Service Disruption</h4>
            <p>${suspension.reason || 'Service Disruption'}</p>
            
            <div class="suspension-alert-details">
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Affected Line:</div>
                    <div class="suspension-alert-value">${lineNameDisplay}</div>
                </div>
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Status:</div>
                    <div class="suspension-alert-value">
                        <span class="status-badge status-suspended">
                            ${stationsCount} station${stationsCount !== 1 ? 's' : ''} affected
                        </span>
                    </div>
                </div>
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Started:</div>
                    <div class="suspension-alert-value">${formattedStart}</div>
                </div>
                <div class="suspension-alert-detail">
                    <div class="suspension-alert-label">Expected Resolution:</div>
                    <div class="suspension-alert-value">${formattedEnd}</div>
                </div>
                ${stationsHtml}
            </div>
        </div>
        <button type="button" class="btn-close btn-close-white" aria-label="Close"></button>
    `;
    
    // Add event listener to close button
    const closeButton = alertDiv.querySelector('.btn-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            alertDiv.remove();
            
            // If no more alerts, hide the header
            if (document.querySelectorAll('.suspension-alert').length === 0) {
                const alertHeader = document.getElementById('current-service-disruptions');
                if (alertHeader) {
                    alertHeader.style.display = 'none';
                }
            }
        });
    }
    
    return alertDiv;
}