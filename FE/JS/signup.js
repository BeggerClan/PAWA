document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const responseMessage = document.getElementById('responseMessage');
    
    // Add loading class to body when page is loaded for animations
    document.body.classList.add('page-loaded');
    
    // Handle date input formatting
    const dobInput = document.getElementById('dob');
    dobInput.addEventListener('focus', function() {
        // Change to datetime-local type when focused for better picking
        if (this.type !== 'datetime-local') {
            this.type = 'datetime-local';
        }
    });
    
    dobInput.addEventListener('blur', function() {
        if (!this.value) {
            this.type = 'text';
            this.placeholder = 'dd/mm/yyyy, --:--';
        }
    });
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get DOB value and format it correctly
        let dobValue;
        try {
            // Either it's a text input with formatted string or datetime-local
            if (dobInput.type === 'datetime-local') {
                dobValue = dobInput.value;
            } else {
                // Parse the formatted string
                const parts = dobInput.value.split(',');
                const datePart = parts[0].trim();
                const timePart = parts.length > 1 ? parts[1].trim() : '00:00';
                
                const [day, month, year] = datePart.split('/');
                dobValue = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;
            }
        } catch (error) {
            responseMessage.innerHTML = `
                <div class="alert alert-danger">
                    Invalid date format. Please use dd/mm/yyyy format.
                </div>
            `;
            return;
        }
        
        const payload = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value,
            middleName: document.getElementById('middleName').value || null,
            lastName: document.getElementById('lastName').value,
            nationalId: document.getElementById('nationalId').value,
            dob: dobValue,
            residenceAddress: document.getElementById('residenceAddress').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            studentId: document.getElementById('studentId').value || null,
            disabilityStatus: document.querySelector('input[name="disabilityStatus"]:checked').value === "true",
            revolutionaryStatus: document.querySelector('input[name="revolutionaryStatus"]:checked').value === "true"
        };
        
        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Account...';
        
        try {
            // Hide any previous error messages
            responseMessage.innerHTML = '';
            
            const response = await fetch('http://localhost:8080/api/passengers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error registering account');
            }
            
            // Show success message
            responseMessage.innerHTML = `
                <div class="alert alert-success">
                    Registration successful! You can now <a href="signin.html">sign in</a> with your credentials.
                </div>
            `;
            
            // Show success state
            submitButton.textContent = 'Success!';
            submitButton.classList.add('success');
            
            // Reset form
            signupForm.reset();
            
            // Redirect to signin page after a delay
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 3000);
            
        } catch (error) {
            console.error('Registration error:', error);
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Show error message
            responseMessage.innerHTML = `
                <div class="alert alert-danger">
                    ${error.message || 'Failed to register. Please try again.'}
                </div>
            `;
            
            // Add shake animation to form on error
            signupForm.classList.add('shake');
            setTimeout(() => {
                signupForm.classList.remove('shake');
            }, 500);
        }
    });
    
    // Custom radio button behavior
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Update all radio buttons in the same group
            const name = this.name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                const customRadio = radio.nextElementSibling;
                if (radio.checked) {
                    customRadio.classList.add('checked');
                } else {
                    customRadio.classList.remove('checked');
                }
            });
        });
    });
    
    // Trigger change event on page load to set initial state
    radioInputs.forEach(input => {
        if (input.checked) {
            input.dispatchEvent(new Event('change'));
        }
    });
});