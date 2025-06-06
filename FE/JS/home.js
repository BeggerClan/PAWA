// home.js - Handles functionality for the homepage

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth utilities
    const isAuthenticated = initAuth();
    
    // Update UI based on authentication status
    updateHomeUI(isAuthenticated);
    
    // Handle the Buy Tickets button
    const buyTicketBtn = document.querySelector('.buy-ticket-btn');
    if (buyTicketBtn) {
        buyTicketBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isAuthenticated) {
                // If logged in, go to tickets page
                window.location.href = 'my-tickets.html';
            } else {
                // If not logged in, prompt to sign in
                if (confirm('You need to sign in to purchase tickets. Would you like to sign in now?')) {
                    window.location.href = 'signin.html';
                }
            }
        });
    }
});

// Function to update UI based on authentication status
function updateHomeUI(isAuthenticated) {
    // Show appropriate navigation menu
    const authMenu = document.querySelector('.auth-menu');
    const guestMenu = document.querySelector('.guest-menu');
    
    if (authMenu && guestMenu) {
        authMenu.style.display = isAuthenticated ? 'flex' : 'none';
        guestMenu.style.display = isAuthenticated ? 'none' : 'flex';
    }
    
    // Update welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        if (isAuthenticated) {
            // Try to get user info from token
            const userInfo = getUserInfo();
            if (userInfo && userInfo.firstName) {
                welcomeMessage.textContent = `Welcome back, ${userInfo.firstName}!`;
            } else {
                welcomeMessage.textContent = 'Welcome back!';
            }
        } else {
            welcomeMessage.textContent = 'Welcome to HCMC Metro';
        }
    }
    
    // Update Buy Tickets button
    const buyTicketBtn = document.querySelector('.buy-ticket-btn');
    if (buyTicketBtn) {
        if (isAuthenticated) {
            buyTicketBtn.textContent = '🎫 Buy Tickets';
            buyTicketBtn.href = 'my-tickets.html';
        } else {
            buyTicketBtn.textContent = '🎫 Buy Tickets';
            // We'll handle this in the click event
        }
    }
}