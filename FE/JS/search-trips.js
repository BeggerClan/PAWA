// js/search-trips.js - Enhanced trip search functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize station dropdowns
    populateStationDropdowns();
    
    // Set default date and time values
    setDefaultDateAndTime();
    
    // Add event listener to the search form
    const searchForm = document.getElementById('trip-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleTripSearch);
    }
});

/**
 * Populates the From Station and To Station dropdowns with station data
 */
async function populateStationDropdowns() {
    try {
        // Fetch all metro lines and their stations from the API
        const response = await fetch('http://localhost:8081/api/metro-lines/full-details');
        if (!response.ok) {
            throw new Error('Failed to fetch station data');
        }
        
        const metroLines = await response.json();
        const fromSelect = document.getElementById('from-station');
        const toSelect = document.getElementById('to-station');
        
        if (!fromSelect || !toSelect) return;
        
        // Clear existing options except the first one
        fromSelect.innerHTML = '<option value="">Select departure station</option>';
        toSelect.innerHTML = '<option value="">Select arrival station</option>';
        
        // Process all stations from all lines
        const processedStations = new Set(); // To track unique stations
        
        metroLines.forEach(line => {
            if (line.stations && line.stations.length > 0) {
                // Create an optgroup for each line
                const fromGroup = document.createElement('optgroup');
                fromGroup.label = line.lineName;
                
                const toGroup = document.createElement('optgroup');
                toGroup.label = line.lineName;
                
                line.stations.forEach(station => {
                    const stationKey = station.stationId + '-' + station.stationName;
                    
                    // Only add if we haven't seen this station yet
                    if (!processedStations.has(stationKey)) {
                        processedStations.add(stationKey);
                        
                        // Create option elements for both dropdowns
                        const fromOption = document.createElement('option');
                        fromOption.value = JSON.stringify({
                            id: station.stationId,
                            name: station.stationName,
                            line: line.lineId,
                            lineName: line.lineName
                        });
                        fromOption.textContent = `${station.stationName} (${line.lineName})`;
                        fromGroup.appendChild(fromOption);
                        
                        const toOption = document.createElement('option');
                        toOption.value = JSON.stringify({
                            id: station.stationId,
                            name: station.stationName,
                            line: line.lineId,
                            lineName: line.lineName
                        });
                        toOption.textContent = `${station.stationName} (${line.lineName})`;
                        toGroup.appendChild(toOption);
                    }
                });
                
                if (fromGroup.children.length > 0) {
                    fromSelect.appendChild(fromGroup);
                    toSelect.appendChild(toGroup);
                }
            }
        });
    } catch (error) {
        console.error('Error loading stations:', error);
        // Show error message
        const searchError = document.getElementById('search-error');
        if (searchError) {
            searchError.textContent = 'Unable to load stations. Please try again later.';
            searchError.style.display = 'block';
        }
    }
}

/**
 * Sets default date and time values for the search form
 */
function setDefaultDateAndTime() {
    const dateInput = document.getElementById('departure-date');
    const timeInput = document.getElementById('departure-time');
    
    if (dateInput) {
        // Set today's date as default
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }
    
    if (timeInput) {
        // Set current time as default
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
    }
}

/**
 * Handles the trip search form submission
 * @param {Event} e - The form submit event
 */
async function handleTripSearch(e) {
    e.preventDefault();
    
    // Get form values
    const fromStationJSON = document.getElementById('from-station').value;
    const toStationJSON = document.getElementById('to-station').value;
    const departureDate = document.getElementById('departure-date').value;
    const departureTime = document.getElementById('departure-time').value;
    
    const searchResults = document.getElementById('search-results');
    const searchError = document.getElementById('search-error');
    searchError.style.display = 'none';
    
    // Clear previous results and show loading
    searchResults.innerHTML = `
        <div class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Searching trips...</span>
            </div>
            <p class="mt-2">Searching available trips...</p>
        </div>
    `;
    
    // Validate inputs
    if (!fromStationJSON || !toStationJSON) {
        searchError.textContent = 'Please select both departure and arrival stations.';
        searchError.style.display = 'block';
        searchResults.innerHTML = '';
        return;
    }
    
    try {
        // Parse station data
        const fromStation = JSON.parse(fromStationJSON);
        const toStation = JSON.parse(toStationJSON);
        
        // Check if same station selected
        if (fromStation.id === toStation.id) {
            searchError.textContent = 'Departure and arrival stations cannot be the same.';
            searchError.style.display = 'block';
            searchResults.innerHTML = '';
            return;
        }
        
        // Format time for API
        const formattedTime = departureTime + ":00";
        
        // Call API to search for trips
        const response = await fetch(`http://localhost:8081/api/metro-lines/search-trips?fromStationId=${fromStation.id}&toStationId=${toStation.id}&approximateTime=${formattedTime}`);
        
        if (!response.ok) {
            throw new Error(`Error searching for trips: ${response.status}`);
        }
        
        const trips = await response.json();
        
        // Display results
        displayTripResults(trips, fromStation, toStation, departureDate);
        
    } catch (error) {
        console.error('Error searching for trips:', error);
        searchResults.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to search for trips. Please try again later.
                <small class="d-block mt-1">${error.message}</small>
            </div>
        `;
    }
}

/**
 * Displays the trip search results
 * @param {Array} trips - Array of trip objects
 * @param {Object} fromStation - Departure station info
 * @param {Object} toStation - Arrival station info
 * @param {string} departureDate - The selected departure date
 */
function displayTripResults(trips, fromStation, toStation, departureDate) {
    const searchResults = document.getElementById('search-results');
    
    // Format the date for display
    const formattedDate = new Date(departureDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // If no trips found
    if (!trips || trips.length === 0) {
        searchResults.innerHTML = `
            <div class="alert alert-info bg-dark text-light border-primary">
                <i class="fas fa-info-circle me-2"></i>
                <strong>No trips found between ${fromStation.name} and ${toStation.name} on ${formattedDate}.</strong>
                <p class="m-0 mt-2">Try a different time or date, or check another departure time.</p>
            </div>
        `;
        return;
    }
    
    // Display trip results header
    searchResults.innerHTML = `
        <div class="search-results-header mb-4">
            <h3>
                <i class="fas fa-subway me-2"></i>
                ${fromStation.name} to ${toStation.name}
            </h3>
            <p class="lead">Trips on ${formattedDate}</p>
        </div>
        <div class="search-results-container" id="trips-container"></div>
    `;
    
    const tripsContainer = document.getElementById('trips-container');
    
    // Sort trips by departure time
    trips.sort((a, b) => {
        return new Date('2000-01-01T' + a.departureTime) - new Date('2000-01-01T' + b.departureTime);
    });
    
    // Display the first three trips
    const tripsToShow = trips.slice(0, 3);
    
    tripsToShow.forEach(trip => {
        // Format times
        const departureTime = formatTime(trip.departureTime);
        const arrivalTime = formatTime(trip.arrivalTime);
        
        // Find the relevant segments for this trip
        let relevantSegment = null;
        
        if (trip.segments) {
            trip.segments.forEach(segment => {
                if (segment.fromStationId === fromStation.id && segment.toStationId === toStation.id) {
                    relevantSegment = segment;
                }
            });
        }
        
        // Create trip card
        const tripCard = document.createElement('div');
        tripCard.className = 'trip-card';
        
        tripCard.innerHTML = `
            <div class="trip-header">
                <span class="trip-line-badge">${fromStation.lineName}</span>
                <div class="trip-times">
                    <div class="trip-departure">
                        <strong>${departureTime}</strong>
                        <div>${fromStation.name}</div>
                    </div>
                    <div class="trip-duration">
                        <div class="trip-duration-line"></div>
                        <div class="trip-duration-time">${relevantSegment ? relevantSegment.durationMinutes : trip.totalDuration || '45'} min</div>
                    </div>
                    <div class="trip-arrival">
                        <strong>${arrivalTime}</strong>
                        <div>${toStation.name}</div>
                    </div>
                </div>
            </div>
            <div class="trip-footer">
                <button class="btn btn-primary book-trip-btn">
                    <i class="fas fa-ticket-alt me-2"></i>Book This Trip
                </button>
            </div>
        `;
        
        // Add event listener to book button
        const bookButton = tripCard.querySelector('.book-trip-btn');
        bookButton.addEventListener('click', () => {
            // Either redirect to ticket purchase page or add to cart
            const tripInfo = {
                fromStation: fromStation.name,
                toStation: toStation.name,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                lineId: fromStation.line,
                lineName: fromStation.lineName,
                tripId: trip.tripId,
                departureDate: departureDate
            };
            
            // Store in sessionStorage to retrieve on ticket page
            sessionStorage.setItem('selectedTrip', JSON.stringify(tripInfo));
            
            // Redirect to ticket purchase page
            window.location.href = 'my-tickets.html';
        });
        
        tripsContainer.appendChild(tripCard);
    });
    
    // Add "Load More" button if there are more trips
    if (trips.length > 3) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'btn btn-outline-primary load-more-btn';
        loadMoreBtn.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Load More Trips';
        
        loadMoreBtn.addEventListener('click', () => {
            // Remove current load more button
            loadMoreBtn.remove();
            
            // Get the next set of trips
            const nextTrips = trips.slice(tripsContainer.querySelectorAll('.trip-card').length, 
                                         tripsContainer.querySelectorAll('.trip-card').length + 3);
            
            // Add the next batch of trips
            nextTrips.forEach(trip => {
                const departureTime = formatTime(trip.departureTime);
                const arrivalTime = formatTime(trip.arrivalTime);
                
                // Find the relevant segments for this trip
                let relevantSegment = null;
                if (trip.segments) {
                    trip.segments.forEach(segment => {
                        if (segment.fromStationId === fromStation.id && segment.toStationId === toStation.id) {
                            relevantSegment = segment;
                        }
                    });
                }
                
                const tripCard = document.createElement('div');
                tripCard.className = 'trip-card fade-in';
                
                tripCard.innerHTML = `
                    <div class="trip-header">
                        <span class="trip-line-badge">${fromStation.lineName}</span>
                        <div class="trip-times">
                            <div class="trip-departure">
                                <strong>${departureTime}</strong>
                                <div>${fromStation.name}</div>
                            </div>
                            <div class="trip-duration">
                                <div class="trip-duration-line"></div>
                                <div class="trip-duration-time">${relevantSegment ? relevantSegment.durationMinutes : trip.totalDuration || '45'} min</div>
                            </div>
                            <div class="trip-arrival">
                                <strong>${arrivalTime}</strong>
                                <div>${toStation.name}</div>
                            </div>
                        </div>
                    </div>
                    <div class="trip-footer">
                        <button class="btn btn-primary book-trip-btn">
                            <i class="fas fa-ticket-alt me-2"></i>Book This Trip
                        </button>
                    </div>
                `;
                
                const bookButton = tripCard.querySelector('.book-trip-btn');
                bookButton.addEventListener('click', () => {
                    const tripInfo = {
                        fromStation: fromStation.name,
                        toStation: toStation.name,
                        departureTime: departureTime,
                        arrivalTime: arrivalTime,
                        lineId: fromStation.line,
                        lineName: fromStation.lineName,
                        tripId: trip.tripId,
                        departureDate: departureDate
                    };
                    
                    sessionStorage.setItem('selectedTrip', JSON.stringify(tripInfo));
                    window.location.href = 'my-tickets.html';
                });
                
                tripsContainer.appendChild(tripCard);
            });
            
            // Add load more button again if there are still more trips
            if (tripsContainer.querySelectorAll('.trip-card').length < trips.length) {
                tripsContainer.appendChild(loadMoreBtn);
            }
        });
        
        tripsContainer.appendChild(loadMoreBtn);
    }
}

/**
 * Formats a time string from "HH:MM:SS" to "HH:MM AM/PM"
 * @param {string} timeString - Time string in format "HH:MM:SS"
 * @returns {string} - Formatted time string
 */
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    
    h = h % 12;
    h = h ? h : 12; // Handle midnight (0 hour)
    
    return `${h}:${m} ${ampm}`;
}