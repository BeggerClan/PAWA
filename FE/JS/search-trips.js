// File: search-trips.js - Using full-details API for trip search

document.addEventListener('DOMContentLoaded', function() {
    // Fetch metro lines to populate the search form
    fetchMetroLinesForSearch();
    
    // Set up search form submission handler
    const searchForm = document.getElementById('trip-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchTrips();
        });
    }
    
    // Set current date and time as default values
    setDefaultDateTime();
});

/**
 * Fetches metro lines and stations to populate the search form dropdowns
 */
async function fetchMetroLinesForSearch() {
    const fromStationSelect = document.getElementById('from-station');
    const toStationSelect = document.getElementById('to-station');
    
    if (!fromStationSelect || !toStationSelect) return;
    
    try {
        // Clear existing options except the placeholder
        clearSelectOptions(fromStationSelect);
        clearSelectOptions(toStationSelect);
        
        // Fetch metro lines from OPWA API
        const response = await fetch('http://localhost:8081/api/metro-lines/full-details');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch metro lines: ${response.status}`);
        }
        
        const metroLines = await response.json();
        console.log('Fetched metro lines:', metroLines);
        
        // Process all stations from all lines
        const allStations = [];
        
        metroLines.forEach(line => {
            if (line.stations && line.stations.length > 0) {
                line.stations.forEach(station => {
                    // Check if station already exists in our list to avoid duplicates
                    if (!allStations.some(s => s.id === station.stationId)) {
                        allStations.push({
                            id: station.stationId,
                            name: station.stationName,
                            line: line.lineName
                        });
                    }
                });
            }
        });
        
        // Sort stations alphabetically
        allStations.sort((a, b) => a.name.localeCompare(b.name));
        
        // Add stations to both dropdowns
        allStations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = `${station.name} (${station.line})`;
            
            fromStationSelect.appendChild(option.cloneNode(true));
            toStationSelect.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error fetching metro lines for search:', error);
        showSearchError('Unable to load stations. Please try again later.');
    }
}

/**
 * Clears all options from a select element except the first one (placeholder)
 * @param {HTMLSelectElement} selectElement - The select element to clear
 */
function clearSelectOptions(selectElement) {
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
}

/**
 * Sets the current date and time as default values for the search form
 */
function setDefaultDateTime() {
    const dateInput = document.getElementById('departure-date');
    const timeInput = document.getElementById('departure-time');
    
    if (dateInput && timeInput) {
        const now = new Date();
        
        // Format date as YYYY-MM-DD for input
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
        
        // Format time as HH:MM for input
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
    }
}

/**
 * Searches for trips based on form inputs using the full metro line details
 */
async function searchTrips() {
    const fromStationId = document.getElementById('from-station').value;
    const toStationId = document.getElementById('to-station').value;
    const departureDateStr = document.getElementById('departure-date').value;
    const departureTimeStr = document.getElementById('departure-time').value;
    
    // Validate inputs
    if (!fromStationId || !toStationId || !departureDateStr || !departureTimeStr) {
        showSearchError('Please fill in all fields');
        return;
    }
    
    // Check if from and to stations are the same
    if (fromStationId === toStationId) {
        showSearchError('From and To stations cannot be the same');
        return;
    }
    
    const resultsContainer = document.getElementById('search-results');
    
    try {
        // Show loading state
        resultsContainer.innerHTML = `
            <div class="text-center my-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading trips...</span>
                </div>
                <p class="mt-2">Searching for available trips...</p>
            </div>
        `;
        
        // Parse the departure date and time
        const departureDate = new Date(departureDateStr);
        const [hours, minutes] = departureTimeStr.split(':').map(Number);
        departureDate.setHours(hours, minutes, 0, 0);
        
        // Fetch all metro line details
        const response = await fetch('http://localhost:8081/api/metro-lines/full-details');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch metro line details: ${response.status}`);
        }
        
        const metroLines = await response.json();
        
        // Get station information for display purposes
        const fromStation = findStationById(metroLines, fromStationId);
        const toStation = findStationById(metroLines, toStationId);
        
        if (!fromStation || !toStation) {
            throw new Error('One or both stations not found in any metro line');
        }
        
        // Find all possible trips between these stations
        const applicableTrips = findApplicableTrips(metroLines, fromStationId, toStationId, departureDate);
        
        // Display search results
        displayTripResults(applicableTrips, fromStation, toStation, departureDate);
        
    } catch (error) {
        console.error('Error searching trips:', error);
        resultsContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Unable to search for trips. Please try again later.
                <br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

/**
 * Find a station by its ID across all metro lines
 * @param {Array} metroLines - All metro lines data
 * @param {string} stationId - The station ID to find
 * @returns {Object|null} The station object or null if not found
 */
function findStationById(metroLines, stationId) {
    for (const line of metroLines) {
        if (line.stations && line.stations.length > 0) {
            const station = line.stations.find(s => s.stationId === stationId);
            if (station) {
                return {
                    ...station,
                    lineName: line.lineName,
                    lineId: line.lineId
                };
            }
        }
    }
    return null;
}

/**
 * Find applicable trips between two stations around a specified departure time
 * @param {Array} metroLines - All metro lines data
 * @param {string} fromStationId - Departure station ID
 * @param {string} toStationId - Arrival station ID
 * @param {Date} departureDate - The desired departure date and time
 * @returns {Array} Array of applicable trip objects
 */
function findApplicableTrips(metroLines, fromStationId, toStationId, departureDate) {
    const applicableTrips = [];
    
    // Get date components for checking
    const desiredDepartureTime = departureDate.getHours() * 60 + departureDate.getMinutes(); // in minutes since midnight
    
    for (const line of metroLines) {
        // Skip inactive or suspended lines
        if (!line.active || line.suspended) continue;
        
        // Check if both stations are on this line
        const fromStationIndex = line.stationIds.indexOf(fromStationId);
        const toStationIndex = line.stationIds.indexOf(toStationId);
        
        // If both stations are on this line and in correct order (from before to)
        if (fromStationIndex !== -1 && toStationIndex !== -1 && fromStationIndex < toStationIndex) {
            if (!line.trips || line.trips.length === 0) {
                console.log(`Line ${line.lineName} has no trips defined`);
                continue;
            }
            
            const possibleTrips = [];
            
            // Find all trips that serve these stations
            for (const trip of line.trips) {
                // Skip return trips (typically go in the opposite direction)
                if (trip.returnTrip) continue;
                
                if (!trip.segments || trip.segments.length === 0) {
                    console.log(`Trip ${trip.tripId} has no segments defined`);
                    continue;
                }
                
                // Find segments that cover our stations
                let fromSegment = null;
                let toSegment = null;
                
                for (const segment of trip.segments) {
                    if (segment.fromStationId === fromStationId) {
                        fromSegment = segment;
                    }
                    if (segment.toStationId === toStationId) {
                        toSegment = segment;
                    }
                }
                
                if (fromSegment && toSegment) {
                    // Parse departure time for comparison
                    const [tripHours, tripMinutes] = fromSegment.departureTime.split(':').map(Number);
                    const tripDepartureTimeMinutes = tripHours * 60 + tripMinutes;
                    
                    // Calculate how far ahead this trip is from desired departure
                    const minutesAhead = (tripDepartureTimeMinutes >= desiredDepartureTime) 
                        ? tripDepartureTimeMinutes - desiredDepartureTime 
                        : (24 * 60) - desiredDepartureTime + tripDepartureTimeMinutes; // Trip is next day
                    
                    possibleTrips.push({
                        trip: trip,
                        fromSegment: fromSegment,
                        toSegment: toSegment,
                        departureTime: fromSegment.departureTime,
                        arrivalTime: toSegment.arrivalTime,
                        minutesAhead: minutesAhead,
                        lineName: line.lineName
                    });
                }
            }
            
            // Add trips from this line to our collection
            applicableTrips.push(...possibleTrips);
        }
    }
    
    // Sort by how close they are to desired departure time
    applicableTrips.sort((a, b) => a.minutesAhead - b.minutesAhead);
    
    return applicableTrips;
}

/**
 * Displays trip search results
 * @param {Array} trips - Array of applicable trip objects
 * @param {Object} fromStation - Departure station object
 * @param {Object} toStation - Arrival station object
 * @param {Date} departureDate - The desired departure date
 */
function displayTripResults(trips, fromStation, toStation, departureDate) {
    const resultsContainer = document.getElementById('search-results');
    
    // Format date for display
    const displayDate = formatDateForDisplay(departureDate);
    const fromStationName = fromStation.stationName;
    const toStationName = toStation.stationName;
    
    if (!trips || trips.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                No trips found from ${fromStationName} to ${toStationName} on ${displayDate}.
                <p class="mb-0 mt-2">Try a different time or date, or choose different stations.</p>
                <p class="mt-2"><a href="#" id="try-different-time" class="alert-link">Try a different time or check another departure window</a></p>
            </div>
        `;
        
        // Add event listener for the suggestion link
        setTimeout(() => {
            const tryDifferentTimeLink = document.getElementById('try-different-time');
            if (tryDifferentTimeLink) {
                tryDifferentTimeLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Set time to 6:00 AM or another common departure time
                    document.getElementById('departure-time').value = '06:00';
                    searchTrips();
                });
            }
        }, 0);
        
        return;
    }
    
    // Get the initial 3 trips to display
    const initialTrips = trips.slice(0, 3);
    const remainingTrips = trips.slice(3);
    
    // Create results header
    let resultsHTML = `
        <div class="trip-results-header">
            <h3><i class="fas fa-subway me-2"></i> ${fromStationName} to ${toStationName}</h3>
            <p class="lead">Trips on ${displayDate}</p>
        </div>
    `;
    
    // Add trip cards for the first 3 trips
    resultsHTML += `<div class="trip-cards" id="trip-cards">`;
    initialTrips.forEach(tripInfo => {
        resultsHTML += createTripCard(tripInfo, fromStation, toStation);
    });
    resultsHTML += `</div>`;
    
    // Add load more button if there are more trips
    if (remainingTrips.length > 0) {
        resultsHTML += `
            <div class="text-center mt-4 mb-4">
                <button id="load-more-btn" class="btn btn-primary">
                    <i class="fas fa-sync-alt me-2"></i>Load More Trips
                </button>
            </div>
        `;
    }
    
    // Update the results container
    resultsContainer.innerHTML = resultsHTML;
    
    // Add event listener to the load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreTrips(remainingTrips, fromStation, toStation);
        });
    }
}

/**
 * Creates HTML for a trip card
 * @param {Object} tripInfo - Trip information object
 * @param {Object} fromStation - Departure station object
 * @param {Object} toStation - Arrival station object
 * @returns {string} HTML for the trip card
 */
function createTripCard(tripInfo, fromStation, toStation) {
    const departureTime = tripInfo.departureTime;
    const arrivalTime = tripInfo.arrivalTime;
    
    // Format times for display
    const formattedDepartureTime = formatTimeForDisplay(departureTime);
    const formattedArrivalTime = formatTimeForDisplay(arrivalTime);
    
    // Calculate duration
    const durationMinutes = calculateDurationMinutes(departureTime, arrivalTime);
    
    return `
        <div class="trip-card">
            <div class="trip-card-header">
                <div class="trip-line-badge">${tripInfo.lineName}</div>
                <div class="trip-time">
                    <div class="departure-time">${formattedDepartureTime}</div>
                    <div class="trip-duration">${durationMinutes} mins</div>
                    <div class="arrival-time">${formattedArrivalTime}</div>
                </div>
            </div>
            <div class="trip-card-body">
                <div class="trip-stations">
                    <div class="station-marker start"></div>
                    <div class="station-line"></div>
                    <div class="station-marker end"></div>
                </div>
                <div class="trip-details">
                    <div class="trip-stations-names">
                        <div>${fromStation.stationName}</div>
                        <div>${toStation.stationName}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-primary view-details-btn" data-trip-id="${tripInfo.trip.tripId}">
                        <i class="fas fa-info-circle me-1"></i>Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Loads more trips when the load more button is clicked
 * @param {Array} remainingTrips - Array of remaining trip objects
 * @param {Object} fromStation - Departure station object
 * @param {Object} toStation - Arrival station object
 */
function loadMoreTrips(remainingTrips, fromStation, toStation) {
    // Get the trips container
    const tripCards = document.getElementById('trip-cards');
    
    // Get the load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // Show loading state
    loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
    loadMoreBtn.disabled = true;
    
    // Get the next 3 trips (or fewer if less than 3 remain)
    const nextBatch = remainingTrips.splice(0, 3);
    
    // Add the new trip cards
    nextBatch.forEach(tripInfo => {
        const tripCardHTML = createTripCard(tripInfo, fromStation, toStation);
        tripCards.insertAdjacentHTML('beforeend', tripCardHTML);
    });
    
    // Update or remove load more button
    if (remainingTrips.length > 0) {
        loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Load More Trips';
        loadMoreBtn.disabled = false;
    } else {
        loadMoreBtn.parentElement.remove();
    }
    
    // Add animation class to new cards
    const newCards = tripCards.querySelectorAll('.trip-card:nth-last-child(-n+3)');
    newCards.forEach(card => {
        card.classList.add('fade-in');
    });
}

/**
 * Shows an error message for the search form
 * @param {string} message - Error message to display
 */
function showSearchError(message) {
    const errorDiv = document.getElementById('search-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Formats a time string for display
 * @param {string} timeString - Time string in HH:MM:SS format
 * @returns {string} Formatted time string (HH:MM AM/PM)
 */
function formatTimeForDisplay(timeString) {
    if (!timeString) return 'N/A';
    
    // Extract hours and minutes from the time string
    const timeParts = timeString.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    
    // Convert to 12-hour format with AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes} ${period}`;
}

/**
 * Formats a date string for display
 * @param {Date} date - Date object
 * @returns {string} Formatted date string (e.g., Mon. 03 March 2025)
 */
function formatDateForDisplay(date) {
    if (!date) return 'Today';
    
    const options = { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Calculates duration in minutes between two time strings
 * @param {string} startTime - Start time string in HH:MM:SS format
 * @param {string} endTime - End time string in HH:MM:SS format
 * @returns {number} Duration in minutes
 */
function calculateDurationMinutes(startTime, endTime) {
    if (!startTime || !endTime) return 0;
    
    // Parse the time strings
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    // Convert to minutes since midnight
    const startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;
    
    // Handle trips that cross midnight
    if (endTotalMinutes < startTotalMinutes) {
        endTotalMinutes += 24 * 60; // Add a day's worth of minutes
    }
    
    return endTotalMinutes - startTotalMinutes;
}