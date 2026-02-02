// seller.js - Seller dashboard functionality

// Protect seller pages
protect('seller');

// Initialize seller dashboard
document.addEventListener('DOMContentLoaded', function() {
  loadSellerDashboard();
  loadSellerProducts();
  setupSellerEventListeners();
});

// Load seller dashboard
function loadSellerDashboard() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;
  
  // Update seller email display
  const sellerEmailElement = document.getElementById('sellerEmail');
  if (sellerEmailElement) {
    sellerEmailElement.textContent = user.email;
  }
  
  // Calculate seller stats
  calculateSellerStats();
}

// Calculate seller statistics
function calculateSellerStats() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;
  
  const products = JSON.parse(localStorage.getItem('products'));
  const orders = JSON.parse(localStorage.getItem('orders'));
  
  // Filter seller's products
  const sellerProducts = products.filter(p => p.seller === user.email);
  
  // Filter seller's orders
  let sellerOrders = [];
  let totalRevenue = 0;
  
  orders.forEach(order => {
    const sellerItems = order.items.filter(item => {
      const product = products.find(p => p.id === item.id);
      return product && product.seller === user.email;
    });
    
    if (sellerItems.length > 0) {
      const orderForSeller = {
        ...order,
        items: sellerItems,
        sellerTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      sellerOrders.push(orderForSeller);
      totalRevenue += orderForSeller.sellerTotal;
    }
  });
  
  // Update stats display
  const totalProducts = document.getElementById('totalProducts');
  const activeProducts = document.getElementById('activeProducts');
  const totalOrders = document.getElementById('totalOrders');
  const totalRevenueElement = document.getElementById('totalRevenue');
  
  if (totalProducts) totalProducts.textContent = sellerProducts.length;
  if (activeProducts) activeProducts.textContent = sellerProducts.filter(p => p.stock > 0).length;
  if (totalOrders) totalOrders.textContent = sellerOrders.length;
  if (totalRevenueElement) totalRevenueElement.textContent = totalRevenue.toFixed(2);
}

// Load seller's products
function loadSellerProducts() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;
  
  const products = JSON.parse(localStorage.getItem('products'));
  const sellerProducts = products.filter(p => p.seller === user.email);
  const container = document.getElementById('list');
  
  if (!container) return;
  
  if (sellerProducts.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-box-seam display-1 text-muted mb-3"></i>
        <h4>No products yet</h4>
        <p class="text-muted">Add your first product using the form above</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sellerProducts.map(product => `
    <div class="col-md-4 mb-4">
      <div class="card h-100">
        <div class="position-relative">
          <img src="${product.image || 'https://via.placeholder.com/300x300?text=Product'}" 
               class="card-img-top" 
               alt="${product.name}"
               height="200">
          <div class="position-absolute top-0 end-0 m-2">
            <span class="badge bg-${product.stock > 0 ? 'success' : 'danger'}">
              ${product.stock} in stock
            </span>
          </div>
        </div>
        
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.name}</h6>
          <p class="card-text text-muted small flex-grow-1">
            ${product.description || 'No description'}
          </p>
          
          <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="fw-bold text-primary">${formatPrice(product.price)}</span>
              <span class="badge bg-${getCategoryColor(product.category)}">
                ${getCategoryName(product.category)}
              </span>
            </div>
            
            <div class="d-flex justify-content-between">
              <button onclick="editProduct(${product.id})" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-pencil me-1"></i> Edit
              </button>
              <button onclick="deleteProduct(${product.id})" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash me-1"></i> Delete
              </button>
              <button onclick="updateStock(${product.id})" class="btn btn-sm btn-outline-success">
                <i class="bi bi-box-arrow-in-down me-1"></i> Stock
              </button>
            </div>
          </div>
        </div>
        
        <div class="card-footer bg-transparent border-top-0">
          <div class="d-flex justify-content-between small text-muted">
            <span>Added: ${formatDate(product.createdAt)}</span>
            <span>ID: ${product.id}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Add new product
function addProduct() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) return;
  
  const pname = document.getElementById('pname');
  const price = document.getElementById('price');
  const stock = document.getElementById('stock');
  const category = document.getElementById('category');
  const description = document.getElementById('description');
  const imageInput = document.getElementById('image');
  
  // Validation
  if (!pname.value.trim() || !price.value || !stock.value || !category.value) {
    showAlert('Please fill in all required fields', 'warning');
    return;
  }
  
  if (parseFloat(price.value) <= 0) {
    showAlert('Price must be greater than 0', 'warning');
    return;
  }
  
  if (parseInt(stock.value) < 0) {
    showAlert('Stock cannot be negative', 'warning');
    return;
  }
  
  const newProduct = {
    id: Date.now(),
    name: pname.value.trim(),
    price: parseFloat(price.value),
    stock: parseInt(stock.value),
    category: category.value,
    description: description.value.trim(),
    seller: user.email,
    createdAt: new Date().toISOString(),
    rating: 0,
    reviews: 0,
    image: 'https://via.placeholder.com/300x300?text=EthioShop+Product'
  };
  
  // Handle image upload
  if (imageInput && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      newProduct.image = e.target.result;
      saveProduct(newProduct);
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveProduct(newProduct);
  }
}

// Save product to localStorage
function saveProduct(product) {
  const products = JSON.parse(localStorage.getItem('products'));
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'product_added',
    message: `New product added: ${product.name}`,
    timestamp: new Date().toISOString(),
    sellerEmail: product.seller,
    productId: product.id
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  // Reset form
  document.getElementById('pname').value = '';
  document.getElementById('price').value = '';
  document.getElementById('stock').value = '';
  document.getElementById('category').value = 'food';
  document.getElementById('description').value = '';
  document.getElementById('image').value = '';
  
  // Reload products
  loadSellerProducts();
  calculateSellerStats();
  
  showAlert('Product added successfully!', 'success');
}

// Edit product
function editProduct(productId) {
  const products = JSON.parse(localStorage.getItem('products'));
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    showAlert('Product not found', 'danger');
    return;
  }
  
  // Create edit modal
  const modalHTML = `
    <div class="modal fade" id="editProductModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Product Name</label>
              <input type="text" id="editName" class="form-control" value="${product.name}">
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Price (ETB)</label>
                <input type="number" id="editPrice" class="form-control" value="${product.price}" min="1">
              </div>
              <div class="col-md-6">
                <label class="form-label">Stock</label>
                <input type="number" id="editStock" class="form-control" value="${product.stock}" min="0">
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Category</label>
              <select id="editCategory" class="form-select">
                <option value="food" ${product.category === 'food' ? 'selected' : ''}>Food & Beverages</option>
                <option value="clothing" ${product.category === 'clothing' ? 'selected' : ''}>Clothing</option>
                <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>Electronics</option>
                <option value="jewelry" ${product.category === 'jewelry' ? 'selected' : ''}>Jewelry</option>
                <option value="home" ${product.category === 'home' ? 'selected' : ''}>Home & Kitchen</option>
                <option value="art" ${product.category === 'art' ? 'selected' : ''}>Art & Crafts</option>
              </select>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea id="editDescription" class="form-control" rows="3">${product.description || ''}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="saveProductChanges(${productId})">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove existing modal if any
  const existingModal = document.getElementById('editProductModal');
  if (existingModal) existingModal.remove();
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Show modal
  const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
  editModal.show();
  
  // Remove modal when hidden
  document.getElementById('editProductModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// Save product changes
function saveProductChanges(productId) {
  const products = JSON.parse(localStorage.getItem('products'));
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    showAlert('Product not found', 'danger');
    return;
  }
  
  const updatedProduct = {
    ...products[productIndex],
    name: document.getElementById('editName').value.trim(),
    price: parseFloat(document.getElementById('editPrice').value),
    stock: parseInt(document.getElementById('editStock').value),
    category: document.getElementById('editCategory').value,
    description: document.getElementById('editDescription').value.trim()
  };
  
  products[productIndex] = updatedProduct;
  localStorage.setItem('products', JSON.stringify(products));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'product_updated',
    message: `Product updated: ${updatedProduct.name}`,
    timestamp: new Date().toISOString(),
    productId: productId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
  modal.hide();
  
  // Reload products
  loadSellerProducts();
  calculateSellerStats();
  
  showAlert('Product updated successfully!', 'success');
}

// Delete product
function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    return;
  }
  
  const products = JSON.parse(localStorage.getItem('products'));
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    showAlert('Product not found', 'danger');
    return;
  }
  
  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  localStorage.setItem('products', JSON.stringify(products));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'product_deleted',
    message: `Product deleted: ${deletedProduct.name}`,
    timestamp: new Date().toISOString(),
    productId: productId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  // Reload products
  loadSellerProducts();
  calculateSellerStats();
  
  showAlert('Product deleted successfully!', 'success');
}

// Update product stock
function updateStock(productId) {
  const products = JSON.parse(localStorage.getItem('products'));
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    showAlert('Product not found', 'danger');
    return;
  }
  
  const newStock = prompt(`Enter new stock quantity for "${product.name}":`, product.stock);
  
  if (newStock === null) return; // User cancelled
  
  const stockValue = parseInt(newStock);
  if (isNaN(stockValue) || stockValue < 0) {
    showAlert('Please enter a valid number (0 or greater)', 'warning');
    return;
  }
  
  const productIndex = products.findIndex(p => p.id === productId);
  products[productIndex].stock = stockValue;
  localStorage.setItem('products', JSON.stringify(products));
  
  // Add to recent activities
  const activities = JSON.parse(localStorage.getItem('recentActivities')) || [];
  activities.unshift({
    id: Date.now(),
    type: 'stock_updated',
    message: `Stock updated for ${product.name}: ${stockValue}`,
    timestamp: new Date().toISOString(),
    productId: productId
  });
  localStorage.setItem('recentActivities', JSON.stringify(activities));
  
  // Reload products
  loadSellerProducts();
  calculateSellerStats();
  
  showAlert('Stock updated successfully!', 'success');
}

// Setup seller event listeners
function setupSellerEventListeners() {
  // Real-time stock updates
  const stockInput = document.getElementById('stock');
  if (stockInput) {
    stockInput.addEventListener('input', function() {
      if (parseInt(this.value) < 0) {
        this.value = 0;
      }
    });
  }
  
  // Price validation
  const priceInput = document.getElementById('price');
  if (priceInput) {
    priceInput.addEventListener('input', function() {
      if (parseFloat(this.value) < 0) {
        this.value = 0;
      }
    });
  }
  
  // Image preview
  const imageInput = document.getElementById('image');
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Show preview (you could add a preview element)
          console.log('Image selected:', file.name);
        };
        reader.readAsDataURL(file);
      }
    });
  }
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
    'food': 'Food',
    'clothing': 'Clothing',
    'electronics': 'Electronics',
    'jewelry': 'Jewelry',
    'home': 'Home',
    'art': 'Art'
  };
  return names[category] || category;
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

// Make functions globally available
window.addProduct = addProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateStock = updateStock;
window.saveProductChanges = saveProductChanges;