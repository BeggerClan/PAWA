// FE/js/auth-utils.js
// Function to check if the user is logged in
function isLoggedIn() {
  const token = localStorage.getItem("jwtToken");
  const expiry = localStorage.getItem("tokenExpiry");

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
  document.body.classList.add("fade-out");

  // After animation completes, clear storage and redirect
  setTimeout(() => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("tokenExpiry");
    window.location.href = "home.html";
  }, 300);
}

// Function to get the JWT token
function getToken() {
  return localStorage.getItem("jwtToken");
}

// Function to get user info from JWT
function getUserInfo() {
  const token = getToken();
  if (!token) return null;

  try {
    // Extract the payload part of the JWT (second part)
    const payload = token.split(".")[1];
    // Decode the base64 string
    const decoded = atob(payload);
    // Parse the JSON
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

// Protect pages that require authentication
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "signin.html";
  }
}

// Set up global AJAX headers with the JWT token
function setupAjaxHeaders() {
  const token = getToken();
  if (token) {
    // Create a function to set the Authorization header for all AJAX requests
    const originalFetch = window.fetch;
    window.fetch = function (url, options = {}) {
      if (!options.headers) {
        options.headers = {};
      }

      // Don't add token to requests to external domains
      const isSameDomain =
        url.startsWith("/") || url.startsWith(window.location.origin);
      if (isSameDomain) {
        options.headers["Authorization"] = `Bearer ${token}`;
      }

      return originalFetch(url, options);
    };
  }
}

// Function to handle authenticated navigation - important for preventing logout issues
function setupAuthNavigation() {
  // Select all navigation links in the navbar
  const navLinks = document.querySelectorAll(".navbar a.nav-link");

  // Add click event to maintain auth state when navigating
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Allow normal navigation without interfering with auth state
      // We don't prevent default or modify URLs as token is in sessionStorage
    });
  });
}

// Handle the display of auth-dependent UI elements
function updateAuthUI() {
  const isAuth = isLoggedIn();

  // For a simpler approach in the finished pages, we won't hide/show elements
  // We'll just leave the appropriate nav elements visible based on page type

  // On pages that require auth (profile, my tickets, etc)
  const currentPath = window.location.pathname;
  if (
    currentPath.includes("profile.html") ||
    currentPath.includes("my-tickets.html")
  ) {
    if (!isAuth) {
      // Redirect to login if not authenticated
      window.location.href = "signin.html";
    }
  }

  // For home page, we don't redirect but update UI based on auth status
  if (
    currentPath.includes("home.html") ||
    currentPath === "/" ||
    currentPath.endsWith("/")
  ) {
    const authLinks = document.querySelectorAll(".auth-required");
    const noAuthLinks = document.querySelectorAll(".no-auth");

    if (authLinks.length && noAuthLinks.length) {
      authLinks.forEach((el) => el.classList.toggle("d-none", !isAuth));
      noAuthLinks.forEach((el) => el.classList.toggle("d-none", isAuth));
    }
  }
}

// Initialize auth - call this on every page
function initAuth() {
  setupAjaxHeaders();
  setupAuthNavigation();
  updateAuthUI();

  // Set up logout buttons
  const logoutBtns = document.querySelectorAll(".logout-btn, #logout-btn");
  logoutBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", logout);
    }
  });

  return isLoggedIn();
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initAuth);
