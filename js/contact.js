// Contact Form JavaScript - Quality World with Thomas
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    // Character counter for message field
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 1000) {
                charCount.style.color = '#dc2626';
                this.value = this.value.substring(0, 1000);
                charCount.textContent = '1000';
            } else if (count > 800) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#64748b';
            }
        });
    }

    // Real-time validation
    const formFields = ['name', 'email', 'subject', 'message', 'consent'];
    formFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => clearFieldError(fieldName));
        }
    });

    // Form submission handler
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }
});

// Validation functions
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    let isValid = true;
    let errorMessage = '';

    if (!field) return true;

    switch (fieldName) {
        case 'name':
            if (!field.value.trim()) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (field.value.trim().length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s'-]+$/.test(field.value.trim())) {
                errorMessage = 'Name contains invalid characters';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(field.value.trim())) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'subject':
            if (!field.value) {
                errorMessage = 'Please select a subject';
                isValid = false;
            }
            break;

        case 'message':
            if (!field.value.trim()) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (field.value.trim().length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            } else if (field.value.length > 1000) {
                errorMessage = 'Message cannot exceed 1000 characters';
                isValid = false;
            }
            break;

        case 'consent':
            if (!field.checked) {
                errorMessage = 'You must consent to being contacted';
                isValid = false;
            }
            break;
    }

    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = errorMessage ? 'block' : 'none';
    }

    // Update field styling
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }

    return isValid;
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(fieldName + 'Error');
    const field = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    if (field) {
        field.classList.remove('error');
    }
}

function validateForm() {
    const requiredFields = ['name', 'email', 'subject', 'message', 'consent'];
    let isFormValid = true;

    requiredFields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });

    // Check honeypot field (spam protection)
    const honeypot = document.querySelector('input[name="website"]');
    if (honeypot && honeypot.value !== '') {
        // This is likely spam
        showErrorMessage('Invalid submission detected. Please try again.');
        return false;
    }

    return isFormValid;
}

// Form submission handler
async function handleFormSubmission(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showErrorMessage('Please correct the errors above and try again.');
        return;
    }

    // Show loading state
    setLoadingState(true);
    hideMessages();

    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    data.userAgent = navigator.userAgent;

    try {
        // Simulate API call (replace with actual endpoint)
        const response = await submitContactForm(data);
        
        if (response.success) {
            showSuccessMessage();
            resetForm();
            
            // Track successful submission
            trackEvent('contact_form_submitted', {
                subject: data.subject,
                urgency: data.urgency
            });
        } else {
            throw new Error(response.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage(error.message || 'Failed to send message. Please try again or contact thomas@qualityworld.com directly.');
        
        // Track failed submission
        trackEvent('contact_form_error', {
            error: error.message
        });
    } finally {
        setLoadingState(false);
    }
}

// Backend API call
async function submitContactForm(data) {
    // Configuration - Update these URLs for your backend
    const API_ENDPOINTS = {
        // Local development (Node.js)
        development: 'http://localhost:3001/api/contact',
        
        // Production (update with your actual domain)
        production: 'https://your-domain.com/backend-examples/contact-handler.php',
        
        // Alternative Node.js production
        // production: 'https://your-app.herokuapp.com/api/contact'
    };
    
    // Determine which endpoint to use
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiEndpoint = isDevelopment ? API_ENDPOINTS.development : API_ENDPOINTS.production;
    
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        // Parse response
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            throw new Error('Invalid response from server');
        }
        
        // Check if request was successful
        if (!response.ok) {
            throw new Error(result.message || `Server error: ${response.status}`);
        }
        
        return result;
        
    } catch (fetchError) {
        // Handle different types of errors
        if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
            // Network error or CORS issue
            throw new Error('Unable to connect to server. Please check your internet connection.');
        } else if (fetchError.message.includes('CORS')) {
            throw new Error('Security error. Please try again or contact support.');
        } else {
            // Re-throw the original error
            throw fetchError;
        }
    }
}

// Fallback email functionality (when backend is not available)
async function fallbackEmailSubmission(data) {
    // Create mailto link as fallback
    const subject = encodeURIComponent(`Quality World Inquiry: ${data.subject}`);
    const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'N/A'}
Subject: ${data.subject}
Priority: ${data.urgency}

Message:
${data.message}

${data.newsletter ? 'Newsletter subscription requested' : ''}
${data.consent ? 'Consent given for contact' : ''}
    `);
    
    const mailtoLink = `mailto:thomas@qualityworld.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    return {
        success: true,
        message: 'Email client opened. Please send the message from your email application.',
        fallback: true
    };
}

// UI Helper functions
function setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.classList.remove('loading');
    }
}

function showSuccessMessage() {
    const messagesContainer = document.getElementById('formMessages');
    const successMessage = document.getElementById('successMessage');
    
    messagesContainer.style.display = 'block';
    successMessage.style.display = 'flex';
    
    // Scroll to message
    messagesContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showErrorMessage(message) {
    const messagesContainer = document.getElementById('formMessages');
    const errorMessage = document.getElementById('errorMessage');
    const errorDetails = document.getElementById('errorDetails');
    
    if (message) {
        errorDetails.textContent = message;
    }
    
    messagesContainer.style.display = 'block';
    errorMessage.style.display = 'flex';
    
    // Scroll to message
    messagesContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideMessages() {
    const messagesContainer = document.getElementById('formMessages');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    messagesContainer.style.display = 'none';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

function resetForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
        
        // Clear validation states
        const formFields = form.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.classList.remove('valid', 'error');
        });
        
        // Clear error messages
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });
        
        // Reset character counter
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '#64748b';
        }
        
        hideMessages();
    }
}

// Analytics tracking (placeholder)
function trackEvent(eventName, properties) {
    console.log(`Event tracked: ${eventName}`, properties);
    // Implement your analytics tracking here
    // e.g., Google Analytics, Mixpanel, etc.
}

// Security helpers
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Email validation with DNS checking (client-side approximation)
function isValidEmailDomain(email) {
    const domain = email.split('@')[1];
    const commonDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'icloud.com', 'aol.com', 'live.com', 'msn.com'
    ];
    
    // Basic domain validation
    return domain && domain.includes('.') && domain.length > 3;
}

// Accessibility enhancements
function enhanceAccessibility() {
    // Add ARIA labels for better screen reader support
    const form = document.getElementById('contactForm');
    if (form) {
        form.setAttribute('aria-label', 'Contact form');
        
        // Add live region for form messages
        const messagesContainer = document.getElementById('formMessages');
        if (messagesContainer) {
            messagesContainer.setAttribute('aria-live', 'polite');
            messagesContainer.setAttribute('aria-atomic', 'true');
        }
    }
}

// Initialize accessibility enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', enhanceAccessibility);
