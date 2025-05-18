// metro-lines.js - Updated to fetch from OPWA API

// =====================================================
// CORE DATA FETCHING FUNCTIONS
// =====================================================

/**
 * Fetches metro lines data from OPWA API
 */
async function fetchMetroLines() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'text-center my-5';
    loadingIndicator.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading metro lines...</p>';
    
    const metroLineContainer = document.querySelector('.col-lg-8');
    if (metroLineContainer) {
        // Clear existing content and show loading indicator
        metroLineContainer.innerHTML = '';
        metroLineContainer.appendChild(loadingIndicator);
    }
    
    try {
        // Fetch metro lines from OPWA API - updated URL to use port 8081
        const response = await fetch('http://localhost:8081/api/metro-lines/get-all-metro-lines', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch metro lines: ${response.status} ${response.statusText}`);
        }
        
        const metroLines = await response.json();
        displayMetroLines(metroLines);
    } catch (error) {
        console.error('Error fetching metro lines:', error);
        
        // Show error message
        if (metroLineContainer) {
            metroLineContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Unable to load metro lines. Please try again later.
                        <br>
                        <small>${error.message}</small>
                    </div>
                </div>
            `;
        }
    }
}

/**
 * Searches for metro routes between stations
 * @param {string} fromStation - Origin station
 * @param {string} toStation - Destination station
 * @param {string} travelTime - Departure time
 */
async function searchMetroRoutes(fromStation, toStation, travelTime) {
    try {
        // Format the search parameters
        const params = new URLSearchParams({
            from: fromStation,
            to: toStation,
            datetime: travelTime
        });
        
        // Call the OPWA API for searching routes - updated URL to use port 8081
        const response = await fetch(`http://localhost:8081/api/metro-lines/search?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to search routes: ${response.status} ${response.statusText}`);
        }
        
        const routes = await response.json();
        displayRouteResults(routes);
    } catch (error) {
        console.error('Error searching routes:', error);
        
        // Show error message
        alert(`Failed to search routes: ${error.message}`);
    }
}

// =====================================================
// UI DISPLAY FUNCTIONS
// =====================================================

/**
 * Displays metro lines in the UI
 * @param {Array} metroLines - Array of metro line objects
 */
function displayMetroLines(metroLines) {
    const container = document.querySelector('.col-lg-8');
    if (!container) return;
    
    // Clear loading indicator
    container.innerHTML = '';
    
    if (!metroLines || metroLines.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                No metro lines are currently available.
            </div>
        `;
        return;
    }
    
    // Loop through metro lines and create UI cards
    metroLines.forEach((metroLine) => {
        const card = document.createElement('div');
        card.className = 'card mb-4';
        
        const isActive = metroLine.active !== false;
        const isSuspended = metroLine.suspended === true;
        
        let statusBadge = isActive ? 
            `<span class="badge bg-success">Operational</span>` : 
            `<span class="badge bg-danger">Inactive</span>`;
            
        if (isSuspended) {
            statusBadge = `<span class="badge bg-warning">Suspended</span>`;
        }
        
        card.innerHTML = `
            <div class="card-header bg-primary text-white">
                <h3 class="card-title mb-0"><i class="fas fa-subway me-2"></i>${metroLine.lineName}</h3>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-3">
                    <div>
                        <strong>Status:</strong> ${statusBadge}
                    </div>
                    <div>
                        <strong>Duration:</strong> ${metroLine.totalDuration} minutes
                    </div>
                    <div>
                        <strong>First/Last Train:</strong> ${formatTime(metroLine.firstDeparture)} / 10:00 PM
                    </div>
                </div>
                
                <p class="mb-3">Line connects ${getFirstStationName(metroLine)} to ${getLastStationName(metroLine)}, passing through key locations in the city.</p>
                
                <div class="metro-map mb-4">
                    <h5>Route Map</h5>
                    <div class="station-route">
                        <div class="station-list">
                            ${generateStationList(metroLine)}
                        </div>
                    </div>
                </div>
                
                <div class="schedule-info">
                    <h5>Schedule Information</h5>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Train Frequency</th>
                                <th>First Departure</th>
                                <th>Last Departure</th>
                                <th>Travel Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Every ${metroLine.frequencyMinutes || "10"} minutes</td>
                                <td>${formatTime(metroLine.firstDeparture)}</td>
                                <td>6:00 PM</td>
                                <td>${metroLine.totalDuration} minutes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                ${generateUpcomingTrips(metroLine)}
            </div>
        `;
        
        container.appendChild(card);
    });
}

/**
 * Displays search results for routes between stations
 * @param {Array} routes - Array of route objects
 */
function displayRouteResults(routes) {
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results mt-4';
    
    if (!routes || routes.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No routes found for your search criteria. Please try different stations or time.
            </div>
        `;
    } else {
        resultsContainer.innerHTML = `
            <h4 class="mb-3">Search Results</h4>
            <div class="route-list">
                ${routes.map((route, index) => `
                    <div class="route-card">
                        <div class="route-header">
                            <div class="route-time">
                                <div class="departure">${formatTime(route.departureTime)}</div>
                                <div class="duration"><i class="fas fa-clock"></i> ${route.durationMinutes || route.totalDuration || '30'} min</div>
                                <div class="arrival">${formatTime(route.arrivalTime)}</div>
                            </div>
                            <div class="route-line">${route.lineName}</div>
                        </div>
                        <div class="route-stations">
                            <div class="from-station">${route.fromStation || getFirstStationName(route)}</div>
                            <div class="route-path">
                                <div class="path-line"></div>
                                <div class="stations-count">${route.stationsCount || (route.stations && route.stations.length) || calculateStationCount(route)} stations</div>
                            </div>
                            <div class="to-station">${route.toStation || getLastStationName(route)}</div>
                        </div>
                        <div class="route-actions">
                            <button class="btn btn-sm btn-outline-primary view-details-btn" data-route-index="${index}">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                            <button class="btn btn-sm btn-primary book-btn" data-route-index="${index}">
                                <i class="fas fa-ticket-alt"></i> Book
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Replace or append the results in the DOM
    const existingResults = document.querySelector('.search-results');
    if (existingResults) {
        existingResults.replaceWith(resultsContainer);
    } else {
        const searchCard = document.querySelector('.card.search-card');
        if (searchCard) {
            searchCard.after(resultsContainer);
        }
    }
    
    // Add event listeners for detail buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.routeIndex);
            showRouteDetails(routes[index]);
        });
    });
    
    // Add event listeners for book buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.routeIndex);
            addRouteToCart(routes[index]);
        });
    });
}

/**
 * Displays a modal with detailed information about a route
 * @param {Object} route - Route object containing details
 */
function showRouteDetails(route) {
    // Create a modal to show route details
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'routeDetailsModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'routeDetailsModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="routeDetailsModalLabel">Route Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="route-details">
                        <div class="route-summary">
                            <div class="route-line-badge">${route.lineName}</div>
                            <div class="route-time-details">
                                <div class="time-item">
                                    <div class="label">Departure</div>
                                    <div class="value">${formatTime(route.departureTime)}</div>
                                </div>
                                <div class="time-item">
                                    <div class="label">Duration</div>
                                    <div class="value">${route.durationMinutes || route.totalDuration || '30'} min</div>
                                </div>
                                <div class="time-item">
                                    <div class="label">Arrival</div>
                                    <div class="value">${formatTime(route.arrivalTime)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="station-timeline">
                            ${getStationTimeline(route)}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary book-route-btn">Book This Route</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Initialize the Bootstrap modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Add event listener for booking button
    modal.querySelector('.book-route-btn').addEventListener('click', () => {
        modalInstance.hide();
        addRouteToCart(route);
    });
    
    // Clean up when modal is hidden
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Creates timeline HTML for stations in a route
 */
function getStationTimeline(route) {
    if (route.stations && route.stations.length > 0) {
        return route.stations.map((station, index) => `
            <div class="timeline-item">
                <div class="timeline-marker ${index === 0 ? 'start' : (index === route.stations.length - 1 ? 'end' : '')}"></div>
                <div class="timeline-content">
                    <div class="station-name">${station.name || station.stationName}</div>
                    <div class="station-time">${formatTime(station.time || station.arrivalTime)}</div>
                </div>
            </div>
        `).join('');
    } else if (route.stationIds && route.stationIds.length > 0) {
        // If we only have station IDs, generate a simple list
        return route.stationIds.map((stationId, index) => `
            <div class="timeline-item">
                <div class="timeline-marker ${index === 0 ? 'start' : (index === route.stationIds.length - 1 ? 'end' : '')}"></div>
                <div class="timeline-content">
                    <div class="station-name">Station ${stationId}</div>
                </div>
            </div>
        `).join('');
    } else {
        return '<div>No station information available</div>';
    }
}

/**
 * Calculate number of stations in a route
 */
function calculateStationCount(route) {
    if (route.stations && route.stations.length) return route.stations.length;
    if (route.stationIds && route.stationIds.length) return route.stationIds.length;
    return 0;
}

/**
 * Formats time from ISO string to readable format
 * @param {string} isoString - ISO formatted date/time string
 * @returns {string} - Formatted time string (e.g., "06:00 AM")
 */
function formatTime(isoString) {
    if (!isoString) return "06:00 AM";
    
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
    } catch (e) {
        console.error('Error formatting time:', e);
        return "06:00 AM";
    }
}

/**
 * Gets the first station name from a metro line
 * @param {Object} metroLine - Metro line object
 * @returns {string} - First station name or default text
 */
function getFirstStationName(metroLine) {
    if (metroLine.stations && metroLine.stations.length > 0) {
        return metroLine.stations[0].stationName || metroLine.stations[0].name || "Start Station";
    }
    if (metroLine.stationIds && metroLine.stationIds.length > 0) {
        return `Station ${metroLine.stationIds[0]}`;
    }
    return "First Station";
}

/**
 * Gets the last station name from a metro line
 * @param {Object} metroLine - Metro line object
 * @returns {string} - Last station name or default text
 */
function getLastStationName(metroLine) {
    if (metroLine.stations && metroLine.stations.length > 0) {
        const lastIndex = metroLine.stations.length - 1;
        return metroLine.stations[lastIndex].stationName || metroLine.stations[lastIndex].name || "End Station";
    }
    if (metroLine.stationIds && metroLine.stationIds.length > 0) {
        const lastIndex = metroLine.stationIds.length - 1;
        return `Station ${metroLine.stationIds[lastIndex]}`;
    }
    return "Last Station";
}

/**
 * Generates HTML for the station list
 * @param {Object} metroLine - Metro line object
 * @returns {string} - HTML string for station list
 */
function generateStationList(metroLine) {
    if (metroLine.stations && metroLine.stations.length > 0) {
        // If we have full station objects
        return metroLine.stations.map((station, index) => {
            const isFirst = index === 0;
            const isLast = index === metroLine.stations.length - 1;
            const stationClass = isFirst ? 'start-station' : (isLast ? 'end-station' : 'station');
            
            // Calculate estimated time based on total duration divided by stations
            const estimatedMinutesPerStation = metroLine.totalDuration / (metroLine.stations.length - 1);
            const departureTime = new Date(metroLine.firstDeparture);
            if (departureTime && !isNaN(departureTime)) {
                departureTime.setMinutes(departureTime.getMinutes() + (index * estimatedMinutesPerStation));
            }
            
            return `
                <div class="${stationClass}">
                    <div class="station-marker"></div>
                    <div class="station-info">
                        <div class="station-name">${station.stationName || station.name}</div>
                        <div class="station-time">${isFirst ? 'Departure: ' : (isLast ? 'Arrival: ' : '')}${
                            formatTime(departureTime)
                        }</div>
                    </div>
                </div>
            `;
        }).join('');
    } else if (metroLine.stationIds && metroLine.stationIds.length > 0) {
        // If we only have station IDs
        return metroLine.stationIds.map((stationId, index) => {
            const isFirst = index === 0;
            const isLast = index === metroLine.stationIds.length - 1;
            const stationClass = isFirst ? 'start-station' : (isLast ? 'end-station' : 'station');
            
            return `
                <div class="${stationClass}">
                    <div class="station-marker"></div>
                    <div class="station-info">
                        <div class="station-name">Station ${stationId}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        return '<div class="alert alert-warning">Station information unavailable</div>';
    }
}

/**
 * Generates HTML for upcoming trips
 * @param {Object} metroLine - Metro line object
 * @returns {string} - HTML string for upcoming trips
 */
function generateUpcomingTrips(metroLine) {
    if (!metroLine.firstDeparture) {
        return '';
    }
    
    const firstDeparture = new Date(metroLine.firstDeparture);
    if (isNaN(firstDeparture)) {
        return '';
    }
    
    const frequency = parseInt(metroLine.frequencyMinutes || "10");
    const trips = [];
    
    // Generate the next 3 trips
    for (let i = 0; i < 3; i++) {
        const departureTime = new Date(firstDeparture);
        departureTime.setMinutes(departureTime.getMinutes() + (i * frequency));
        
        const arrivalTime = new Date(departureTime);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + metroLine.totalDuration);
        
        trips.push({
            departure: formatTime(departureTime),
            arrival: formatTime(arrivalTime)
        });
    }
    
    return `
        <div class="upcoming-trips mt-4">
            <h5>Upcoming Trips</h5>
            <p>Next 3 departures from ${getFirstStationName(metroLine)} Station:</p>
            <div class="trip-cards">
                ${trips.map(trip => `
                    <div class="trip-card">
                        <div class="departure-time">${trip.departure}</div>
                        <div class="trip-info">
                            <div>${getFirstStationName(metroLine)} → ${getLastStationName(metroLine)}</div>
                            <div class="small text-muted">Arrives: ${trip.arrival}</div>
                        </div>
                        <a href="#" class="btn btn-sm btn-outline-primary book-btn">Book</a>
                    </div>
                `).join('')}
            </div>
            <div class="text-center mt-3">
                <button class="btn btn-sm btn-secondary">Load More Trips</button>
            </div>
        </div>
    `;
}

/**
 * Adds a route to the user's cart
 * @param {Object} route - Route object to add to cart
 */
function addRouteToCart(route) {
    // Check if user is logged in
    const isLoggedIn = checkIfLoggedIn();
    
    if (!isLoggedIn) {
        if (confirm('You need to sign in to book tickets. Would you like to sign in now?')) {
            window.location.href = 'signin.html';
        }
        return;
    }
    
    // Add to cart logic
    // This would typically involve a call to your backend to add the route to the user's cart
    
    alert(`Added route from ${getFirstStationName(route)} to ${getLastStationName(route)} at ${formatTime(route.departureTime || route.firstDeparture)} to your cart.`);
    
    // Update cart badge
    updateCartBadge();
}

/**
 * Simple function to check if user is logged in
 * You should replace this with your actual authentication check
 */
function checkIfLoggedIn() {
    // This is a placeholder - implement your actual login check here
    return sessionStorage.getItem('jwtToken') !== null;
}

/**
 * Updates cart badge count
 */
function updateCartBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) {
        // This is placeholder logic - implement your actual cart count logic
        const count = parseInt(badge.textContent || '0');
        badge.textContent = count + 1;
        badge.style.display = 'inline-block';
    }
}

/**
 * Updates UI navigation based on authentication status
 * @param {boolean} isAuthenticated - Whether user is logged in
 */
function updateNavigation(isAuthenticated) {
    const authMenu = document.querySelector('.auth-menu');
    const guestMenu = document.querySelector('.guest-menu');
    
    if (authMenu && guestMenu) {
        if (isAuthenticated) {
            authMenu.style.display = 'flex';
            guestMenu.style.display = 'none';
        } else {
            authMenu.style.display = 'none';
            guestMenu.style.display = 'flex';
        }
    }
}

// =====================================================
// EVENT HANDLERS AND INITIALIZATION
// =====================================================

/**
 * Initializes the page when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isAuthenticated = checkIfLoggedIn();
    
    // Update UI based on authentication status
    updateNavigation(isAuthenticated);

    // Update cart badge if authenticated
    if (isAuthenticated) {
        updateCartBadge();
    }
    
    // Set current date and time as default for travel time input
    const travelTimeInput = document.getElementById('travel-time');
    if (travelTimeInput) {
        const now = new Date();
        // Format: YYYY-MM-DDThh:mm
        const formattedDate = now.toISOString().substring(0, 16);
        travelTimeInput.value = formattedDate;
    }
    
    // Initialize search form
    initSearchForm();
    
    // Fetch metro lines from OPWA API
    fetchMetroLines();
    
    // Initialize ticket type buttons
    initTicketButtons(isAuthenticated);
});

/**
 * Initializes the search form with event listeners
 */
function initSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fromStation = document.getElementById('from-station').value;
        const toStation = document.getElementById('to-station').value;
        const travelTime = document.getElementById('travel-time').value;
        
        if (!fromStation || !toStation) {
            alert('Please select both departure and arrival stations.');
            return;
        }
        
        // Show loading state
        const submitBtn = searchForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...';
        
        // Search for routes
        searchMetroRoutes(fromStation, toStation, travelTime)
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });
}

/**
 * Initializes ticket type buttons with event listeners
 * @param {boolean} isAuthenticated - Whether user is logged in
 */
function initTicketButtons(isAuthenticated) {
    const ticketSelectBtns = document.querySelectorAll('.ticket-type button');
    ticketSelectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketType = this.closest('.ticket-type').querySelector('h5').textContent;
            
            if (isAuthenticated) {
                // If logged in, add to cart or proceed to purchase
                alert(`Added ${ticketType} to your cart.`);
                updateCartBadge();
            } else {
                // If not logged in, prompt to sign in
                if (confirm(`You need to sign in to purchase a ${ticketType}. Would you like to sign in now?`)) {
                    window.location.href = 'signin.html';
                }
            }
        });
    });
}