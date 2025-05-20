document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signin-form');
    const errorMessage = document.getElementById('error-message');
    
    // Add loading class to body when page is loaded for animations
    document.body.classList.add('page-loaded');
    
    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Show loading state
        const submitButton = signinForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Signing in...';
        
        try {
            // Hide any previous error messages
            errorMessage.style.display = 'none';
            
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            if (!response.ok) {
                throw new Error(response.status === 401 
                    ? 'Invalid email or password' 
                    : 'Server error: ' + response.status);
            }
            
            const data = await response.json();
            
            // Store JWT token
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('tokenExpiry', Date.now() + (data.expiresIn * 1000));
            
            // Show success state
            submitButton.textContent = 'Success!';
            submitButton.classList.add('success');
            
            // Redirect to index.html after a short delay
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 800);
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Show error message
            errorMessage.textContent = error.message || 'Failed to connect to server';
            errorMessage.style.display = 'block';
            
            // Add shake animation to form on error
            signinForm.classList.add('shake');
            setTimeout(() => {
                signinForm.classList.remove('shake');
            }, 500);
        }
    });
    
    // Handle Google sign-in button click
    const googleButton = document.getElementById('google-signin');
    
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            alert('Google Sign In will be available in a future update');
        });
    }
    
    // Focus on email field when page loads
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.focus();
    }
    
    // Add input animation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input already has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});