// metro-lines.js - Functionality for the metro lines page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth utilities
    const isAuthenticated = initAuth();
    
    // Update UI based on authentication status
    updateNavigation(isAuthenticated);
    
    // Set current date and time as default for travel time input
    const travelTimeInput = document.getElementById('travel-time');
    if (travelTimeInput) {
        const now = new Date();
        // Format: YYYY-MM-DDThh:mm
        const formattedDate = now.toISOString().substring(0, 16);
        travelTimeInput.value = formattedDate;
    }
    
    // Handle search form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fromStation = document.getElementById('from-station').value;
            const toStation = document.getElementById('to-station').value;
            const travelTime = document.getElementById('travel-time').value;
            
            if (!fromStation || !toStation) {
                alert('Please select both departure and arrival stations.');
                return;
            }
            
            // In a real application, this would call an API to search for trips
            // For now, we'll just show a success message
            alert(`Searching for trips from ${fromStation} to ${toStation} at ${travelTime}`);
        });
    }
    
    // Add click handler for station route visualization
    const stations = document.querySelectorAll('.station');
    stations.forEach(station => {
        station.addEventListener('click', function() {
            // Highlight the selected station
            stations.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Add interaction for trip cards
    const tripCards = document.querySelectorAll('.trip-card');
    tripCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent click on the book button from triggering card click
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            // Toggle selection or expansion if needed
            this.classList.toggle('expanded');
        });
    });
    
    // Handle "Load More Trips" button
    const loadMoreBtn = document.querySelector('.trip-cards + .text-center button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This would normally load more trips from the API
            // For demo purposes, we'll just add some dummy trips
            
            const tripContainer = document.querySelector('.trip-cards');
            
            // Example of how to add a new trip card
            const newTripCard = document.createElement('div');
            newTripCard.className = 'trip-card';
            newTripCard.innerHTML = `
                <div class="departure-time">06:50 AM</div>
                <div class="trip-info">
                    <div>Ben Thanh → Suoi Tien</div>
                    <div class="small text-muted">Arrives: 07:20 AM</div>
                </div>
                <a href="#" class="btn btn-sm btn-outline-primary">Book</a>
            `;
            
            tripContainer.appendChild(newTripCard);
            
            // Add event listener to the new card
            newTripCard.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    return;
                }
                this.classList.toggle('expanded');
            });
        });
    }
    
    // Handle ticket type selection
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
});

// Function to update navigation based on authentication status
function updateNavigation(isAuthenticated) {
    const authMenu = document.querySelector('.auth-menu');
    const guestMenu = document.querySelector('.guest-menu');
    
    if (authMenu && guestMenu) {
        // Show the appropriate menu based on authentication status
        authMenu.style.display = isAuthenticated ? 'flex' : 'none';
        guestMenu.style.display = isAuthenticated ? 'none' : 'flex';
    }
}