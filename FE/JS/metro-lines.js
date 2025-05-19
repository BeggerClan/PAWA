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
        // Fetch metro lines from OPWA API
        const response = await fetch('http://localhost:8080/api/metro-lines/get-all-metro-lines', {
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
        
        // Call the OPWA API for searching routes
        const response = await fetch(`http://localhost:8080/api/metro-lines/search?${params}`, {
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
    
    if (metroLines.length === 0) {
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
                                <td>10:00 PM</td>
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
    
    if (routes.length === 0) {
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
                                <div class="duration"><i class="fas fa-clock"></i> ${route.durationMinutes} min</div>
                                <div class="arrival">${formatTime(route.arrivalTime)}</div>
                            </div>
                            <div class="route-line">${route.lineName}</div>
                        </div>
                        <div class="route-stations">
                            <div class="from-station">${route.fromStation}</div>
                            <div class="route-path">
                                <div class="path-line"></div>
                                <div class="stations-count">${route.stationsCount} stations</div>
                            </div>
                            <div class="to-station">${route.toStation}</div>
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
        document.querySelector('.card.search-card').after(resultsContainer);
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
                                    <div class="value">${route.durationMinutes} min</div>
                                </div>
                                <div class="time-item">
                                    <div class="label">Arrival</div>
                                    <div class="value">${formatTime(route.arrivalTime)}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="station-timeline">
                            ${route.stations && route.stations.map((station, index) => `
                                <div class="timeline-item">
                                    <div class="timeline-marker ${index === 0 ? 'start' : (index === route.stations.length - 1 ? 'end' : '')}"></div>
                                    <div class="timeline-content">
                                        <div class="station-name">${station.name}</div>
                                        <div class="station-time">${formatTime(station.time)}</div>
                                    </div>
                                </div>
                            `).join('') || '<div>No station information available</div>'}
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
        return metroLine.stations[0].stationName;
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
        return metroLine.stations[metroLine.stations.length - 1].stationName;
    }
    return "Last Station";
}

/**
 * Generates HTML for the station list
 * @param {Object} metroLine - Metro line object
 * @returns {string} - HTML string for station list
 */
function generateStationList(metroLine) {
    if (!metroLine.stations || metroLine.stations.length === 0) {
        return '<div class="alert alert-warning">Station information unavailable</div>';
    }
    
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
                    <div class="station-name">${station.stationName}</div>
                    <div class="station-time">${isFirst ? 'Departure: ' : (isLast ? 'Arrival: ' : '')}${
                        formatTime(departureTime)
                    }</div>
                </div>
            </div>
        `;
    }).join('');
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
    if (!isLoggedIn()) {
        if (confirm('You need to sign in to book tickets. Would you like to sign in now?')) {
            window.location.href = 'signin.html';
        }
        return;
    }
    
    // Add to cart logic
    // This would typically involve a call to your backend to add the route to the user's cart
    
    alert(`Added route from ${route.fromStation} to ${route.toStation} at ${formatTime(route.departureTime)} to your cart.`);
    
    // Update cart badge
    updateCartBadge();
}

// =====================================================
// EVENT HANDLERS AND INITIALIZATION
// =====================================================

/**
 * Initializes the page when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth utilities
    const isAuthenticated = initAuth();
    
    // Update UI based on authentication status
    updateNavigation(isAuthenticated);

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
            } else {
                // If not logged in, prompt to sign in
                if (confirm(`You need to sign in to purchase a ${ticketType}. Would you like to sign in now?`)) {
                    window.location.href = 'signin.html';
                }
            }
        });
    });
}

// TICKET TYPE
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderTicketTypes();
  updateCartBadge();
});

document.addEventListener('DOMContentLoaded', fetchAndRenderTicketTypes);

async function fetchAndRenderTicketTypes() {
  const container = document.querySelector('.ticket-types');
  if (!container) return;

  try {
    const response = await fetch('http://localhost:8080/api/ticket-types', {
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Status ${response.status}: ${text}`);
    }

    const ticketTypes = await response.json();
    container.innerHTML = ''; // Clear loading text

    ticketTypes.forEach(ticket => {
      const card = document.createElement('div');
      card.className = 'ticket-type mb-4';

      card.innerHTML = `
        <h5>${ticket.displayName}</h5>
        <p>Valid for ${ticket.validityDurationHours} hours after ${ticket.validFrom.toLowerCase()}.</p>
        <div class="d-flex justify-content-between align-items-center">
          <div><strong>${ticket.price.toLocaleString('vi-VN')}đ</strong></div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm add-to-cart-btn">
            <i class="fas fa-cart-plus"></i>
            </button>

            <button class="btn btn-outline-success btn-sm" disabled>
              Purchase
            </button>
          </div>
        </div>
      `;

    container.appendChild(card);

    const addBtn = card.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => addToCart(ticket));
    });

  } catch (error) {
    console.error('Error fetching ticket types:', error);
    container.innerHTML = `<p class="text-danger">Unable to load ticket types. (${error.message})</p>`;
  }
}


// Add to cart
function addToCart(ticket) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const index = cart.findIndex(item => item.code === ticket.code);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({
      code: ticket.code,
      name: ticket.displayName,
      price: ticket.price,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update all elements with class 'cart-count'
  document.querySelectorAll('.cart-count').forEach(badge => {
    badge.textContent = totalQty;
  });
}

