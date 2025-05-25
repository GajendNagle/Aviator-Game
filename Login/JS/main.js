// Mouse tracking for airplane movement
document.addEventListener('DOMContentLoaded', () => {
    const airplane = document.querySelector('.airplane');
    const container = document.querySelector('.aviator-bg');

    // Initial positions for smooth animation
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Create additional airplanes for background
    for (let i = 0; i < 3; i++) {
        const additionalAirplane = document.createElement('div');
        additionalAirplane.classList.add('airplane');
        additionalAirplane.style.animationDelay = `${i * 20}s`;
        additionalAirplane.style.opacity = '0.3';
        document.querySelector('.airplane-container').appendChild(additionalAirplane);
    }

    // Subtle airplane movement following cursor
    container.addEventListener('mousemove', (e) => {
        const containerRect = container.getBoundingClientRect();

        // Calculate normalized position (0-1) within container
        const normalizedX = (e.clientX - containerRect.left) / containerRect.width;
        const normalizedY = (e.clientY - containerRect.top) / containerRect.height;

        // Set target position with some boundaries to keep airplane on screen
        targetX = normalizedX * 30 - 15; // Move ±15px horizontally
        targetY = normalizedY * 20 - 10; // Move ±10px vertically
    });

    // Animation loop for smooth movement
    function animateAirplane() {
        // Smooth movement using lerp (linear interpolation)
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        // Apply transformation to the main airplane
        if (airplane) {
            airplane.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentX * 0.5}deg) scale(0.8)`;
        }

        requestAnimationFrame(animateAirplane);
    }

    animateAirplane();

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Change icon based on password visibility
            const eyeIcon = togglePassword.querySelector('.eye-icon');
            if (type === 'password') {
                eyeIcon.innerHTML = '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
            } else {
                eyeIcon.innerHTML = '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>';
            }
        });
    }

    // Add glow effect to form fields on focus
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('focus', () => {
            control.style.boxShadow = '0 0 15px rgba(255, 77, 77, 0.5)';
        });

        control.addEventListener('blur', () => {
            control.style.boxShadow = '';
        });
    });

    // Remember me functionality
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox) {
        // Check if we have saved credentials
        const savedUsername = localStorage.getItem('aviator_username');
        if (savedUsername) {
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.value = savedUsername;
                rememberMeCheckbox.checked = true;
            }
        }

        // Handle remember me checkbox changes
        rememberMeCheckbox.addEventListener('change', () => {
            if (!rememberMeCheckbox.checked) {
                localStorage.removeItem('aviator_username');
            }
        });
    }

    // Add button click animation effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // Create star twinkling effect
    createStars();
});

// Create twinkling stars in the background
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;

    // Clear existing stars
    starsContainer.innerHTML = '';

    // Add individual stars with random properties
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random positioning
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Random size (1-3px)
        const size = Math.random() * 2 + 1;

        // Random twinkle animation duration (3-8s)
        const duration = Math.random() * 5 + 3;

        // Set styles
        star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background-color: white;
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      opacity: ${Math.random() * 0.7 + 0.3};
      box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
      animation: twinkle ${duration}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;

        starsContainer.appendChild(star);
    }
}

// Define the twinkle animation in a style element
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% {
      opacity: 0.2;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.2);
    }
  }
`;
document.head.appendChild(style);