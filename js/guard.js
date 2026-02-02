// guard.js - Page protection based on user roles

// Protect page for specific role
function protect(requiredRole) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    // Not logged in
    showAlert('Please login to access this page', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return false;
  }
  
  if (user.role !== requiredRole) {
    // Wrong role
    showAlert(`Access denied. This page is for ${requiredRole}s only.`, 'danger');
    
    // Redirect based on user's actual role
    setTimeout(() => {
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
    }, 2000);
    
    return false;
  }
  
  // User has correct role
  updateUserDisplay(user);
  return true;
}

// Protect multiple roles
function protectRoles(allowedRoles) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    showAlert('Please login to access this page', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return false;
  }
  
  if (!allowedRoles.includes(user.role)) {
    showAlert('Access denied. You do not have permission to view this page.', 'danger');
    
    setTimeout(() => {
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
    }, 2000);
    
    return false;
  }
  
  updateUserDisplay(user);
  return true;
}

// Check auth for API calls or specific actions
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    return {
      authenticated: false,
      message: 'Not authenticated'
    };
  }
  
  return {
    authenticated: true,
    user: user
  };
}

// Check specific permission
function hasPermission(permission) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) return false;
  
  // Define permissions for each role
  const permissions = {
    admin: [
      'view_dashboard',
      'manage_users',
      'manage_products',
      'view_all_orders',
      'manage_categories',
      'view_analytics',
      'manage_settings'
    ],
    seller: [
      'view_dashboard',
      'manage_own_products',
      'view_own_orders',
      'view_analytics',
      'update_profile'
    ],
    buyer: [
      'view_products',
      'place_orders',
      'view_own_orders',
      'manage_cart',
      'write_reviews',
      'update_profile'
    ]
  };
  
  return permissions[user.role]?.includes(permission) || false;
}

// Update UI with user info
function updateUserDisplay(user) {
  // Update elements with user-specific data
  const userEmailElements = document.querySelectorAll('.user-email');
  const userNameElements = document.querySelectorAll('.user-name');
  const userRoleElements = document.querySelectorAll('.user-role');
  
  userEmailElements.forEach(el => {
    el.textContent = user.email;
  });
  
  userNameElements.forEach(el => {
    el.textContent = user.name;
  });
  
  userRoleElements.forEach(el => {
    el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  });
  
  // Update seller-specific elements
  if (user.role === 'seller') {
    const sellerElements = document.querySelectorAll('.seller-only');
    sellerElements.forEach(el => {
      el.style.display = 'block';
    });
  }
  
  // Update admin-specific elements
  if (user.role === 'admin') {
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
      el.style.display = 'block';
    });
  }
}

// Redirect if not authenticated
function requireAuth(redirectUrl = 'login.html') {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    showAlert('Please login to continue', 'warning');
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
    return false;
  }
  
  return true;
}

// Get current user info
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Get user by ID
function getUserById(userId) {
  const users = JSON.parse(localStorage.getItem('users'));
  return users.find(user => user.id === userId);
}

// Check if user can edit product
function canEditProduct(productId) {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (user.role === 'admin') return true;
  
  if (user.role === 'seller') {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    return product && product.seller === user.email;
  }
  
  return false;
}

// Check if user can delete product
function canDeleteProduct(productId) {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (user.role === 'admin') return true;
  
  if (user.role === 'seller') {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    return product && product.seller === user.email;
  }
  
  return false;
}

// Check if user can view order
function canViewOrder(orderId) {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (user.role === 'admin') return true;
  
  const orders = JSON.parse(localStorage.getItem('orders'));
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return false;
  
  if (user.role === 'seller') {
    // Seller can view if they have products in the order
    const products = JSON.parse(localStorage.getItem('products'));
    const sellerProducts = products.filter(p => p.seller === user.email);
    const sellerProductIds = sellerProducts.map(p => p.id);
    
    return order.items.some(item => sellerProductIds.includes(item.id));
  }
  
  if (user.role === 'buyer') {
    return order.customerEmail === user.email;
  }
  
  return false;
}

// Activity logger
function logActivity(action, details = {}) {
  const user = getCurrentUser();
  if (!user) return;
  
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  
  activities.unshift({
    id: Date.now(),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: action,
    details: details,
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1' // Simulated IP
  });
  
  // Keep only last 100 activities
  if (activities.length > 100) {
    activities.length = 100;
  }
  
  localStorage.setItem('recentActivities', JSON.stringify(activities));
}

// Show alert function
function showAlert(message, type = 'info') {
  const alertHTML = `
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
  document.body.insertAdjacentHTML('beforeend', alertHTML);
  
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
window.protect = protect;
window.protectRoles = protectRoles;
window.checkAuth = checkAuth;
window.hasPermission = hasPermission;
window.requireAuth = requireAuth;
window.getCurrentUser = getCurrentUser;
window.canEditProduct = canEditProduct;
window.canDeleteProduct = canDeleteProduct;
window.canViewOrder = canViewOrder;
window.logActivity = logActivity;
window.showAlert = showAlert;

// Auto-protect pages on load
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Define which pages require which roles
  const pageProtection = {
    'admin.html': 'admin',
    'seller.html': 'seller',
    'profile.html': ['admin', 'seller', 'buyer'],
    'orders.html': ['admin', 'seller', 'buyer'],
    'cart.html': 'buyer'
  };
  
  if (pageProtection[currentPage]) {
    if (Array.isArray(pageProtection[currentPage])) {
      protectRoles(pageProtection[currentPage]);
    } else {
      protect(pageProtection[currentPage]);
    }
  }
});