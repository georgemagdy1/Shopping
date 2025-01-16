const categories = {
    electronics: "Mobiles",
    clothing: "Airpods",
    furniture: "Smart Watch",
    sports: "Other"
};

const products = [
    {
        id: 1,
        name: "Google Pixel",
        price: 999.99,
        image: "6BwAukJz8NHSS4UwbEUu6G-320-80.jpg",
        category: "electronics",
        description: "Experience the latest Google Pixel with advanced camera features and pure Android experience."
    },
    {
        id: 2,
        name: "Samsung",
        price: 199.99,
        image: "androidphones-2048px-0803.jpg",
        category: "electronics",
        description: "Premium Samsung smartphone with stunning display and powerful performance."
    },
    {
        id: 3,
        name: "Iphone",
        price: 129.99,
        image: "images (1).jpeg",
        category: "electronics",
        description: "Latest iPhone model featuring cutting-edge technology and premium design."
    },
    {
        id: 4,
        name: "Smart watch",
        price: 199.99,
        image: "download (1).jpeg",
        category: "furniture",
        description: "Advanced smartwatch with health tracking and notifications."
    },
    {
        id: 5,
        name: "AirPods",
        price: 199.99,
        image: "jjjk.jpeg",
        category: "clothing",
        description: "Premium wireless earbuds with excellent sound quality and comfort."
    },
    {
        id: 6,
        name: "Smart watch",
        price: 299.99,
        image: "download (2).jpeg",
        category: "furniture",
        description: "Feature-rich smartwatch with elegant design and long battery life."
    },
    {
        id: 7,
        name: "Clothes",
        price: 19.99,
        image: "lkl.jpeg",
        category: "sports",
        description: "High-quality sports apparel for maximum comfort and performance."
    }
];

let cart = [];
let activeCategory = null;

// Load cart from localStorage if available
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = `
        <li class="${!activeCategory ? 'active' : ''}" 
            onclick="filterByCategory(null)">All</li>
        ${Object.entries(categories).map(([key, value]) => `
            <li class="${activeCategory === key ? 'active' : ''}" 
                onclick="filterByCategory('${key}')">${value}</li>
        `).join('')}
    `;
}

function filterByCategory(category) {
    activeCategory = category;
    renderCategories();
    renderProducts();
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    
    if (activeCategory) {
        const filteredProducts = products.filter(p => p.category === activeCategory);
        container.innerHTML = `
            <h2 class="section-title">${categories[activeCategory]}</h2>
            <div class="products">
                ${renderProductCards(filteredProducts)}
            </div>
        `;
    } else {
        container.innerHTML = Object.keys(categories).map(category => {
            const categoryProducts = products.filter(p => p.category === category);
            return categoryProducts.length ? `
                <h2 class="section-title">${categories[category]}</h2>
                <div class="products">
                    ${renderProductCards(categoryProducts)}
                </div>
            ` : '';
        }).join('');
    }
}

function renderProductCards(products) {
    return products.map(product => `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    saveCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const total = document.querySelector('.total');

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                ${item.name} x${item.quantity}
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    total.textContent = `Total: $${totalAmount.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    const cart = document.querySelector('.cart-modal');
    cart.classList.toggle('active');
}

// Initialize the store
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderCategories();
    renderProducts();
});
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const total = document.querySelector('.total');

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    total.textContent = `Total: $${totalAmount.toFixed(2)}`;
}
// Add this to the beginning of script.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Function to hide loading screen
    const hideLoadingScreen = () => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500); // Match this with the CSS transition duration
    };
  
    // Wait for all images to load
    Promise.all(
      Array.from(document.images)
        .map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // Handle error cases as well
          });
        })
    )
    .then(() => {
      // Add a minimum delay to ensure smooth transition
      setTimeout(hideLoadingScreen, 1000);
    })
    .catch(() => {
      // Fallback in case of errors
      setTimeout(hideLoadingScreen, 1000);
    });
  });