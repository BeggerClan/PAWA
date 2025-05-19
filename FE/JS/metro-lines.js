// metro-lines.js - Simple implementation focusing on I.PA.3 requirements

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isAuthenticated = sessionStorage.getItem('jwtToken') !== null;
    
    // Update navigation based on authentication status
    updateNavigation(isAuthenticated);
    
    // Fetch metro lines from OPWA API
    fetchMetroLines();
});

/**
 * Updates the navigation menu based on authentication status
 * @param {boolean} isAuthenticated - Whether user is logged in
 */
function updateNavigation(isAuthenticated) {
    const authMenu = document.querySelector('.auth-menu');
    const guestMenu = document.querySelector('.guest-menu');
    
    if (authMenu && guestMenu) {
        authMenu.style.display = isAuthenticated ? 'flex' : 'none';
        guestMenu.style.display = isAuthenticated ? 'none' : 'flex';
    }
}

/**
 * Fetches metro lines data from OPWA API
 */
async function fetchMetroLines() {
    // Get the container element
    const container = document.getElementById('metro-lines-container');
    
    try {
        // Fetch metro lines from OPWA API using the correct endpoint
        const response = await fetch('http://localhost:8081/api/metro-lines/full-details');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch metro lines: ${response.status}`);
        }
        
        const metroLines = await response.json();
        console.log('Metro lines data:', metroLines); // Log the response for debugging
        
        // Clear the loading spinner
        container.innerHTML = '';
        
        // Display the metro lines
        if (!metroLines || metroLines.length === 0) {
            container.innerHTML = `<div class="alert alert-info">No metro lines available.</div>`;
        } else {
            displayMetroLines(metroLines, container);
        }
    } catch (error) {
        console.error('Error fetching metro lines:', error);
        
        // Show error message
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Unable to load metro lines. Please try again later.
                <br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

/**
 * Displays the metro lines in the container
 * @param {Array} metroLines - Array of metro line objects
 * @param {HTMLElement} container - Container to display the metro lines
 */
function displayMetroLines(metroLines, container) {
    metroLines.forEach(line => {
        // Create a card for each metro line
        const card = document.createElement('div');
        card.className = 'metro-card';
        
        // Get first and last station (if stations array is available)
        let firstStation = 'First Station';
        let lastStation = 'Last Station';
        let totalStations = line.stationIds ? line.stationIds.length : 0;
        
        if (line.stations && line.stations.length > 0) {
            firstStation = line.stations[0].stationName;
            lastStation = line.stations[line.stations.length - 1].stationName;
            totalStations = line.stations.length;
        }
        
        // Determine line status
        const isActive = line.active !== false;
        const isSuspended = line.suspended === true;
        
        let statusBadge = '';
        if (isSuspended) {
            statusBadge = `<span class="status-badge status-suspended">Suspended</span>`;
        } else if (isActive) {
            statusBadge = `<span class="status-badge status-operational">Operational</span>`;
        } else {
            statusBadge = `<span class="status-badge status-inactive">Inactive</span>`;
        }
        
        // Determine line color based on name or ID
        let lineBadgeColor = 'primary-blue';
        if (line.lineName && line.lineName.toLowerCase().includes('red')) {
            lineBadgeColor = 'danger';
        } else if (line.lineName && line.lineName.toLowerCase().includes('blue')) {
            lineBadgeColor = 'primary';
        }
        
        // Create the card header with line name
        const cardHeader = document.createElement('div');
        cardHeader.className = 'metro-card-header';
        cardHeader.innerHTML = `<i class="fas fa-subway me-2"></i>${line.lineName || 'Metro Line'}`;
        
        // Create the card body with line details
        const cardBody = document.createElement('div');
        cardBody.className = 'metro-card-body';
        
        // Add line information
        cardBody.innerHTML = `
            <div class="metro-info-row">
                <div class="metro-info-label">Status:</div>
                <div class="metro-info-value">${statusBadge}</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">First Station:</div>
                <div class="metro-info-value">${firstStation}</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">Last Station:</div>
                <div class="metro-info-value">${lastStation}</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">Total Duration:</div>
                <div class="metro-info-value">${line.totalDuration || 'N/A'} minutes</div>
            </div>
            <div class="metro-info-row">
                <div class="metro-info-label">Total Stations:</div>
                <div class="metro-info-value">${totalStations}</div>
            </div>
            
            ${isSuspended ? `
            <div class="metro-info-row">
                <div class="metro-info-label">Suspension Reason:</div>
                <div class="metro-info-value">${line.suspensionReason || 'Maintenance'}</div>
            </div>
            ` : ''}
            
            <button class="btn btn-outline-primary mt-3 toggle-stations-btn">
                <i class="fas fa-list me-2"></i>View Stations
            </button>
            
            <div class="station-list">
                ${generateStationList(line)}
            </div>
        `;
        
        // Append the header and body to the card
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        
        // Append the card to the container
        container.appendChild(card);
        
        // Add event listener to the toggle button
        const toggleBtn = cardBody.querySelector('.toggle-stations-btn');
        const stationList = cardBody.querySelector('.station-list');
        
        toggleBtn.addEventListener('click', function() {
            // Toggle the display of station list with animation
            if (!stationList.classList.contains('show')) {
                stationList.classList.add('show');
                toggleBtn.innerHTML = '<i class="fas fa-times me-2"></i>Hide Stations';
                toggleBtn.classList.add('active');
            } else {
                stationList.classList.remove('show');
                toggleBtn.innerHTML = '<i class="fas fa-list me-2"></i>View Stations';
                toggleBtn.classList.remove('active');
            }
        });
    });
}


/**
 * Generates HTML for the station list
 * @param {Object} metroLine - Metro line object
 * @returns {string} - HTML for the station list
 */
function generateStationList(metroLine) {
    // Check for stations array in the full-details format
    if (metroLine.stations && metroLine.stations.length > 0) {
        return metroLine.stations.map((station, index) => `
            <div class="station-item">
                <strong>${index + 1}.</strong> ${station.stationName}
            </div>
        `).join('');
    } 
    // Fallback to stationIds if stations array is not available
    else if (metroLine.stationIds && metroLine.stationIds.length > 0) {
        return metroLine.stationIds.map((stationId, index) => `
            <div class="station-item">
                <strong>${index + 1}.</strong> Station ${stationId}
            </div>
        `).join('');
    } 
    else {
        return '<div class="alert alert-info mt-3">No stations available for this line.</div>';
    }
}