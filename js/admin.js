// admin.js - Admin dashboard functionality

// Protect admin pages
protect('admin');

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadAdminDashboard();
  setupAdminEventListeners();
});

// Load admin dashboard
function loadAdminDashboard() {
  loadStats();
  loadRecentActivities();
  loadUsersTable();
  loadRecentOrders();
  loadQuickStats();
}

// Load statistics
function loadStats() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  
  // Calculate counts
  const totalUsers = users.length;
  const totalBuyers = users.filter(u => u.role === 'buyer').length;
  const totalSellers = users.filter(u => u.role === 'seller').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalProducts = products.length;
  const outOfStockProducts = products.filter(p => p.stock <= 0).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Load stats into DOM
  const statsContainer = document.getElementById('stats');
  if (!statsContainer) return;
  
  statsContainer.innerHTML = `
    <div class="row mb-4">
      <!-- Users Stats -->
      <div class="col-md-3 mb-3">
        <div class="card bg-primary text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-title">Total Users</h6>
                <h2 class="mb-0">${totalUsers}</h2>
              </div>
              <i class="bi bi-people display-6 opacity-50"></i>
            </div>
            <div class="mt-3">
              <small>Buyers: ${totalBuyers} | Sellers: ${totalSellers} | Admins: ${totalAdmins}</small>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Products Stats -->
      <div class="col-md-3 mb-3">
        <div class="card bg-success text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-title">Total Products</h6>
                <h2 class="mb-0">${totalProducts}</h2>
              </div>
              <i class="bi bi-box-seam display-6 opacity-50"></i>
            </div>
            <div class="mt-3">
              <small>Active: ${totalProducts - outOfStockProducts} | Out of Stock: ${outOfStockProducts}</small>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Orders Stats -->
      <div class="col-md-3 mb-3">
        <div class="card bg-info text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-title">Total Orders</h6>
                <h2 class="mb-0">${totalOrders}</h2>
              </div>
              <i class="bi bi-cart-check display-6 opacity-50"></i>
            </div>
            <div class="mt-3">
              <small>Pending: ${pendingOrders} | Delivered: ${deliveredOrders}</small>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Revenue Stats -->
      <div class="col-md-3 mb-3">
        <div class="card bg-warning text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-title">Total Revenue</h6>
                <h2 class="mb-0">ETB ${totalRevenue.toLocaleString('en-ET')}</h2>
              </div>
              <i class="bi bi-currency-exchange display-6 opacity-50"></i>
            </div>
            <div class="mt-3">
              <small>2026 Revenue</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Row -->
    <div class="row mb-4">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Recent Activities</h5>
          </div>
          <div class="card-body">
            <div id="activities-list"></div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Quick Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-outline-primary" onclick="addTestUser()">
                <i class="bi bi-person-plus me-2"></i> Add Test User
              </button>
              <button class="btn btn-outline-success" onclick="addTestProduct()">
                <i class="bi bi-plus-circle me-2"></i> Add Test Product
              </button>
              <button class="btn btn-outline-info" onclick="addTestOrder()">
                <i class="bi bi-cart-plus me-2"></i> Add Test Order
              </button>
              <button class="btn btn-outline-warning" onclick="clearAllData()">
                <i class="bi bi-trash me-2"></i> Clear Test Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Users and Orders Row -->
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Recent Users</h5>
            <a href="admin-users.html" class="btn btn-sm btn-outline-primary">View All</a>
          </div>
          <div class="card-body">
            <div id="users-table"></div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Recent Orders</h5>
            <a href="admin-orders.html" class="btn btn-sm btn-outline-primary">View All</a>
          </div>
          <div class="card-body">
            <div id="orders-list"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Load dynamic content
  loadRecentActivities();
  loadUsersTable();
  loadRecentOrders();
}

// Load recent activities
function loadRecentActivities() {
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  const container = document.getElementById('activities-list');
  
  if (!container) return;
  
  const recentActivities = activities.slice(0, 5); // Show only 5 most recent
  
  if (recentActivities.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-3">No activities yet</p>';
    return;
  }
  
  container.innerHTML = recentActivities.map(activity => `
    <div class="d-flex border-bottom pb-3 mb-3">
      <div class="flex-shrink-0">
        <div class="rounded-circle bg-${getActivityColor(activity.type)} text-white p-2">
          <i class="bi ${getActivityIcon(activity.type)}"></i>
        </div>
      </div>
      <div class="flex-grow-1 ms-3">
        <p class="mb-1">${activity.message}</p>
        <small class="text-muted">
          <i class="bi bi-clock me-1"></i> ${formatDateTime(activity.timestamp)}
        </small>
      </div>
    </div>
  `).join('');
}

// Load users table
function loadUsersTable() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const container = document.getElementById('users-table');
  
  if (!container) return;
  
  const recentUsers = users.slice(0, 5); // Show only 5 most recent
  
  if (recentUsers.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-3">No users yet</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${recentUsers.map(user => `
            <tr onclick="viewUserDetails(${user.id})" style="cursor: pointer;">
              <td>${user.name || 'N/A'}</td>
              <td>${user.email}</td>
              <td><span class="badge bg-${getRoleColor(user.role)}">${user.role}</span></td>
              <td><span class="badge bg-${user.status === 'active' ? 'success' : 'warning'}">${user.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Load recent orders
function loadRecentOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const container = document.getElementById('orders-list');
  
  if (!container) return;
  
  const recentOrders = orders.slice(0, 5); // Show only 5 most recent
  
  if (recentOrders.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-3">No orders yet</p>';
    return;
  }
  
  container.innerHTML = recentOrders.map(order => `
    <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
      <div>
        <h6 class="mb-0">${order.id}</h6>
        <small class="text-muted">${order.customerName}</small>
      </div>
      <div class="text-end">
        <div class="fw-bold">ETB ${order.total.toLocaleString('en-ET')}</div>
        <span class="badge bg-${getOrderStatusColor(order.status)}">${order.status}</span>
      </div>
    </div>
  `).join('');
}

// Load quick stats in sidebar
function loadQuickStats() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  
  const container = document.getElementById('quickStats');
  if (container) {
    container.innerHTML = `
      <div class="mb-2">
        <small>Users: <strong>${totalUsers}</strong></small>
      </div>
      <div class="mb-2">
        <small>Products: <strong>${totalProducts}</strong></small>
      </div>
      <div>
        <small>Orders: <strong>${totalOrders}</strong></small>
      </div>
    `;
  }
}

// Get activity icon
function getActivityIcon(type) {
  const icons = {
    'user_registered': 'bi-person-plus',
    'user_login': 'bi-box-arrow-in-right',
    'user_logout': 'bi-box-arrow-left',
    'product_added': 'bi-plus-circle',
    'product_updated': 'bi-pencil',
    'product_deleted': 'bi-trash',
    'order_placed': 'bi-cart-check',
    'order_updated': 'bi-cart',
    'profile_updated': 'bi-person',
    'password_changed': 'bi-key',
    'newsletter_subscription': 'bi-envelope',
    'cart_add': 'bi-cart-plus',
    'admin_login': 'bi-shield-check'
  };
  return icons[type] || 'bi-activity';
}

// Get activity color
function getActivityColor(type) {
  const colors = {
    'user_registered': 'success',
    'user_login': 'info',
    'user_logout': 'secondary',
    'product_added': 'primary',
    'product_updated': 'warning',
    'product_deleted': 'danger',
    'order_placed': 'success',
    'order_updated': 'info',
    'profile_updated': 'primary',
    'password_changed': 'warning',
    'newsletter_subscription': 'info',
    'cart_add': 'success',
    'admin_login': 'dark'
  };
  return colors[type] || 'secondary';
}

// Get role color
function getRoleColor(role) {
  const colors = {
    'admin': 'danger',
    'seller': 'warning',
    'buyer': 'success'
  };
  return colors[role] || 'secondary';
}

// Get order status color
function getOrderStatusColor(status) {
  const colors = {
    'pending': 'warning',
    'processing': 'info',
    'shipped': 'primary',
    'delivered': 'success',
    'cancelled': 'danger'
  };
  return colors[status] || 'secondary';
}

// Format date and time
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// View user details
function viewUserDetails(userId) {
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    showAlert('User not found', 'danger');
    return;
  }
  
  // Create modal
  const modalHTML = `
    <div class="modal fade" id="userDetailsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="rounded-circle bg-${getRoleColor(user.role)} text-white d-inline-flex p-3 mb-2">
                <i class="bi bi-person display-6"></i>
              </div>
              <h4>${user.name}</h4>
              <span class="badge bg-${getRoleColor(user.role)}">${user.role}</span>
            </div>
            
            <div class="mb-3">
              <label class="form-label text-muted">Email</label>
              <p class="form-control bg-light">${user.email}</p>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label text-muted">Phone</label>
                <p class="form-control bg-light">${user.phone || 'Not provided'}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">Status</label>
                <p class="form-control bg-light">
                  <span class="badge bg-${user.status === 'active' ? 'success' : 'warning'}">
                    ${user.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label text-muted">Address</label>
              <p class="form-control bg-light">${user.address || 'Not provided'}</p>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label text-muted">Registered</label>
                <p class="form-control bg-light">${user.registered || 'Unknown'}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted">Last Login</label>
                <p class="form-control bg-light">${user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}</p>
              </div>
            </div>
            
            <div class="d-grid gap-2">
              <button class="btn btn-${user.status === 'active' ? 'warning' : 'success'}" 
                      onclick="toggleUserStatus(${user.id})">
                ${user.status === 'active' ? 'Deactivate User' : 'Activate User'}
              </button>
              <button class="btn btn-danger" onclick="deleteUser(${user.id})">
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove existing modal if any
  const existingModal = document.getElementById('userDetailsModal');
  if (existingModal) existingModal.remove();
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const userModal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
  userModal.show();
  
  // Remove modal when hidden
  document.getElementById('userDetailsModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// Toggle user status
function toggleUserStatus(userId) {
  if (!confirm('Are you sure you want to change this user\'s status?')) {
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    showAlert('User not found', 'danger');
    return;
  }
  
  const currentStatus = users[userIndex].status;
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  
  users[userIndex].status = newStatus;
  localStorage.setItem('users', JSON.stringify(users));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'user_updated',
    message: `User ${users[userIndex].name} status changed to ${newStatus}`,
    timestamp: new Date().toISOString(),
    userId: userId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  // Close modal and reload
  const modal = bootstrap.Modal.getInstance(document.getElementById('userDetailsModal'));
  modal.hide();
  
  loadAdminDashboard();
  showAlert(`User status updated to ${newStatus}`, 'success');
}

// Delete user
function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users'));
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    showAlert('User not found', 'danger');
    return;
  }
  
  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'user_deleted',
    message: `User ${deletedUser.name} deleted`,
    timestamp: new Date().toISOString(),
    userId: userId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  // Close modal and reload
  const modal = bootstrap.Modal.getInstance(document.getElementById('userDetailsModal'));
  modal.hide();
  
  loadAdminDashboard();
  showAlert('User deleted successfully', 'success');
}

// Add test user
function addTestUser() {
  const users = JSON.parse(localStorage.getItem('users'));
  const testUserId = Date.now();
  
  const testUser = {
    id: testUserId,
    name: `Test User ${testUserId}`,
    email: `test${testUserId}@example.com`,
    password: 'test123',
    role: 'buyer',
    phone: '+251 911 000 000',
    address: 'Test Address, Addis Ababa',
    registered: new Date().toISOString().split('T')[0],
    status: 'active',
    lastLogin: null
  };
  
  users.push(testUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'user_registered',
    message: `Test user added: ${testUser.name}`,
    timestamp: new Date().toISOString(),
    userId: testUserId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  loadAdminDashboard();
  showAlert('Test user added successfully', 'success');
}

// Add test product
function addTestProduct() {
  const products = JSON.parse(localStorage.getItem('products'));
  const testProductId = Date.now();
  
  const testProduct = {
    id: testProductId,
    name: `Test Product ${testProductId}`,
    price: Math.floor(Math.random() * 1000) + 100,
    category: ['food', 'clothing', 'electronics', 'home'][Math.floor(Math.random() * 4)],
    stock: Math.floor(Math.random() * 100),
    image: 'https://via.placeholder.com/300x300?text=Test+Product',
    seller: 'seller@ethioshop.com',
    description: 'This is a test product added by admin for testing purposes.',
    createdAt: new Date().toISOString(),
    rating: 4.5,
    reviews: 0
  };
  
  products.push(testProduct);
  localStorage.setItem('products', JSON.stringify(products));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'product_added',
    message: `Test product added: ${testProduct.name}`,
    timestamp: new Date().toISOString(),
    productId: testProductId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  loadAdminDashboard();
  showAlert('Test product added successfully', 'success');
}

// Add test order
function addTestOrder() {
  const orders = JSON.parse(localStorage.getItem('orders'));
  const products = JSON.parse(localStorage.getItem('products'));
  const users = JSON.parse(localStorage.getItem('users'));
  
  const testOrderId = `ORD${Date.now().toString().slice(-6)}`;
  const buyer = users.find(u => u.role === 'buyer');
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  
  if (!buyer || !randomProduct) {
    showAlert('Cannot create test order. Need at least one buyer and product.', 'warning');
    return;
  }
  
  const testOrder = {
    id: testOrderId,
    customerEmail: buyer.email,
    customerName: buyer.name,
    customerPhone: buyer.phone,
    shippingAddress: buyer.address,
    shippingCity: 'addis',
    items: [
      {
        id: randomProduct.id,
        name: randomProduct.name,
        price: randomProduct.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        image: randomProduct.image
      }
    ],
    subtotal: randomProduct.price * 2,
    shipping: 50,
    tax: randomProduct.price * 2 * 0.15,
    total: randomProduct.price * 2 + 50 + (randomProduct.price * 2 * 0.15),
    date: new Date().toISOString(),
    status: 'pending',
    paymentMethod: 'cash_on_delivery',
    trackingNumber: `TEST${Date.now().toString().slice(-8)}`,
    deliveryDate: null
  };
  
  orders.push(testOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'order_placed',
    message: `Test order added: ${testOrderId}`,
    timestamp: new Date().toISOString(),
    orderId: testOrderId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  loadAdminDashboard();
  showAlert('Test order added successfully', 'success');
}

// Clear all test data
function clearAllData() {
  if (!confirm('Are you sure you want to clear all test data? This will remove all test users, products, and orders.')) {
    return;
  }
  
  // Reset to default data
  localStorage.clear();
  
  // Reload default data
  if (typeof initData === 'function') {
    initData();
  } else {
    // Reload page to trigger data.js initialization
    location.reload();
  }
  
  showAlert('All test data cleared successfully', 'success');
}

// Setup admin event listeners
function setupAdminEventListeners() {
  // Auto-refresh dashboard every 30 seconds
  setInterval(loadAdminDashboard, 30000);
}

// Make functions globally available
window.viewUserDetails = viewUserDetails;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.addTestUser = addTestUser;
window.addTestProduct = addTestProduct;
window.addTestOrder = addTestOrder;
window.clearAllData = clearAllData;