// ui.js - UI components and shared functionality

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initUI();
  loadNavigation();
  updateCartCount();
  setupEventListeners();
});

// Initialize UI components
function initUI() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  
  // Set current year in footer
  const yearElements = document.querySelectorAll('.current-year');
  yearElements.forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

// Load navigation bar
function loadNavigation() {
  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <img src="https://cdn-icons-png.flaticon.com/512/2173/2173475.png" alt="EthioShop" height="40" class="me-2">
          <span class="fw-bold">EthioShop</span>
          <span class="ethio-flag ms-2"></span>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarMain">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="index.html">
                <i class="bi bi-house me-1"></i> Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="products.html">
                <i class="bi bi-shop me-1"></i> Products
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="blog.html">
                <i class="bi bi-newspaper me-1"></i> Blog
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="contact.html">
                <i class="bi bi-telephone me-1"></i> Contact
              </a>
            </li>
          </ul>
          
          <!-- Search Form -->
          <form class="d-flex me-3" id="navbarSearch" onsubmit="searchProducts(event)">
            <div class="input-group">
              <input type="text" class="form-control" id="searchInput" placeholder="Search products..." 
                     aria-label="Search" style="min-width: 250px;">
              <button class="btn btn-outline-light" type="submit">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </form>
          
          <!-- User Menu -->
          <div class="navbar-nav">
            ${getUserMenuHTML()}
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Quick Links Bar -->
    <div class="bg-light border-bottom">
      <div class="container">
        <div class="d-flex justify-content-center py-2">
          <a href="faq.html" class="text-decoration-none text-dark mx-3">
            <i class="bi bi-question-circle me-1"></i> FAQs
          </a>
          <a href="shipping.html" class="text-decoration-none text-dark mx-3">
            <i class="bi bi-truck me-1"></i> Shipping
          </a>
          <a href="returns.html" class="text-decoration-none text-dark mx-3">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Returns
          </a>
          <a href="privacy.html" class="text-decoration-none text-dark mx-3">
            <i class="bi bi-shield-check me-1"></i> Privacy
          </a>
        </div>
      </div>
    </div>
  `;
  
  // Insert navbar at beginning of body
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  
  // Load footer
  loadFooter();
}

// Get user menu HTML based on login status
function getUserMenuHTML() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    return `
      <li class="nav-item">
        <a class="nav-link" href="login.html">
          <i class="bi bi-box-arrow-in-right me-1"></i> Login
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="register.html">
          <i class="bi bi-person-plus me-1"></i> Register
        </a>
      </li>
    `;
  }
  
  let roleSpecificLinks = '';
  
  if (user.role === 'admin') {
    roleSpecificLinks = `
      <li class="nav-item">
        <a class="nav-link" href="admin.html">
          <i class="bi bi-speedometer2 me-1"></i> Admin
        </a>
      </li>
    `;
  } else if (user.role === 'seller') {
    roleSpecificLinks = `
      <li class="nav-item">
        <a class="nav-link" href="seller.html">
          <i class="bi bi-shop-window me-1"></i> Seller Hub
        </a>
      </li>
    `;
  } else if (user.role === 'buyer') {
    roleSpecificLinks = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-1"></i> My Account
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="profile.html">
            <i class="bi bi-person me-2"></i> Profile
          </a></li>
          <li><a class="dropdown-item" href="orders.html">
            <i class="bi bi-receipt me-2"></i> My Orders
          </a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="wishlist.html">
            <i class="bi bi-heart me-2"></i> Wishlist
          </a></li>
        </ul>
      </li>
    `;
  }
  
  return `
    ${roleSpecificLinks}
    <li class="nav-item">
      <a class="nav-link position-relative" href="cart.html">
        <i class="bi bi-cart3 me-1"></i> Cart
        <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">
          0
        </span>
      </a>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
        <i class="bi bi-person-check me-1"></i> ${user.name.split(' ')[0]}
      </a>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><span class="dropdown-item-text">
          <small>Signed in as</small><br>
          <strong>${user.email}</strong>
        </span></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="profile.html">
          <i class="bi bi-person me-2"></i> My Profile
        </a></li>
        <li><a class="dropdown-item" href="orders.html">
          <i class="bi bi-receipt me-2"></i> Order History
        </a></li>
        <li><a class="dropdown-item" href="settings.html">
          <i class="bi bi-gear me-2"></i> Settings
        </a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" onclick="logout()">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </a></li>
      </ul>
    </li>
  `;
}

// Load footer
function loadFooter() {
  const footerHTML = `
    <footer class="bg-dark text-light mt-5">
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-4 mb-4">
            <h5 class="mb-3">
              <img src="https://cdn-icons-png.flaticon.com/512/2173/2173475.png" alt="EthioShop" height="30" class="me-2">
              EthioShop
            </h5>
            <p class="mb-3">Your trusted Ethiopian e-commerce platform. Discover authentic products from the heart of Ethiopia.</p>
            <div class="d-flex gap-3">
              <a href="#" class="social-icon">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bi bi-twitter"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="#" class="social-icon">
                <i class="bi bi-telegram"></i>
              </a>
            </div>
          </div>
          
          <div class="col-lg-2 col-md-4 mb-4">
            <h5 class="mb-3">Shop</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="products.html?category=food" class="text-light text-decoration-none">Food & Coffee</a></li>
              <li class="mb-2"><a href="products.html?category=clothing" class="text-light text-decoration-none">Clothing</a></li>
              <li class="mb-2"><a href="products.html?category=jewelry" class="text-light text-decoration-none">Jewelry</a></li>
              <li class="mb-2"><a href="products.html?category=home" class="text-light text-decoration-none">Home & Decor</a></li>
              <li><a href="products.html" class="text-light text-decoration-none">All Products</a></li>
            </ul>
          </div>
          
          <div class="col-lg-2 col-md-4 mb-4">
            <h5 class="mb-3">Help</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="faq.html" class="text-light text-decoration-none">FAQs</a></li>
              <li class="mb-2"><a href="shipping.html" class="text-light text-decoration-none">Shipping Policy</a></li>
              <li class="mb-2"><a href="returns.html" class="text-light text-decoration-none">Returns & Refunds</a></li>
              <li><a href="contact.html" class="text-light text-decoration-none">Contact Us</a></li>
            </ul>
          </div>
          
          <div class="col-lg-4 col-md-4 mb-4">
            <h5 class="mb-3">Contact Info</h5>
            <p class="mb-2"><i class="bi bi-geo-alt me-2"></i> Bole Road, Addis Ababa, Ethiopia</p>
            <p class="mb-2"><i class="bi bi-telephone me-2"></i> +251 911 234 567</p>
            <p class="mb-2"><i class="bi bi-envelope me-2"></i> info@ethioshop.com</p>
            <p><i class="bi bi-clock me-2"></i> Mon-Sat: 8:30 AM - 6:30 PM</p>
            
            <div class="mt-4">
              <h6>Newsletter</h6>
              <div class="input-group">
                <input type="email" class="form-control" placeholder="Your email" id="footerNewsletter">
                <button class="btn btn-outline-light" type="button" onclick="subscribeFooterNewsletter()">
                  <i class="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <hr class="border-light my-4">
        
        <div class="row">
          <div class="col-md-6">
            <p class="mb-0">&copy; <span class="current-year">2026</span> EthioShop. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <a href="privacy.html" class="text-light text-decoration-none me-3">Privacy Policy</a>
            <a href="terms.html" class="text-light text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- Back to Top Button -->
    <a href="#" class="back-to-top" id="backToTop">
      <i class="bi bi-chevron-up"></i>
    </a>
  `;
  
  document.body.insertAdjacentHTML('beforeend', footerHTML);
  
  // Setup back to top button
  setupBackToTop();
}

// Setup back to top button
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  const searchForm = document.getElementById('navbarSearch');
  if (searchForm) {
    searchForm.addEventListener('submit', searchProducts);
  }
  
  // Cart count updates
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      updateCartCount();
    });
  });
}

// Search products
function searchProducts(event) {
  event.preventDefault();
  
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim();
  
  if (!searchTerm) {
    showAlert('Please enter a search term', 'warning');
    return;
  }
  
  // Save search term and redirect to products page
  localStorage.setItem('lastSearch', searchTerm);
  window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
}

// Add to cart function
function addToCart(productId, quantity = 1) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user || user.role !== 'buyer') {
    showAlert('Please login as a buyer to add items to cart', 'warning');
    window.location.href = 'login.html';
    return;
  }
  
  const products = JSON.parse(localStorage.getItem('products'));
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    showAlert('Product not found', 'danger');
    return;
  }
  
  if (product.stock <= 0) {
    showAlert('Sorry, this product is out of stock', 'warning');
    return;
  }
  
  if (quantity > product.stock) {
    showAlert(`Only ${product.stock} items available in stock`, 'warning');
    return;
  }
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItemIndex = cart.findIndex(item => item.id === productId);
  
  if (existingItemIndex > -1) {
    // Update existing item
    const newQuantity = cart[existingItemIndex].quantity + quantity;
    
    if (newQuantity > product.stock) {
      showAlert(`Cannot add more than available stock (${product.stock})`, 'warning');
      return;
    }
    
    cart[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  showAlert(`${quantity} ${product.name} added to cart`, 'success');
  
  // Log activity
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'cart_add',
    message: `${user.name} added ${product.name} to cart`,
    timestamp: new Date().toISOString(),
    userId: user.id,
    productId: product.id
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
}

// Show alert/notification
function showAlert(message, type = 'info', duration = 3000) {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());
  
  // Create alert element
  const alertHTML = `
    <div class="custom-alert position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', alertHTML);
  
  // Show toast
  const toastEl = document.querySelector('.custom-alert .toast');
  const toast = new bootstrap.Toast(toastEl, { delay: duration });
  toast.show();
  
  // Remove after hiding
  toastEl.addEventListener('hidden.bs.toast', function() {
    document.querySelector('.custom-alert')?.remove();
  });
}

// Toggle wishlist
function toggleWishlist(productId) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!user) {
    showAlert('Please login to save items to wishlist', 'warning');
    return;
  }
  
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const productIndex = wishlist.findIndex(item => item.productId === productId && item.userId === user.id);
  
  if (productIndex > -1) {
    // Remove from wishlist
    wishlist.splice(productIndex, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showAlert('Removed from wishlist', 'info');
  } else {
    // Add to wishlist
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    
    if (product) {
      wishlist.push({
        userId: user.id,
        productId: productId,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        addedDate: new Date().toISOString()
      });
      
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      showAlert('Added to wishlist', 'success');
    }
  }
  
  // Update wishlist count
  updateWishlistCount();
}

// Update wishlist count
function updateWishlistCount() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;
  
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const userWishlist = wishlist.filter(item => item.userId === user.id);
  
  const wishlistCount = document.getElementById('wishlistCount');
  if (wishlistCount) {
    wishlistCount.textContent = userWishlist.length;
    wishlistCount.style.display = userWishlist.length > 0 ? 'inline-block' : 'none';
  }
}

// Format price
function formatPrice(price) {
  return `ETB ${price.toLocaleString('en-ET')}`;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Subscribe to newsletter from footer
function subscribeFooterNewsletter() {
  const emailInput = document.getElementById('footerNewsletter');
  if (!emailInput) return;
  
  const email = emailInput.value.trim();
  
  if (!email || !email.includes('@')) {
    showAlert('Please enter a valid email address', 'warning');
    return;
  }
  
  let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
  
  if (subscribers.some(sub => sub.email === email)) {
    showAlert('You are already subscribed!', 'info');
    return;
  }
  
  subscribers.push({
    email: email,
    subscribedDate: new Date().toISOString().split('T')[0],
    active: true
  });
  
  localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
  
  showAlert('Thank you for subscribing to our newsletter!', 'success');
  emailInput.value = '';
}

// Logout function
function logout() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  
  if (user) {
    // Log activity
    const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
    activities.unshift({
      id: Date.now(),
      type: 'user_logout',
      message: `${user.name} logged out`,
      timestamp: new Date().toISOString(),
      userId: user.id
    });
    localStorage.setItem('recentActivities', JSON.stringify(activities));
  }
  
  localStorage.removeItem('currentUser');
  showAlert('Logged out successfully', 'info');
  
  // Redirect to home page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// Make functions globally available
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.searchProducts = searchProducts;
window.subscribeFooterNewsletter = subscribeFooterNewsletter;
window.logout = logout;
window.showAlert = showAlert;
window.formatPrice = formatPrice;
window.formatDate = formatDate;