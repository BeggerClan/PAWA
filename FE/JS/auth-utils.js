// FE/js/auth-utils.js
// Function to check if the user is logged in
function isLoggedIn() {
    const token = sessionStorage.getItem('jwtToken');
    const expiry = sessionStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
        return false;
    }
    
    // Check if token has expired
    if (Date.now() > parseInt(expiry)) {
        // Token has expired, clear it and return false
        logout();
        return false;
    }
    
    return true;
}

// Function to log out
function logout() {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('tokenExpiry');
    window.location.href = 'signin.html';
}

// Function to get the JWT token
function getToken() {
    return sessionStorage.getItem('jwtToken');
}

// Protect pages that require authentication
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'signin.html';
    }
}