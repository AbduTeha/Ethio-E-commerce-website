// buyer.js - Buyer-specific functionality

// Load products on page
function loadProducts(filteredProducts = null) {
  const container = document.getElementById('product-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  let products = filteredProducts || JSON.parse(localStorage.getItem('products'));
  
  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-box-seam display-1 text-muted mb-3"></i>
        <h4>No products found</h4>
        <p class="text-muted">Check back soon for new Ethiopian products!</p>
        <a href="index.html" class="btn btn-dark mt-3">
          <i class="bi bi-house me-1"></i> Back to Home
        </a>
      </div>
    `;
    return;
  }
  
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const userWishlist = user ? wishlist.filter(item => item.userId === user.id) : [];
  
  products.forEach(product => {
    const isInWishlist = userWishlist.some(item => item.productId === product.id);
    const isOutOfStock = product.stock <= 0;
    
    container.innerHTML += `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card h-100 product-card">
          <div class="position-relative">
            <img src="${product.image || 'https://via.placeholder.com/300x300?text=EthioShop'}" 
                 class="card-img-top product-image" 
                 alt="${product.name}"
                 height="250">
            <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2" 
                    onclick="toggleWishlist(${product.id})"
                    data-bs-toggle="tooltip" 
                    data-bs-title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
              <i class="bi ${isInWishlist ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
            </button>
            ${isOutOfStock ? `
              <div class="position-absolute top-50 start-50 translate-middle">
                <span class="badge bg-danger p-2">Out of Stock</span>
              </div>
            ` : ''}
          </div>
          
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">${product.name}</h6>
            <p class="card-text text-muted small flex-grow-1">
              ${product.description || 'Premium Ethiopian product'}
            </p>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="price fw-bold text-primary">${formatPrice(product.price)}</span>
                <span class="badge bg-${getCategoryColor(product.category)}">
                  ${getCategoryName(product.category)}
                </span>
              </div>
              
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="small ${isOutOfStock ? 'text-danger' : 'text-success'}">
                  <i class="bi ${isOutOfStock ? 'bi-x-circle' : 'bi-check-circle'} me-1"></i>
                  ${isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
                </span>
                ${product.rating ? `
                  <span class="small">
                    <i class="bi bi-star-fill text-warning"></i> ${product.rating}
                  </span>
                ` : ''}
              </div>
              
              <div class="d-grid gap-2">
                <button onclick="addToCart(${product.id}, 1)" 
                        class="btn btn-dark ${isOutOfStock ? 'disabled' : ''}"
                        ${isOutOfStock ? 'disabled' : ''}>
                  <i class="bi bi-cart-plus me-1"></i> Add to Cart
                </button>
                <button onclick="viewProduct(${product.id})" class="btn btn-outline-dark">
                  <i class="bi bi-eye me-1"></i> View Details
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-footer bg-transparent border-top-0">
            <div class="d-flex justify-content-between small text-muted">
              <span>Seller: ${product.seller ? product.seller.split('@')[0] : 'EthioShop'}</span>
              <span>Added: ${formatDate(product.createdAt || '2026')}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  // Re-initialize tooltips
  const tooltipTriggerList = [].slice.call(container.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// View product details
function viewProduct(productId) {
  const products = JSON.parse(localStorage.getItem('products'));
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    showAlert('Product not found', 'danger');
    return;
  }
  
  // Create modal HTML
  const modalHTML = `
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${product.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <img src="${product.image || 'https://via.placeholder.com/500x500?text=EthioShop'}" 
                     class="img-fluid rounded" 
                     alt="${product.name}">
              </div>
              <div class="col-md-6">
                <h4 class="text-primary">${formatPrice(product.price)}</h4>
                
                <div class="mb-3">
                  <span class="badge bg-${getCategoryColor(product.category)} me-2">
                    ${getCategoryName(product.category)}
                  </span>
                  <span class="badge bg-${product.stock > 0 ? 'success' : 'danger'}">
                    ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                
                <p class="mb-4">${product.description || 'Premium Ethiopian product with traditional craftsmanship.'}</p>
                
                <div class="mb-4">
                  <h6>Product Details</h6>
                  <ul class="list-unstyled">
                    ${product.weight ? `<li><i class="bi bi-box me-2"></i> Weight: ${product.weight}</li>` : ''}
                    ${product.material ? `<li><i class="bi bi-gem me-2"></i> Material: ${product.material}</li>` : ''}
                    ${product.size ? `<li><i class="bi bi-rulers me-2"></i> Size: ${product.size}</li>` : ''}
                    ${product.warranty ? `<li><i class="bi bi-shield-check me-2"></i> Warranty: ${product.warranty}</li>` : ''}
                    <li><i class="bi bi-shop me-2"></i> Seller: ${product.seller || 'EthioShop'}</li>
                    <li><i class="bi bi-calendar me-2"></i> Added: ${formatDate(product.createdAt)}</li>
                  </ul>
                </div>
                
                <div class="d-grid gap-2">
                  <button onclick="addToCart(${product.id}, 1)" 
                          class="btn btn-dark btn-lg ${product.stock <= 0 ? 'disabled' : ''}"
                          ${product.stock <= 0 ? 'disabled' : ''}>
                    <i class="bi bi-cart-plus me-2"></i> Add to Cart
                  </button>
                  <button onclick="toggleWishlist(${product.id})" class="btn btn-outline-dark">
                    <i class="bi bi-heart me-2"></i> Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove existing modal if any
  const existingModal = document.getElementById('productModal');
  if (existingModal) existingModal.remove();
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const productModal = new bootstrap.Modal(document.getElementById('productModal'));
  productModal.show();
  
  // Remove modal when hidden
  document.getElementById('productModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// Get category color
function getCategoryColor(category) {
  const colors = {
    'food': 'success',
    'clothing': 'info',
    'electronics': 'warning',
    'jewelry': 'danger',
    'home': 'primary',
    'art': 'secondary'
  };
  return colors[category] || 'secondary';
}

// Get category name
function getCategoryName(category) {
  const names = {
    'food': 'Food & Coffee',
    'clothing': 'Clothing',
    'electronics': 'Electronics',
    'jewelry': 'Jewelry',
    'home': 'Home & Decor',
    'art': 'Art & Crafts'
  };
  return names[category] || category;
}

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check for search parameter
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('search');
  const category = urlParams.get('category');
  
  if (searchTerm) {
    // Search products
    const products = JSON.parse(localStorage.getItem('products'));
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    loadProducts(filteredProducts);
    
    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.innerHTML = `Search Results for: <span class="text-primary">"${searchTerm}"</span>`;
    }
    
    // Show search info
    const searchInfo = document.createElement('div');
    searchInfo.className = 'alert alert-info mt-3';
    searchInfo.innerHTML = `
      Found <strong>${filteredProducts.length}</strong> products matching "${searchTerm}"
      <a href="products.html" class="float-end">Clear search</a>
    `;
    
    const container = document.querySelector('.container');
    if (container && filteredProducts.length > 0) {
      container.insertBefore(searchInfo, document.getElementById('product-list'));
    }
    
  } else if (category) {
    // Filter by category
    const products = JSON.parse(localStorage.getItem('products'));
    const filteredProducts = products.filter(product => product.category === category);
    
    loadProducts(filteredProducts);
    
    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      pageTitle.textContent = `${getCategoryName(category)}`;
    }
    
  } else {
    // Load all products
    loadProducts();
  }
  
  // Update wishlist count
  updateWishlistCount();
});

// Make functions globally available
window.viewProduct = viewProduct;
window.loadProducts = loadProducts;