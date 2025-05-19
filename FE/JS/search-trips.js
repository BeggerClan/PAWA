// search-trips.js - Handles metro trip search functionality

document.addEventListener("DOMContentLoaded", function () {
  // Get all required form elements
  const fromStationSelect = document.getElementById("from-station");
  const toStationSelect = document.getElementById("to-station");
  const departureDate = document.getElementById("departure-date");
  const departureTime = document.getElementById("departure-time");
  const searchForm = document.getElementById("trip-search-form");
  const searchError = document.getElementById("search-error");
  const searchResults = document.getElementById("search-results");

  // Set today's date as the default departure date
  const today = new Date();
  const formattedDate = today.toISOString().substring(0, 10);
  if (departureDate) {
    departureDate.value = formattedDate;
  }

  // Set current time as the default departure time (rounded to nearest 15 min)
  const hours = today.getHours();
  const minutes = Math.ceil(today.getMinutes() / 15) * 15;
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = (minutes % 60).toString().padStart(2, "0");
  if (departureTime) {
    departureTime.value = `${formattedHours}:${formattedMinutes}`;
  }

  // Fetch metro lines with embedded station data to populate the dropdown selectors
  fetchMetroLinesWithStations();

  // Add event listener to search form
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      searchTrips();
    });
  }
});

/**
 * Fetches metro lines with stations from the API to populate dropdown menus
 */
async function fetchMetroLinesWithStations() {
  try {
    // Fetch metro lines with stations from full-details API
    const response = await fetch(
      "http://localhost:8081/api/metro-lines/full-details"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch metro lines: ${response.status}`);
    }

    const metroLines = await response.json();

    // Extract all stations from metro lines
    const allStations = extractStationsFromMetroLines(metroLines);

    // Populate the 'from' and 'to' station dropdowns
    populateStationDropdowns(allStations);

    // Store metro lines data for later use in trip search
    window.metroLinesData = metroLines;
  } catch (error) {
    console.error("Error fetching metro lines with stations:", error);
  }
}

/**
 * Extracts station data from metro lines
 * @param {Array} metroLines - List of metro line objects
 * @returns {Array} - List of station objects with line information
 */
function extractStationsFromMetroLines(metroLines) {
  const allStations = [];

  metroLines.forEach((line) => {
    if (line.stations && Array.isArray(line.stations)) {
      line.stations.forEach((station) => {
        // Add line information to each station
        allStations.push({
          ...station,
          lineName: line.lineName,
          lineId: line.lineId || line.id,
          mapMarker: line.lineName
            ? line.lineName.split(" ")[0].toLowerCase()
            : "default",
        });
      });
    }
  });

  // Remove duplicates based on stationId
  const uniqueStations = [];
  const seenIds = new Set();

  allStations.forEach((station) => {
    if (!seenIds.has(station.stationId)) {
      seenIds.add(station.stationId);
      uniqueStations.push(station);
    }
  });

  return uniqueStations;
}

/**
 * Populates station dropdown selectors with data
 * @param {Array} stations - List of station objects
 */
function populateStationDropdowns(stations) {
  const fromStationSelect = document.getElementById("from-station");
  const toStationSelect = document.getElementById("to-station");

  if (!fromStationSelect || !toStationSelect || !stations) return;

  // First, get all unique metro lines for grouping
  const metroLines = new Set();
  const stationsByLine = {};

  stations.forEach((station) => {
    if (station.mapMarker) {
      if (!metroLines.has(station.mapMarker)) {
        metroLines.add(station.mapMarker);
        stationsByLine[station.mapMarker] = [];
      }

      stationsByLine[station.mapMarker].push(station);
    }
  });

  // Clear existing options (except the first placeholder)
  while (fromStationSelect.options.length > 1) {
    fromStationSelect.remove(1);
  }

  while (toStationSelect.options.length > 1) {
    toStationSelect.remove(1);
  }

  // Add options, grouped by metro line
  metroLines.forEach((line) => {
    // Create option groups
    const lineLabel = line.charAt(0).toUpperCase() + line.slice(1) + " Line";

    const fromOptGroup = document.createElement("optgroup");
    fromOptGroup.label = lineLabel;

    const toOptGroup = document.createElement("optgroup");
    toOptGroup.label = lineLabel;

    // Add stations to the option groups
    stationsByLine[line].forEach((station) => {
      // Create options for 'from'
      const fromOption = document.createElement("option");
      fromOption.value = station.stationId;
      fromOption.textContent = station.stationName;
      fromOption.dataset.line = line;
      fromOptGroup.appendChild(fromOption);

      // Create options for 'to'
      const toOption = document.createElement("option");
      toOption.value = station.stationId;
      toOption.textContent = station.stationName;
      toOption.dataset.line = line;
      toOptGroup.appendChild(toOption);
    });

    // Add option groups to the selects
    fromStationSelect.appendChild(fromOptGroup);
    toStationSelect.appendChild(toOptGroup);
  });
}

/**
 * Searches for trips matching the user's criteria
 */
async function searchTrips() {
  const fromStationSelect = document.getElementById("from-station");
  const toStationSelect = document.getElementById("to-station");
  const departureDate = document.getElementById("departure-date");
  const departureTime = document.getElementById("departure-time");
  const searchError = document.getElementById("search-error");
  const searchResults = document.getElementById("search-results");

  if (
    !fromStationSelect ||
    !toStationSelect ||
    !departureDate ||
    !departureTime
  )
    return;

  // Get selected values
  const fromStation = fromStationSelect.value;
  const toStation = toStationSelect.value;
  const date = departureDate.value;
  const time = departureTime.value;

  // Validate inputs
  if (!fromStation || !toStation) {
    displaySearchError("Please select both departure and arrival stations.");
    return;
  }

  if (fromStation === toStation) {
    displaySearchError("Departure and arrival stations cannot be the same.");
    return;
  }

  if (!date || !time) {
    displaySearchError("Please specify both departure date and time.");
    return;
  }

  // Clear previous error and results
  if (searchError) searchError.style.display = "none";
  if (searchResults) searchResults.innerHTML = "";

  try {
    // Show loading state
    searchResults.innerHTML = `
            <div class="col-12 text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading trips...</span>
                </div>
                <p class="mt-2">Searching for available trips...</p>
            </div>
        `;

    // Check if we have metro lines data in memory
    if (!window.metroLinesData) {
      // If not, fetch it
      const response = await fetch(
        "http://localhost:8081/api/metro-lines/full-details"
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch metro lines: ${response.status}`);
      }

      window.metroLinesData = await response.json();
    }

    // Find trips that match the criteria
    const trips = findTripsFromMetroLines(
      window.metroLinesData,
      fromStation,
      toStation,
      time
    );

    // Display the search results
    displaySearchResults(trips, fromStation, toStation, date, time);
  } catch (error) {
    console.error("Error searching for trips:", error);
    displaySearchError(`Failed to search for trips: ${error.message}`);
  }
}

/**
 * Find trips from metro lines data
 * @param {Array} metroLines - Metro lines with trips data
 * @param {string} fromStationId - Departure station ID
 * @param {string} toStationId - Arrival station ID
 * @param {string} approximateTime - Departure time (HH:MM)
 * @returns {Array} - Matching trips
 */
function findTripsFromMetroLines(
  metroLines,
  fromStationId,
  toStationId,
  approximateTime
) {
  // Convert the target time to minutes for easier comparison
  const targetTimeMinutes = timeToMinutes(approximateTime);
  let matchingTrips = [];

  metroLines.forEach((line) => {
    // Skip inactive or suspended lines
    if (line.active === false || line.suspended === true) return;

    // Check if both stations are on this line
    const fromStationIndex = findStationIndexInLine(line, fromStationId);
    const toStationIndex = findStationIndexInLine(line, toStationId);

    // Skip if either station is not on this line
    if (fromStationIndex === -1 || toStationIndex === -1) return;

    // Generate trips for this line
    const lineTrips = generateTripsForLine(
      line,
      fromStationIndex,
      toStationIndex,
      targetTimeMinutes
    );

    // Add all found trips
    if (lineTrips.length > 0) {
      matchingTrips = matchingTrips.concat(lineTrips);
    }
  });

  // Sort trips by departure time
  matchingTrips.sort((a, b) => {
    return (
      timeToMinutes(a.segments[0].departureTime) -
      timeToMinutes(b.segments[0].departureTime)
    );
  });

  return matchingTrips;
}

/**
 * Find the index of a station in a metro line
 * @param {Object} line - Metro line object
 * @param {string} stationId - Station ID to find
 * @returns {number} - Index of station or -1 if not found
 */
function findStationIndexInLine(line, stationId) {
  if (!line.stations || !Array.isArray(line.stations)) return -1;

  for (let i = 0; i < line.stations.length; i++) {
    if (line.stations[i].stationId === stationId) {
      return i;
    }
  }

  return -1;
}

/**
 * Generate trips for a metro line based on the first departure time and frequency
 * @param {Object} line - Metro line object
 * @param {number} fromStationIndex - Index of departure station in line.stations
 * @param {number} toStationIndex - Index of arrival station in line.stations
 * @param {number} targetTimeMinutes - Target departure time in minutes since midnight
 * @returns {Array} - Generated trips
 */
function generateTripsForLine(
  line,
  fromStationIndex,
  toStationIndex,
  targetTimeMinutes
) {
  const trips = [];

  // Check if the line has the required scheduling information
  if (!line.firstDeparture || !line.frequencyMinutes) return trips;

  // Convert frequency to number
  const frequency = parseInt(line.frequencyMinutes, 10);
  if (isNaN(frequency) || frequency <= 0) return trips;

  // Parse first departure time
  const firstDepartureTime = line.firstDeparture.substring(11, 16); // Extract HH:MM
  const firstDepartureMinutes = timeToMinutes(firstDepartureTime);

  // Calculate travel time between stations (assumes uniform spacing for simplicity)
  const totalDuration = parseInt(line.totalDuration, 10) || 0;
  const totalStations = line.stations.length;
  const minutesPerSegment = totalDuration / (totalStations - 1);

  // Direction check - we need to handle both forward and reverse directions
  const isForward = fromStationIndex < toStationIndex;

  // Calculate departure and arrival times based on station indices
  const stationsToTravel = Math.abs(toStationIndex - fromStationIndex);
  const tripDuration = Math.round(minutesPerSegment * stationsToTravel);

  // Find all departure times that are close to the target time
  // Start from the first departure and increment by frequency
  let currentDepartureMinutes = firstDepartureMinutes;

  // Find the first departure time after the target time - 2 hours
  while (currentDepartureMinutes < targetTimeMinutes - 120) {
    currentDepartureMinutes += frequency;
  }

  // Generate up to 10 trips starting from 2 hours before the target time
  for (let i = 0; i < 10; i++) {
    // Calculate actual departure time for this station
    const stationOffsetMinutes = fromStationIndex * minutesPerSegment;
    const actualDepartureMinutes =
      currentDepartureMinutes + stationOffsetMinutes;

    // Calculate arrival time
    const arrivalMinutes = actualDepartureMinutes + tripDuration;

    // Create trip object
    const trip = {
      lineId: line.lineId || line.id,
      lineName: line.lineName,
      segments: [
        {
          fromStationId: line.stations[fromStationIndex].stationId,
          toStationId: line.stations[toStationIndex].stationId,
          departureTime: minutesToTime(actualDepartureMinutes),
          arrivalTime: minutesToTime(arrivalMinutes),
          durationMinutes: tripDuration,
        },
      ],
    };

    trips.push(trip);

    // Increment for next trip
    currentDepartureMinutes += frequency;
  }

  return trips;
}

/**
 * Displays the search results
 * @param {Array} trips - List of trip objects
 * @param {string} fromStation - Departure station ID
 * @param {string} toStation - Arrival station ID
 * @param {string} date - Departure date
 * @param {string} time - Departure time
 */
function displaySearchResults(trips, fromStation, toStation, date, time) {
  const searchResults = document.getElementById("search-results");

  if (!searchResults) return;

  // Clear previous results
  searchResults.innerHTML = "";

  // Get station names
  const fromStationName = getSelectedOptionText("from-station");
  const toStationName = getSelectedOptionText("to-station");

  // Make sure we found station names
  const safefromStationName = fromStationName || "Departure Station";
  const safeToStationName = toStationName || "Arrival Station";

  // Check if trips were found
  if (!trips || trips.length === 0) {
    searchResults.innerHTML = `
            <div class="col-12 my-4">
                <div class="alert alert-info bg-dark">
                    <i class="fas fa-info-circle me-2"></i>
                    No trips found between ${safefromStationName} and ${safeToStationName} on ${formatDateForDisplay(
      date
    )} at around ${formatTimeForDisplay(time)}.
                    <br>
                    Try a different time or date, or check another departure station.
                </div>
            </div>
        `;
    return;
  }

  // Create results header
  const headerElement = document.createElement("div");
  headerElement.className = "col-12 search-results-header";
  headerElement.innerHTML = `
        <h3><i class="fas fa-route me-2"></i>Available Trips</h3>
        <p class="lead">From ${safefromStationName} to ${safeToStationName} on ${formatDateForDisplay(
    date
  )}</p>
    `;
  searchResults.appendChild(headerElement);

  // Create results container
  const resultsContainer = document.createElement("div");
  resultsContainer.className = "col-12";
  searchResults.appendChild(resultsContainer);

  // Display first 3 trips
  const tripsToShow = Math.min(trips.length, 3);
  for (let i = 0; i < tripsToShow; i++) {
    displayTripCard(trips[i], resultsContainer, fromStation, toStation);
  }

  // Add "Load More" button if there are more than 3 trips
  if (trips.length > 3) {
    const loadMoreElement = document.createElement("div");
    loadMoreElement.className = "col-12 my-3";
    loadMoreElement.innerHTML = `
            <button class="load-more-btn">
                <i class="fas fa-arrow-down me-2"></i>Load more trips
            </button>
        `;

    // Add event listener to load more button
    const loadMoreBtn = loadMoreElement.querySelector(".load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        // Display 3 more trips
        const currentCount =
          resultsContainer.querySelectorAll(".trip-card").length;
        const nextCount = Math.min(trips.length, currentCount + 3);

        for (let i = currentCount; i < nextCount; i++) {
          displayTripCard(trips[i], resultsContainer, fromStation, toStation);
        }

        // Remove button if all trips are displayed
        if (nextCount >= trips.length) {
          loadMoreElement.remove();
        }
      });
    }

    searchResults.appendChild(loadMoreElement);
  }

  // Scroll to results
  headerElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Displays a single trip card
 * @param {Object} trip - Trip object
 * @param {HTMLElement} container - Container for the card
 * @param {string} fromStation - Departure station ID
 * @param {string} toStation - Arrival station ID
 */
function displayTripCard(trip, container, fromStation, toStation) {
  if (!container || !trip) return;

  // Find the relevant segment for this route
  let relevantSegment = null;
  let fromIndex = -1;
  let toIndex = -1;

  // Look through segments to find our route
  if (trip.segments && trip.segments.length > 0) {
    for (let i = 0; i < trip.segments.length; i++) {
      if (trip.segments[i].fromStationId === fromStation) {
        fromIndex = i;
      }
      if (trip.segments[i].toStationId === toStation) {
        toIndex = i;
        break;
      }
    }

    // Case when we found a segment from Source directly to Dest
    if (fromIndex !== -1 && toIndex === fromIndex) {
      relevantSegment = trip.segments[fromIndex];
    }
  }

  // Exit if we can't find a route
  if (!relevantSegment && (fromIndex === -1 || toIndex === -1)) {
    return;
  }

  // Get departure and arrival times
  let departureTime, arrivalTime, duration;
  if (relevantSegment) {
    // Direct segment case
    departureTime = relevantSegment.departureTime;
    arrivalTime = relevantSegment.arrivalTime;
    duration = relevantSegment.durationMinutes;
  } else {
    // Multi-segment case
    departureTime = trip.segments[fromIndex].departureTime;
    arrivalTime = trip.segments[toIndex].arrivalTime;

    // Calculate duration across segments
    const depMinutes = timeToMinutes(departureTime);
    const arrMinutes = timeToMinutes(arrivalTime);
    duration = arrMinutes - depMinutes;
  }

  // Create card element
  const cardElement = document.createElement("div");
  cardElement.className = "trip-card fade-in";

  // Create card content
  cardElement.innerHTML = `
        <div class="trip-header">
            <span class="trip-line-badge">Line ${trip.lineId.replace(
              "LN",
              ""
            )}</span>
            
            <div class="trip-times">
                <div class="trip-departure">
                    <strong>${formatTimeForDisplay(departureTime)}</strong>
                    <div>Departure</div>
                </div>
                
                <div class="trip-duration">
                    <div class="trip-duration-line"></div>
                    <div class="trip-duration-time">${duration} min</div>
                </div>
                
                <div class="trip-arrival">
                    <strong>${formatTimeForDisplay(arrivalTime)}</strong>
                    <div>Arrival</div>
                </div>
            </div>
        </div>
        
        <div class="trip-footer">
            <button class="btn btn-primary book-trip-btn">
                <i class="fas fa-ticket-alt me-2"></i>Book Ticket
            </button>
        </div>
    `;

  // Add event listener to "Book Ticket" button
  const bookBtn = cardElement.querySelector(".book-trip-btn");
  if (bookBtn) {
    bookBtn.addEventListener("click", function () {
      // If we implement a ticketing system, this is where we would add that functionality
      alert("Ticket booking will be available in a future update!");
    });
  }

  // Add to container
  container.appendChild(cardElement);
}

/**
 * Displays a search error message
 * @param {string} message - Error message to display
 */
function displaySearchError(message) {
  const searchError = document.getElementById("search-error");
  if (!searchError) return;

  searchError.textContent = message;
  searchError.style.display = "block";
}

/**
 * Gets the text of the selected option in a select element
 * @param {string} selectId - ID of the select element
 * @returns {string} - Text of the selected option
 */
function getSelectedOptionText(selectId) {
  const select = document.getElementById(selectId);
  if (!select || select.selectedIndex === -1) return "Unknown Station";

  return select.options[select.selectedIndex].text;
}

/**
 * Formats a time string for display (e.g. "14:30" to "2:30 PM")
 * @param {string} timeString - Time string in format "HH:MM"
 * @returns {string} - Formatted time
 */
function formatTimeForDisplay(timeString) {
  if (!timeString) return "N/A";

  try {
    // Create a date object to parse the time
    const date = new Date();
    const [hours, minutes] = timeString.split(":");
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    // Format using toLocaleTimeString to get the 12-hour format
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return timeString;
  }
}

/**
 * Formats a date string for display (e.g. "2025-05-19" to "May 19, 2025")
 * @param {string} dateString - Date string in format "YYYY-MM-DD"
 * @returns {string} - Formatted date
 */
function formatDateForDisplay(dateString) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Format using toLocaleDateString
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Converts time string to minutes since midnight
 * @param {string} timeString - Time string in format "HH:MM"
 * @returns {number} - Minutes since midnight
 */
function timeToMinutes(timeString) {
  if (!timeString) return 0;

  try {
    const [hours, minutes] = timeString.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  } catch (e) {
    return 0;
  }
}

/**
 * Converts minutes since midnight to time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} - Time string in format "HH:MM"
 */
function minutesToTime(minutes) {
  if (minutes === undefined || minutes === null) return "00:00";

  // Handle overflow (minutes > 24 hours)
  minutes = minutes % (24 * 60);

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}
