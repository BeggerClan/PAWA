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
    // Add fade-out animation to the body
    document.body.classList.add('fade-out');
    
    // After animation completes, clear storage and redirect
    setTimeout(() => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('tokenExpiry');
        window.location.href = 'signin.html';
    }, 300);
}

// Function to get the JWT token
function getToken() {
    return sessionStorage.getItem('jwtToken');
}

// Function to get user info from JWT
function getUserInfo() {
    const token = getToken();
    if (!token) return null;
    
    try {
        // Extract the payload part of the JWT (second part)
        const payload = token.split('.')[1];
        // Decode the base64 string
        const decoded = atob(payload);
        // Parse the JSON
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

// Protect pages that require authentication
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'signin.html';
    }
}

// Set up global AJAX headers with the JWT token
function setupAjaxHeaders() {
    const token = getToken();
    if (token) {
        // Create a function to set the Authorization header for all AJAX requests
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
            if (!options.headers) {
                options.headers = {};
            }
            
            // Don't add token to requests to external domains
            const isSameDomain = url.startsWith('/') || url.startsWith(window.location.origin);
            if (isSameDomain) {
                options.headers['Authorization'] = `Bearer ${token}`;
            }
            
            return originalFetch(url, options);
        };
    }
}

// Initialize auth - call this on every page
function initAuth() {
    setupAjaxHeaders();
    
    // Check if this is a protected page
    const isProtectedPage = !window.location.pathname.includes('signin.html') && 
                           !window.location.pathname.includes('signup.html') &&
                           !window.location.pathname.endsWith('/');
    
    if (isProtectedPage) {
        requireAuth();
    }
    
    // Update UI based on authentication status
    const isAuth = isLoggedIn();
    const authElements = document.querySelectorAll('.auth-required');
    const noAuthElements = document.querySelectorAll('.no-auth');
    
    authElements.forEach(el => el.classList.toggle('d-none', !isAuth));
    noAuthElements.forEach(el => el.classList.toggle('d-none', isAuth));
    
    // Set up logout buttons
    const logoutBtns = document.querySelectorAll('.logout-btn, #logout-btn');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', logout);
        }
    });
    
    return isAuth;
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initAuth);