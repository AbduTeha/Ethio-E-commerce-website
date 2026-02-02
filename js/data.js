// data.js - Initializes localStorage with Ethiopian products and 2026 data

// Initialize users if not exists
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    { 
      id: 1,
      name: "Admin User",
      email: "admin@ethioshop.com", 
      password: "admin123", 
      role: "admin",
      phone: "+251 911 000 001",
      address: "Bole Road, Addis Ababa",
      registered: "2026-01-01",
      status: "active",
      lastLogin: "2026-03-25T10:30:00"
    },
    { 
      id: 2,
      name: "Ethiopian Seller",
      email: "seller@ethioshop.com", 
      password: "seller123", 
      role: "seller",
      phone: "+251 911 000 002",
      address: "Merkato, Addis Ababa",
      registered: "2026-01-15",
      status: "active",
      lastLogin: "2026-03-24T14:45:00"
    },
    { 
      id: 3,
      name: "Test Buyer",
      email: "buyer@ethioshop.com", 
      password: "buyer123", 
      role: "buyer",
      phone: "+251 911 000 003",
      address: "Kirkos, Addis Ababa",
      registered: "2026-02-01",
      status: "active",
      lastLogin: "2026-03-25T09:15:00"
    },
    { 
      id: 4,
      name: "Alemayehu Kebede",
      email: "alemayehu@example.com", 
      password: "password123", 
      role: "buyer",
      phone: "+251 911 234 567",
      address: "Bole Medhanealem, Addis Ababa",
      registered: "2026-02-10",
      status: "active",
      lastLogin: "2026-03-24T16:20:00"
    },
    { 
      id: 5,
      name: "Meron Tesfaye",
      email: "meron@example.com", 
      password: "password123", 
      role: "seller",
      phone: "+251 912 345 678",
      address: "Piazza, Addis Ababa",
      registered: "2026-02-15",
      status: "active",
      lastLogin: "2026-03-23T11:45:00"
    }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// Initialize products if not exists

if (!localStorage.getItem("products")) {
  const defaultProducts = [
    {
      id: 101,
      name: "Ethiopian Coffee Beans - Yirgacheffe Grade 1",
      price: 850,
      category: "food",
      stock: 150,
      image: "assets/images/coffee.avif",
      seller: "seller@ethioshop.com",
      description: "Premium Arabica coffee beans from Yirgacheffe region, known for their floral and citrus notes. Grade 1 quality.",
      createdAt: "2026-03-15",
      rating: 4.8,
      reviews: 42,
      weight: "1kg"
    },
    {
      id: 102,
      name: "Habesha Kemis - Traditional Ethiopian Dress",
      price: 2200,
      category: "clothing",
      stock: 25,
      image: "assets/images/habesha-kemis2.jpg",
      seller: "meron@example.com",
      description: "Handwoven cotton dress with traditional Ethiopian embroidery. Perfect for special occasions and cultural events.",
      createdAt: "2026-03-10",
      rating: 4.9,
      reviews: 18,
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 103,
      name: "Electric Injera Mitad (Non-Stick)",
      price: 5200,
      category: "electronics",
      stock: 12,
      image: "assets/images/electric-mitad.jpg",
      seller: "seller@ethioshop.com",
      description: "Modern electric mitad with non-stick surface for perfect injera every time. Temperature control and easy cleaning.",
      createdAt: "2026-03-05",
      rating: 4.7,
      reviews: 31,
      warranty: "1 year"
    },
    {
      id: 104,
      name: "Pure Ethiopian Honey - Tigray Forest",
      price: 650,
      category: "food",
      stock: 80,
      image: "assets/images/honey.avif",
      seller: "meron@example.com",
      description: "100% pure, raw honey from the forests of Tigray. Unprocessed and packed with natural enzymes and antioxidants.",
      createdAt: "2026-03-01",
      rating: 4.6,
      reviews: 27,
      weight: "500g"
    },
    {
      id: 105,
      name: "Traditional Ethiopian Silver Cross",
      price: 1800,
      category: "jewelry",
      stock: 35,
      image: "assets/images/jewelry.avif",
      seller: "seller@ethioshop.com",
      description: "Handcrafted silver cross pendant with traditional Ethiopian design. Comes with 24-inch sterling silver chain.",
      createdAt: "2026-02-28",
      rating: 4.8,
      reviews: 23,
      material: "Sterling Silver"
    },
    {
      id: 106,
      name: "Ethiopian Spice Collection Set",
      price: 1200,
      category: "food",
      stock: 45,
      image: "assets/images/spices.avif",
      seller: "meron@example.com",
      description: "Complete set of essential Ethiopian spices including Berbere, Mitmita, Awaze, and Korarima. Perfect for authentic Ethiopian cooking.",
      createdAt: "2026-02-25",
      rating: 4.9,
      reviews: 56,
      items: 8
    },
    {
      id: 107,
      name: "Ethiopian National Team Soccer Jersey",
      price: 1500,
      category: "clothing",
      stock: 60,
      image: "assets/images/ethiopian-jersey.avif",
      seller: "seller@ethioshop.com",
      description: "Official Ethiopian national football team jersey. Authentic design with moisture-wicking fabric.",
      createdAt: "2026-02-20",
      rating: 4.7,
      reviews: 89,
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 108,
      name: "Traditional Coffee Ceremony Set",
      price: 3200,
      category: "home",
      stock: 18,
      image: "assets/images/coffee-set.avif",
      seller: "meron@example.com",
      description: "Complete Ethiopian coffee ceremony set includes Jebena (clay pot), cups, tray, and incense burner.",
      createdAt: "2026-02-15",
      rating: 4.9,
      reviews: 34,
      pieces: 12
    },
    {
      id: 109,
      name: "Ethiopian Shema Cloth (Netela)",
      price: 950,
      category: "clothing",
      stock: 40,
      image: "assets/images/habesha-kemis2.jpg",
      seller: "seller@ethioshop.com",
      description: "Traditional Ethiopian cotton shema cloth with delicate embroidery on the borders. Versatile for various uses.",
      createdAt: "2026-02-10",
      rating: 4.5,
      reviews: 21,
      size: "2m x 1m"
    },
    {
      id: 110,
      name: "Teff Flour - 100% Organic",
      price: 450,
      category: "food",
      stock: 200,
      image: "assets/images/flour.avif",
      seller: "meron@example.com",
      description: "Finest quality organic teff flour, perfect for making traditional injera. Gluten-free and packed with nutrients.",
      createdAt: "2026-02-05",
      rating: 4.8,
      reviews: 67,
      weight: "2kg"
    },
    {
      id: 111,
      name: "Handwoven Ethiopian Basket",
      price: 850,
      category: "home",
      stock: 30,
      image: "assets/images/baskets.jpg",
      seller: "seller@ethioshop.com",
      description: "Beautiful handwoven Ethiopian basket made from natural fibers. Traditional design with colorful patterns.",
      createdAt: "2026-01-30",
      rating: 4.6,
      reviews: 19,
      diameter: "40cm"
    },
    {
      id: 112,
      name: "Ethiopian Lentils (Misir)",
      price: 280,
      category: "food",
      stock: 300,
      image: "assets/images/misir.avif",
      seller: "meron@example.com",
      description: "Premium quality Ethiopian red lentils. Perfect for making traditional Misir Wot. High in protein and fiber.",
      createdAt: "2026-01-25",
      rating: 4.4,
      reviews: 45,
      weight: "1kg"
    }
  ];
  localStorage.setItem("products", JSON.stringify(defaultProducts));
}

// Initialize cart if not exists
if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify([]));
}

// Initialize orders if not exists
if (!localStorage.getItem("orders")) {
  const sampleOrders = [
    {
      id: "ORD20260325001",
      customerEmail: "buyer@ethioshop.com",
      customerName: "Test Buyer",
      customerPhone: "+251 911 000 003",
      shippingAddress: "Kirkos, Addis Ababa",
      shippingCity: "addis",
      items: [
        { id: 101, name: "Ethiopian Coffee Beans - Yirgacheffe Grade 1", price: 850, quantity: 2, image: "assets/images/coffee.avif" },
        { id: 106, name: "Ethiopian Spice Collection Set", price: 1200, quantity: 1, image: "assets/images/spices.avif" }
      ],
      subtotal: 2900,
      shipping: 0,
      tax: 435,
      total: 3335,
      date: "2026-03-25T09:30:00",
      status: "delivered",
      paymentMethod: "cash_on_delivery",
      trackingNumber: "ETH123456789",
      deliveryDate: "2026-03-26"
    },
    {
      id: "ORD20260324001",
      customerEmail: "alemayehu@example.com",
      customerName: "Alemayehu Kebede",
      customerPhone: "+251 911 234 567",
      shippingAddress: "Bole Medhanealem, Addis Ababa",
      shippingCity: "addis",
      items: [
        { id: 102, name: "Habesha Kemis - Traditional Ethiopian Dress", price: 2200, quantity: 1, image: "assets/images/habesha-kemis.avif" }
      ],
      subtotal: 2200,
      shipping: 0,
      tax: 330,
      total: 2530,
      date: "2026-03-24T14:20:00",
      status: "processing",
      paymentMethod: "bank_transfer",
      trackingNumber: "ETH987654321",
      deliveryDate: "2026-03-27"
    }
  ];
  localStorage.setItem("orders", JSON.stringify(sampleOrders));
}

// Initialize recent activities if not exists
if (!localStorage.getItem("recentActivities")) {
  const defaultActivities = [
    {
      id: 1,
      type: "order_placed",
      message: "Order ORD20260325001 placed by Test Buyer",
      timestamp: "2026-03-25T09:30:00",
      userId: 3,
      orderId: "ORD20260325001"
    },
    {
      id: 2,
      type: "user_registered",
      message: "New buyer registered: Alemayehu Kebede",
      timestamp: "2026-03-24T16:20:00",
      userId: 4
    },
    {
      id: 3,
      type: "product_added",
      message: "New product added: Ethiopian Spice Collection Set",
      timestamp: "2026-03-24T11:30:00",
      userId: 5,
      productId: 106
    },
    {
      id: 4,
      type: "order_placed",
      message: "Order ORD20260324001 placed by Alemayehu Kebede",
      timestamp: "2026-03-24T14:20:00",
      userId: 4,
      orderId: "ORD20260324001"
    },
    {
      id: 5,
      type: "seller_login",
      message: "Seller Ethiopian Seller logged in",
      timestamp: "2026-03-23T11:45:00",
      userId: 2
    },
    {
      id: 6,
      type: "admin_login",
      message: "Admin User logged into dashboard",
      timestamp: "2026-03-23T10:00:00",
      userId: 1
    }
  ];
  localStorage.setItem("recentActivities", JSON.stringify(defaultActivities));
}

// Initialize newsletter subscribers if not exists
if (!localStorage.getItem("newsletterSubscribers")) {
  localStorage.setItem("newsletterSubscribers", JSON.stringify([
    {
      email: "buyer@ethioshop.com",
      name: "Test Buyer",
      subscribedDate: "2026-03-20",
      active: true
    },
    {
      email: "alemayehu@example.com",
      name: "Alemayehu Kebede",
      subscribedDate: "2026-03-22",
      active: true
    }
  ]));
}

// Initialize contact messages if not exists
if (!localStorage.getItem("contactMessages")) {
  localStorage.setItem("contactMessages", JSON.stringify([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+251 911 111 111",
      subject: "order",
      message: "When will my order be delivered?",
      date: "2026-03-24T10:30:00",
      status: "read",
      response: "Your order will be delivered tomorrow."
    },
    {
      id: 2,
      name: "Michael Tekle",
      email: "michael@example.com",
      phone: "+251 912 222 222",
      subject: "product",
      message: "Do you have this product in other colors?",
      date: "2026-03-25T14:45:00",
      status: "unread"
    }
  ]));
}

// Initialize wishlist if not exists
if (!localStorage.getItem("wishlist")) {
  localStorage.setItem("wishlist", JSON.stringify([]));
}

// Initialize notifications if not exists
if (!localStorage.getItem("notifications")) {
  localStorage.setItem("notifications", JSON.stringify([
    {
      id: 1,
      type: "order",
      message: "Your order ORD20260325001 has been delivered",
      date: "2026-03-26T16:30:00",
      read: true
    },
    {
      id: 2,
      type: "promotion",
      message: "New Ethiopian coffee varieties available",
      date: "2026-03-25T10:00:00",
      read: false
    }
  ]));
}

// Utility function to add sample data
function addSampleData() {
  console.log("Sample data initialized in localStorage");
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addSampleData };
}