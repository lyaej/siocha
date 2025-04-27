// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.querySelector('.contact-form form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectSelect = document.getElementById('subject');
    const paxInput = document.getElementById('pax');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const submitButton = document.getElementById('submit');
    const termsCheckbox = document.getElementById('t&d');
    const subscribeCheckbox = document.getElementById('subscribe');

    // Initialize date and time inputs with reasonable defaults
    setDefaultDateTime();
    
    // Set minimum date to today
    restrictPastDates();

    // Handle reservation type change to update pax limits
    subjectSelect.addEventListener('change', function() {
        updatePaxLimits();
    });

    // Handle phone number formatting and validation
    phoneInput.addEventListener('input', function() {
        formatPhoneNumber();
    });

    // Update default time slots based on the selected date
    dateInput.addEventListener('change', function() {
        updateAvailableTimeSlots();
    });

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            submitButton.value = "PROCESSING...";
            submitButton.disabled = true;
            
            // Simulate server processing (success scenario)
            setTimeout(function() {
                // Show success alert
                showAlert('Success!', 'Your reservation has been confirmed successfully.', 'success');
                
                // Then show detailed confirmation modal
                setTimeout(function() {
                    showConfirmation();
                }, 1500);
                
                submitButton.value = "SUBMIT";
                submitButton.disabled = false;
            }, 1500);
            
            // Simulating occasional failure scenario (1 in 10 chance)
            // In real implementation, this would be based on server response
            /*
            if (Math.random() > 0.9) {
                setTimeout(function() {
                    showAlert('Reservation Failed', 'Unable to complete your reservation. Please try again or contact us directly.', 'error');
                    submitButton.value = "SUBMIT";
                    submitButton.disabled = false;
                }, 1500);
            } else {
                setTimeout(function() {
                    showAlert('Success!', 'Your reservation has been confirmed successfully.', 'success');
                    setTimeout(function() {
                        showConfirmation();
                    }, 1500);
                    submitButton.value = "SUBMIT";
                    submitButton.disabled = false;
                }, 1500);
            }
            */
        }
    });

    // Form validation function
    function validateForm() {
        let isValid = true;
        
        // Basic validation for each field
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else {
            clearError(nameInput);
        }
        
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        if (!phoneInput.value.trim() || phoneInput.value.replace(/\D/g, '').length < 10) {
            showError(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        } else {
            clearError(phoneInput);
        }
        
        if (!subjectSelect.value) {
            showError(subjectSelect, 'Please select reservation type');
            isValid = false;
        } else {
            clearError(subjectSelect);
        }
        
        if (!paxInput.value || paxInput.value < 1) {
            showError(paxInput, 'Please enter number of guests');
            isValid = false;
        } else {
            clearError(paxInput);
        }
        
        if (!dateInput.value) {
            showError(dateInput, 'Please select a date');
            isValid = false;
        } else {
            clearError(dateInput);
        }
        
        if (!timeInput.value) {
            showError(timeInput, 'Please select a time');
            isValid = false;
        } else {
            clearError(timeInput);
        }
        
        if (!termsCheckbox.checked) {
            showError(termsCheckbox.parentElement.querySelector('.checkbox-box'), 'Please agree to terms');
            isValid = false;
        } else {
            clearError(termsCheckbox.parentElement.querySelector('.checkbox-box'));
        }
        
        return isValid;
    }

    // Display error message for invalid fields
    function showError(element, message) {
        const parentDiv = element.closest('.info') || element.closest('.option') || element.parentNode;
        
        // Remove any existing error message
        clearError(element);
        
        // Create and append error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff4d4d';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        element.style.borderColor = '#ff4d4d';
        parentDiv.appendChild(errorDiv);
    }

    // Clear error message
    function clearError(element) {
        const parentDiv = element.closest('.info') || element.closest('.option') || element.parentNode;
        const errorMessage = parentDiv.querySelector('.error-message');
        
        if (errorMessage) {
            parentDiv.removeChild(errorMessage);
        }
        
        element.style.borderColor = '#FEC200';
    }

    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Format phone number as user types
    function formatPhoneNumber() {
        // Remove all non-digit characters
        let cleaned = phoneInput.value.replace(/\D/g, '');
        
        // Limit to 11 digits
        cleaned = cleaned.substring(0, 11);
        
        // Format: (XXX) XXX-XXXX or international format
        let formatted = cleaned;
        if (cleaned.length > 0) {
            if (cleaned.length <= 3) {
                formatted = cleaned;
            } else if (cleaned.length <= 6) {
                formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3);
            } else {
                formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
            }
        }
        
        phoneInput.value = formatted;
    }

    // Update min/max pax based on reservation type
    function updatePaxLimits() {
        if (subjectSelect.value === 'reservation') {
            paxInput.min = 1;
            paxInput.max = 5;
            if (parseInt(paxInput.value) > 5) {
                paxInput.value = 5;
            }
        } else if (subjectSelect.value === 'event-booking') {
            paxInput.min = 6;
            paxInput.max = 30;
            if (parseInt(paxInput.value) < 6) {
                paxInput.value = 6;
            }
        }
    }

    // Set default date and time values
    function setDefaultDateTime() {
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format date as YYYY-MM-DD
        const formattedDate = tomorrow.toISOString().split('T')[0];
        dateInput.value = formattedDate;
        
        // Set default time to 7:00 PM
        timeInput.value = '19:00';
    }

    // Prevent selecting past dates
    function restrictPastDates() {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        dateInput.min = formattedToday;
        
        // Set max date to 3 months from now
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        const formattedMax = threeMonthsLater.toISOString().split('T')[0];
        dateInput.max = formattedMax;
    }

    // Update available time slots based on selected date
    function updateAvailableTimeSlots() {
        const selectedDate = new Date(dateInput.value);
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Clear existing time options
        timeInput.innerHTML = '';
        
        // Define open hours based on day of week
        let openTime, closeTime;
        
        if (dayOfWeek === 0) { // Sunday
            openTime = 11; // 11 AM
            closeTime = 22; // 10 PM
        } else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Mon-Thu
            openTime = 12; // 12 PM
            closeTime = 23; // 11 PM
        } else { // Fri-Sat
            openTime = 12; // 12 PM
            closeTime = 24; // 12 AM
        }
        
        // Create time slots in 30-minute intervals
        for (let hour = openTime; hour < closeTime; hour++) {
            for (let minute of ['00', '30']) {
                const timeValue = `${hour.toString().padStart(2, '0')}:${minute}`;
                timeInput.value = timeValue;
            }
        }
        
        // Default to a reasonable dinner time
        timeInput.value = '19:00';
    }

    // Show confirmation modal/message
    function showConfirmation() {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'confirmation-modal';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '9999';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.borderRadius = '10px';
        modalContent.style.padding = '30px';
        modalContent.style.maxWidth = '500px';
        modalContent.style.textAlign = 'center';
        modalContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        modalContent.style.color = '#333';
        
        // Add content to modal
        const heading = document.createElement('h2');
        heading.textContent = 'Reservation Confirmed!';
        heading.style.color = '#C1272D';
        heading.style.marginBottom = '20px';
        
        const message = document.createElement('p');
        message.innerHTML = `Thank you, <b>${nameInput.value}</b>!<br>
                            Your reservation for <b>${paxInput.value} guests</b> has been confirmed for<br>
                            <b>${formatDate(dateInput.value)}</b> at <b>${formatTime(timeInput.value)}</b>.<br><br>
                            A confirmation email has been sent to ${emailInput.value}.<br>
                            We look forward to serving you!`;
        message.style.lineHeight = '1.6';
        message.style.marginBottom = '30px';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'CLOSE';
        closeButton.style.backgroundColor = '#FEC200';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.letterSpacing = '0.05rem';
        
        // Add click event to close modal
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
            resetForm();
        });
        
        // Assemble modal
        modalContent.appendChild(heading);
        modalContent.appendChild(message);
        modalContent.appendChild(closeButton);
        modalContainer.appendChild(modalContent);
        
        // Add modal to page
        document.body.appendChild(modalContainer);
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    // Format time for display
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    // Reset form after successful submission
    function resetForm() {
        form.reset();
        setDefaultDateTime();
    }

    // Create and show alert function
    function showAlert(title, message, type) {
        // Create alert container
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '10000';
        alertContainer.style.maxWidth = '350px';
        alertContainer.style.padding = '15px 20px';
        alertContainer.style.borderRadius = '5px';
        alertContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        alertContainer.style.display = 'flex';
        alertContainer.style.flexDirection = 'column';
        alertContainer.style.gap = '10px';
        alertContainer.style.animation = 'slideIn 0.3s ease-out forwards';
        
        // Set colors based on alert type
        if (type === 'success') {
            alertContainer.style.backgroundColor = '#4CAF50';
            alertContainer.style.borderLeft = '5px solid #2E7D32';
        } else if (type === 'error') {
            alertContainer.style.backgroundColor = '#F44336';
            alertContainer.style.borderLeft = '5px solid #B71C1C';
        } else if (type === 'warning') {
            alertContainer.style.backgroundColor = '#FF9800';
            alertContainer.style.borderLeft = '5px solid #E65100';
        } else {
            alertContainer.style.backgroundColor = '#2196F3';
            alertContainer.style.borderLeft = '5px solid #0D47A1';
        }
        
        // Create alert title
        const alertTitle = document.createElement('h3');
        alertTitle.textContent = title;
        alertTitle.style.margin = '0';
        alertTitle.style.color = '#fff';
        alertTitle.style.fontSize = '18px';
        
        // Create alert message
        const alertMessage = document.createElement('p');
        alertMessage.textContent = message;
        alertMessage.style.margin = '0';
        alertMessage.style.color = '#fff';
        alertMessage.style.fontSize = '14px';
        
        // Create progress bar for auto-dismiss
        const progressBar = document.createElement('div');
        progressBar.className = 'alert-progress';
        progressBar.style.width = '100%';
        progressBar.style.height = '3px';
        progressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        progressBar.style.position = 'relative';
        progressBar.style.marginTop = '5px';
        
        const progress = document.createElement('div');
        progress.style.height = '100%';
        progress.style.width = '100%';
        progress.style.backgroundColor = '#fff';
        progress.style.animation = 'progressShrink 5s linear forwards';
        
        // Assemble alert
        progressBar.appendChild(progress);
        alertContainer.appendChild(alertTitle);
        alertContainer.appendChild(alertMessage);
        alertContainer.appendChild(progressBar);
        
        // Add to DOM
        document.body.appendChild(alertContainer);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertContainer.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(alertContainer)) {
                    document.body.removeChild(alertContainer);
                }
            }, 300);
        }, 5000);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes progressShrink {
                from { width: 100%; }
                to { width: 0%; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize modal windows for Privacy Policy and Terms & Conditions
    initializeModals();

    // Function to initialize modal windows for Privacy Policy and Terms
    function initializeModals() {
        // Create privacy policy modal
        createModal('privacy-modal', 'Privacy Policy', `
            <h3>Privacy Policy</h3>
            <p>We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            <p>The personal information collected through this reservation form will be used solely for the purpose of managing your restaurant reservation and, if you opt in, sending promotional materials.</p>
            <p>We do not share your information with third parties except as necessary to fulfill our services or as required by law.</p>
        `);
        
        // Create terms and conditions modal
        createModal('termsModal', 'Terms & Conditions', `
            <h3>Terms & Conditions</h3>
            <p>By making a reservation, you agree to the following terms:</p>
            <ul>
                <li>We hold reservations for 15 minutes after the scheduled time, after which the table may be released.</li>
                <li>For parties of 6 or more, a credit card is required to secure the reservation.</li>
                <li>Cancellations must be made at least 24 hours in advance to avoid a cancellation fee.</li>
                <li>For special events and large groups, special terms may apply.</li>
                <li>We reserve the right to refuse service to anyone.</li>
            </ul>
        `);
        
        // Add event listeners for opening modals
        document.querySelector('.open-button').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('privacy-modal').style.display = 'flex';
        });
        
        document.querySelector('.open-button').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('termsModal').style.display = 'flex';
        });
    }

    // Helper function to create modal
    function createModal(id, title, content) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.zIndex = '9999';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.margin = 'auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
        modalContent.style.width = '80%';
        modalContent.style.maxWidth = '600px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflow = 'auto';
        modalContent.style.color = '#333';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-modal';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.color = '#aaa';
        closeBtn.style.float = 'right';
        closeBtn.style.fontSize = '28px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.cursor = 'pointer';
        
        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.color = '#C1272D';
        titleEl.style.marginBottom = '20px';
        
        const contentEl = document.createElement('div');
        contentEl.innerHTML = content;
        contentEl.style.lineHeight = '1.6';
        
        // Add close button functionality
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Assemble modal
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(titleEl);
        modalContent.appendChild(contentEl);
        modal.appendChild(modalContent);
        
        // Add to document
        document.body.appendChild(modal);
        
        return modal;
    }
});