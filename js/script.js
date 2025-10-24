function showEnrollmentModal(courseName) {
    document.getElementById('courseTitle').textContent = courseName;
    document.getElementById('enrollmentModal').style.display = 'block';
}

function showBundleModal(bundleName) {
    document.getElementById('courseTitle').textContent = bundleName;
    document.getElementById('enrollmentModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('enrollmentModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('enrollmentModal');
    if (event.target === modal) {
        closeModal();
    }
}

document.getElementById('waitlistForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you! We'll notify you at ${email} when courses launch.`);
    closeModal();
    this.reset();
});
