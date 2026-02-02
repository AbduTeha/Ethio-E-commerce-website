// auth.js - Authentication functions

// Check if user is logged in
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user ? user : null;
}

// Login function
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!email || !password) {
    showAlert('Please enter both email and password', 'warning');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showAlert('Invalid email or password', 'danger');
    return;
  }
  
  if (user.status !== 'active') {
    showAlert('Your account is not active. Please contact support.', 'warning');
    return;
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Update user in users array
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Add to recent activities
  addActivity(`${user.role}_login`, `${user.name} logged in`);
  
  // Redirect based on role
  switch(user.role) {
    case 'admin':
      window.location.href = 'admin.html';
      break;
    case 'seller':
      window.location.href = 'seller.html';
      break;
    case 'buyer':
      window.location.href = 'index.html';
      break;
    default:
      window.location.href = 'index.html';
  }
  
  showAlert('Login successful!', 'success');
}

// Registration function (called from register.html)
function register() {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const role = document.getElementById('role').value;
  const terms = document.getElementById('terms').checked;
  
  // Validation
  if (!fullName || !email || !password || !confirmPassword || !phone || !address) {
    showAlert('Please fill in all fields', 'warning');
    return;
  }
  
  if (password !== confirmPassword) {
    showAlert('Passwords do not match', 'warning');
    return;
  }
  
  if (!terms) {
    showAlert('You must agree to the Terms & Conditions', 'warning');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users'));
  
  // Check if email already exists
  if (users.some(u => u.email === email)) {
    showAlert('Email already registered. Please login instead.', 'warning');
    return;
  }
  
  // Create new user
  const newUser = {
    id: Date.now(),
    name: fullName,
    email: email,
    password: password,
    role: role,
    phone: phone,
    address: address,
    registered: new Date().toISOString().split('T')[0],
    status: 'active',
    lastLogin: null
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Add to recent activities
  addActivity('user_registered', `New ${role} registered: ${fullName}`);
  
  // Auto login after registration
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  showAlert('Registration successful! Welcome to EthioShop.', 'success');
  
  // Redirect based on role
  setTimeout(() => {
    switch(role) {
      case 'seller':
        window.location.href = 'seller.html';
        break;
      case 'buyer':
      default:
        window.location.href = 'index.html';
    }
  }, 1500);
}

// Logout function
function logout() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    addActivity('user_logout', `${user.name} logged out`);
  }
  
  localStorage.removeItem('currentUser');
  
  // If on protected page, redirect to login
  const protectedPages = ['admin.html', 'seller.html', 'profile.html', 'orders.html', 'cart.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    window.location.href = 'login.html';
  } else {
    window.location.href = 'index.html';
  }
  
  showAlert('Logged out successfully', 'info');
}

// Check if user has specific role
function hasRole(requiredRole) {
  const user = checkAuth();
  return user && user.role === requiredRole;
}

// Redirect if not logged in
function requireAuth(requiredRole = null) {
  const user = checkAuth();
  
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    showAlert('Access denied. You do not have permission to view this page.', 'danger');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Update user profile
function updateProfile() {
  const user = checkAuth();
  if (!user) return false;
  
  const name = document.getElementById('profileName')?.value;
  const phone = document.getElementById('profilePhone')?.value;
  const address = document.getElementById('profileAddress')?.value;
  
  if (!name || !phone || !address) {
    showAlert('Please fill in all fields', 'warning');
    return false;
  }
  
  const users = JSON.parse(localStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex !== -1) {
    users[userIndex].name = name;
    users[userIndex].phone = phone;
    users[userIndex].address = address;
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user
    const updatedUser = users[userIndex];
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    addActivity('profile_updated', `${name} updated their profile`);
    showAlert('Profile updated successfully', 'success');
    return true;
  }
  
  return false;
}

// Change password
function changePassword() {
  const user = checkAuth();
  if (!user) return false;
  
  const currentPassword = document.getElementById('currentPassword')?.value;
  const newPassword = document.getElementById('newPassword')?.value;
  const confirmPassword = document.getElementById('confirmNewPassword')?.value;
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    showAlert('Please fill in all password fields', 'warning');
    return false;
  }
  
  if (currentPassword !== user.password) {
    showAlert('Current password is incorrect', 'danger');
    return false;
  }
  
  if (newPassword !== confirmPassword) {
    showAlert('New passwords do not match', 'warning');
    return false;
  }
  
  if (newPassword.length < 6) {
    showAlert('Password must be at least 6 characters', 'warning');
    return false;
  }
  
  const users = JSON.parse(localStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === user.id);
  
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user
    user.password = newPassword;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    addActivity('password_changed', `${user.name} changed their password`);
    showAlert('Password changed successfully', 'success');
    return true;
  }
  
  return false;
}

// Utility function to add activity
function addActivity(type, message) {
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: type,
    message: message,
    timestamp: new Date().toISOString(),
    userId: JSON.parse(localStorage.getItem('currentUser'))?.id
  });
  
  // Keep only last 50 activities
  if (activities.length > 50) {
    activities.length = 50;
  }
  
  localStorage.setItem('recentActivities', JSON.stringify(activities));
}

// Show alert function
function showAlert(message, type = 'info') {
  // Create toast notification
  const toastHTML = `
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  `;
  
  // Remove any existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());
  
  // Add new toast
  document.body.insertAdjacentHTML('beforeend', toastHTML);
  
  // Show toast
  const toastEl = document.querySelector('.toast');
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  
  // Remove toast after hiding
  toastEl.addEventListener('hidden.bs.toast', function() {
    toastEl.remove();
  });
}

// Make functions globally available
window.login = login;
window.logout = logout;
window.register = register;
window.updateProfile = updateProfile;
window.changePassword = changePassword;

// Check auth on page load
document.addEventListener('DOMContentLoaded', function() {
  const user = checkAuth();
  
  // Update UI elements based on auth status
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userMenu = document.getElementById('userMenu');
  
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (userMenu) {
      userMenu.innerHTML = `
        <span class="navbar-text me-3">Welcome, ${user.name}</span>
        <button onclick="logout()" class="btn btn-outline-light btn-sm">Logout</button>
      `;
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
});