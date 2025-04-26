document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.querySelector('form');
    
    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Create error message element if it doesn't exist
        let errorMessage = document.querySelector('.alert-danger');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger';
            signinForm.parentElement.insertBefore(errorMessage, signinForm);
        }
        
        try {
            errorMessage.style.display = 'none';
            
            console.log('Attempting to login with:', { email, password });
            
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
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(response.status === 401 
                    ? 'Invalid email or password' 
                    : 'Server error: ' + response.status);
            }
            
            const data = await response.json();
            console.log('Login successful, token received');
            
            // Store JWT token
            sessionStorage.setItem('jwtToken', data.token);
            sessionStorage.setItem('tokenExpiry', Date.now() + (data.expiresIn * 1000));
            
            // Redirect to index.html
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = error.message || 'Failed to connect to server';
            errorMessage.style.display = 'block';
        }
    });
    
    // Handle Google sign-in button click
    const googleButton = document.querySelector('button[id="google-signin"]') || 
                          document.querySelector('.g_id_signin') ||
                          document.querySelector('button:has(img[alt="Google"])');
    
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            alert('Google Sign In will be available in a future update');
        });
    }
});