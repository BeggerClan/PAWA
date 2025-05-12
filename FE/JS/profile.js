// profile.js - Handles functionality for the passenger profile page

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in, redirect to signin if not
    if (!isLoggedIn()) {
        window.location.href = 'signin.html';
        return;
    }
    
    // Add loading class to body for animations
    document.body.classList.add('page-loaded');
    
    // Elements
    const profileInfo = document.querySelector('.profile-info');
    const editProfileForm = document.getElementById('editProfileForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const profileUpdateForm = document.getElementById('profileUpdateForm');
    const alertMessage = document.getElementById('alertMessage');
    const specialStatusContainer = document.getElementById('specialStatusContainer');
    const specialStatusText = document.getElementById('specialStatusText');
    
    // Load profile data
    loadProfileData();
    
    // Event Listeners
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            profileInfo.style.display = 'none';
            editProfileForm.style.display = 'block';
            
            // Fill in the form with current data
            const userData = getUserInfo();
            if (userData) {
                document.getElementById('updateEmail').value = userData.email || '';
                document.getElementById('updatePhoneNumber').value = userData.phoneNumber || '';
                document.getElementById('updateResidenceAddress').value = userData.residenceAddress || '';
            }
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            editProfileForm.style.display = 'none';
            profileInfo.style.display = 'block';
        });
    }
    
    if (profileUpdateForm) {
        profileUpdateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
});

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(amount);
}

// Function to show alert message
function showAlert(message, type) {
    const alertElement = document.getElementById('alertMessage');
    
    if (alertElement) {
        alertElement.className = `alert alert-${type}`;
        alertElement.textContent = message;
        alertElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}

// Function to load profile data from API
async function loadProfileData() {
    try {
        // Show loading indicators
        const loadingElements = document.querySelectorAll('.info-value');
        loadingElements.forEach(el => {
            el.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        });
        
        // Get profile data from API
        const response = await fetch('http://localhost:8080/api/passengers/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to retrieve profile data');
        }
        
        const profileData = await response.json();
        displayProfileData(profileData);
        
    } catch (error) {
        console.error('Error loading profile data:', error);
        showAlert('Error loading profile data. Please try again later.', 'danger');
    }
}

// Function to display profile data
function displayProfileData(data) {
    // Personal Information
    const fullName = `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim();
    document.getElementById('fullName').textContent = fullName;
    document.getElementById('nationalId').textContent = data.nationalId || 'Not provided';
    
    // Format date of birth for display
    let formattedDob = 'Not provided';
    if (data.dob) {
        const dobDate = new Date(data.dob);
        formattedDob = dobDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    document.getElementById('dob').textContent = formattedDob;
    
    document.getElementById('studentId').textContent = data.studentId || 'Not provided';
    
    // Contact Information
    document.getElementById('email').textContent = data.email || 'Not provided';
    document.getElementById('phoneNumber').textContent = data.phoneNumber || 'Not provided';
    document.getElementById('residenceAddress').textContent = data.residenceAddress || 'Not provided';
    
    // Account Status
    document.getElementById('disabilityStatus').textContent = data.disabilityStatus ? 'Yes' : 'No';
    document.getElementById('revolutionaryStatus').textContent = data.revolutionaryStatus ? 'Yes' : 'No';
    
    // Format created at date for display
    let formattedCreatedAt = 'Not available';
    if (data.createdAt) {
        const createdDate = new Date(data.createdAt);
        formattedCreatedAt = createdDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    document.getElementById('createdAt').textContent = formattedCreatedAt;
    
    // Display wallet balance
    document.getElementById('walletBalance').textContent = formatCurrency(data.walletBalance || 0);
    
    // Handle special status
    const specialStatusContainer = document.getElementById('specialStatusContainer');
    const specialStatusText = document.getElementById('specialStatusText');
    
    if (data.disabilityStatus || data.revolutionaryStatus || (data.studentId && data.studentId.trim() !== '')) {
        specialStatusContainer.style.display = 'block';
        
        let statusText = '';
        if (data.disabilityStatus) {
            statusText += 'Disability status: Eligible for free travel. ';
        }
        if (data.revolutionaryStatus) {
            statusText += 'Revolutionary contribution status: Eligible for free travel. ';
        }
        if (data.studentId && data.studentId.trim() !== '') {
            statusText += 'Student status: Eligible for discounted monthly tickets.';
        }
        
        specialStatusText.textContent = statusText.trim();
    } else {
        specialStatusContainer.style.display = 'none';
    }
}

// Function to update profile
async function updateProfile() {
    // Show loading state
    const submitBtn = document.querySelector('#profileUpdateForm button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...';
    
    // Get form data
    const email = document.getElementById('updateEmail').value.trim();
    const phoneNumber = document.getElementById('updatePhoneNumber').value.trim();
    const residenceAddress = document.getElementById('updateResidenceAddress').value.trim();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    
    // Create request object
    const updateData = {};
    
    // Only add fields that have values
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (residenceAddress) updateData.residenceAddress = residenceAddress;
    if (currentPassword) updateData.currentPassword = currentPassword;
    if (newPassword) updateData.newPassword = newPassword;
    
    // If no fields to update, show error
    if (Object.keys(updateData).length === 0) {
        showAlert('No changes to update.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    
    // If new password provided without current password, show error
    if (newPassword && !currentPassword) {
        showAlert('Please enter your current password to change to a new password.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }
    
    try {
        // Submit update to API
        const response = await fetch('http://localhost:8080/api/passengers/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update profile');
        }
        
        const updatedProfile = await response.json();
        
        // Check if email or password was changed
        const passwordChanged = newPassword && currentPassword;
        const emailChanged = email && email !== getUserInfo().email;
        
        if (passwordChanged || emailChanged) {
            // Show success message and redirect to signin page
            showAlert('Profile updated successfully! Please sign in again with your new credentials.', 'success');
            
            // Clear authentication data
            setTimeout(() => {
                // Clear token data
                sessionStorage.removeItem('jwtToken');
                sessionStorage.removeItem('tokenExpiry');
                
                // Redirect to signin page
                window.location.href = 'signin.html';
            }, 1500);
        } else {
            // Hide form and show profile for regular updates
            document.getElementById('editProfileForm').style.display = 'none';
            document.querySelector('.profile-info').style.display = 'block';
            
            // Show success message
            showAlert('Profile updated successfully!', 'success');
            
            // Reload profile data
            displayProfileData(updatedProfile);
            
            // Reset submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert(error.message || 'Failed to update profile. Please try again.', 'danger');
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}