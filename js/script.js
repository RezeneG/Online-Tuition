// Enhanced modal functionality
function showEnrollmentModal(courseName) {
    document.getElementById('courseTitle').textContent = courseName;
    document.getElementById('enrollmentModal').style.display = 'block';
}

function showPaymentModal(courseName, price) {
    document.getElementById('paymentCourseTitle').textContent = courseName;
    document.getElementById('paymentAmount').textContent = price;
    document.getElementById('finalAmount').textContent = price;
    document.getElementById('paymentModal').style.display = 'block';
    closeModal(); // Close enrollment modal if open
}

function closeModal() {
    document.getElementById('enrollmentModal').style.display = 'none';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const enrollmentModal = document.getElementById('enrollmentModal');
    const paymentModal = document.getElementById('paymentModal');
    
    if (event.target === enrollmentModal) {
        closeModal();
    }
    if (event.target === paymentModal) {
        closePaymentModal();
    }
}

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        closePaymentModal();
    }
});

// Waitlist form handling
document.getElementById('waitlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you! We'll notify you at ${email} when courses launch.`);
    closeModal();
    this.reset();
});

// Payment form handling
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const button = this.querySelector('.payment-btn');
    const buttonText = button.querySelector('.btn-text');
    const buttonLoading = button.querySelector('.btn-loading');
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'block';
    button.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        alert('🎉 Payment Successful! Welcome to LearnX! Check your email for course access.');
        closePaymentModal();
        this.reset();
        
        // Reset button
        buttonText.style.display = 'block';
        buttonLoading.style.display = 'none';
        button.disabled = false;
    }, 2000);
});

// Smooth scrolling
function scrollToCourses() {
    document.querySelector('.courses-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// Add animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe course cards for animation
    document.querySelectorAll('.course-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});

// Format card number input
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.querySelector('input[placeholder="1234 1234 1234 1234"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue.substring(0, 19);
        });
    }

    // Format expiry date
    const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }
});
