// Initialize default admin user if no users exist
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        {
            username: 'admin',
            password: 'admin123',
            email: 'admin@example.com',
            isAdmin: true
        }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showErrorMessage('Invalid username or password');
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match');
        return;
    }

    const users = getUsers();
    if (users.some(u => u.username === username)) {
        showErrorMessage('Username already exists');
        return;
    }

    if (users.some(u => u.email === email)) {
        showErrorMessage('Email already registered');
        return;
    }

    const newUser = {
        username,
        email,
        password,
        isAdmin: false
    };

    users.push(newUser);
    saveUsers(users);
    
    showSuccessMessage('Registration successful! Redirecting to login...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Update navigation based on auth state
function updateNavigation() {
    const authLinks = document.getElementById('authLinks');
    if (!authLinks) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        authLinks.innerHTML = `
            ${currentUser.isAdmin ? '<a href="admin.html">Admin Panel</a>' : ''}
            <span>Welcome, ${currentUser.username}</span>
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        authLinks.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check admin access
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'login.html';
    }
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.querySelector('form');
    if (!document.querySelector('.error-message')) {
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    errorDiv.classList.add('active');
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.querySelector('.success-message') || document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.querySelector('form');
    if (!document.querySelector('.success-message')) {
        form.insertBefore(successDiv, form.firstChild);
    }
    
    successDiv.classList.add('active');
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', updateNavigation);