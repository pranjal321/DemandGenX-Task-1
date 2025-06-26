// DemandGenX - JavaScript for Mobile Navigation and Form Handling

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize form handling
    initFormHandling();
});

/**
 * Mobile Navigation Functionality
 * Fixes navigation overflow issue with responsive hamburger menu
 */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            // Toggle hamburger animation
            hamburger.classList.toggle('active');
            
            // Toggle navigation menu visibility
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links (mobile)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
        
        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Form Handling Functionality
 * Fixes non-working registration button issues
 */
function initFormHandling() {
    const form = document.getElementById('registration-form');
    const submitButton = document.getElementById('register-btn');
    const messageContainer = document.getElementById('message-container');
    
    if (form && submitButton) {
        // Add form submit event listener
        form.addEventListener('submit', handleFormSubmit);
        
        // Add input validation on blur
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearInputError);
        });
    }
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    
    const form = event.target;
    const submitButton = document.getElementById('register-btn');
    const messageContainer = document.getElementById('message-container');
    
    // Validate form before submission
    if (!validateForm(form)) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    showLoadingState(submitButton);
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company')
        };
        
        // Simulate API call (replace with actual endpoint)
        const response = await submitUserData(userData);
        
        if (response.success) {
            showMessage('Registration successful! Welcome to DemandGenX.', 'success');
            form.reset(); // Clear form
        } else {
            throw new Error(response.message || 'Registration failed');
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showMessage(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        // Hide loading state
        hideLoadingState(submitButton);
    }
}

/**
 * Simulate API call for user registration
 * Replace this with actual API endpoint
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response object
 */
async function submitUserData(userData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate validation
    if (!userData.email || !userData.firstName || !userData.lastName) {
        throw new Error('Missing required fields');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        throw new Error('Invalid email address');
    }
    
    // Simulate success response
    // In real implementation, replace with:
    // const response = await fetch('/api/register', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(userData)
    // });
    // return await response.json();
    
    return {
        success: true,
        message: 'Registration successful',
        userId: Math.random().toString(36).substr(2, 9)
    };
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} True if form is valid
 */
function validateForm(form) {
    const requiredInputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual input field
 * @param {Event} event - Input blur event
 * @returns {boolean} True if input is valid
 */
function validateInput(event) {
    const input = event.target;
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling
    input.classList.remove('error');
    
    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Phone validation (basic)
    if (input.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    // Show error state
    if (!isValid) {
        showInputError(input, errorMessage);
    }
    
    return isValid;
}

/**
 * Show input error state
 * @param {HTMLInputElement} input - Input element
 * @param {string} message - Error message
 */
function showInputError(input, message) {
    input.classList.add('error');
    
    // Add error styling if not exists
    if (!document.querySelector('.input-error-style')) {
        const style = document.createElement('style');
        style.className = 'input-error-style';
        style.textContent = `
            .form-group input.error {
                border-color: #e74c3c !important;
                box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Clear input error state
 * @param {Event} event - Input event
 */
function clearInputError(event) {
    const input = event.target;
    input.classList.remove('error');
}

/**
 * Show loading state on submit button
 * @param {HTMLButtonElement} button - Submit button
 */
function showLoadingState(button) {
    button.disabled = true;
    button.classList.add('loading');
    button.textContent = 'Registering...';
}

/**
 * Hide loading state on submit button
 * @param {HTMLButtonElement} button - Submit button
 */
function hideLoadingState(button) {
    button.disabled = false;
    button.classList.remove('loading');
    button.textContent = 'Register Now';
}

/**
 * Show message to user
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
}

/**
 * Handle window resize for responsive behavior
 */
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger-btn');
    
    // Reset mobile menu state on desktop
    if (window.innerWidth > 768) {
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Utility function for debugging (remove in production)
function debugFormIssues() {
    console.log('=== Form Debug Information ===');
    
    const form = document.getElementById('registration-form');
    const button = document.getElementById('register-btn');
    
    console.log('Form element:', form);
    console.log('Form action:', form?.action || 'No action set');
    console.log('Form method:', form?.method || 'No method set');
    console.log('Submit button:', button);
    console.log('Button type:', button?.type || 'No type set');
    
    // Check for JavaScript errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
    });
    
    console.log('=== End Debug Information ===');
}

// Uncomment for debugging
// debugFormIssues();