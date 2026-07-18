document.addEventListener('DOMContentLoaded', function() {
    const switchBtn = document.getElementById('switch');
    const lamp = document.querySelector('.lamp');

    switchBtn.addEventListener('click', function() {
        lamp.classList.toggle('on');
        switchBtn.classList.toggle('active');
    });

    // Form submission
    const form = document.querySelector('.login-form');
    const submitBtn = document.querySelector('button');

    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const username = document.querySelector('input[type="text"]');
        const password = document.querySelector('input[type="password"]');

        if (username.value && password.value) {
            alert(`Welcome ${username.value}! Login successful.`);
            username.value = '';
            password.value = '';
        } else {
            alert('Please fill in all fields');
        }
    });

    // Enter key to submit
    document.querySelector('input[type="password"]').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
});
