function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

function renderProductDetails() {
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.getElementById('productDetails').innerHTML = `
            <div class="error-message">
                <h2>Product not found</h2>
                <button onclick="window.location.href='index.html'" class="back-btn">Back to Home</button>
            </div>
        `;
        return;
    }

    document.getElementById('productDetails').innerHTML = `
        <div class="product-details-container">
            <div class="product-details-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details-info">
                <h1>${product.name}</h1>
                <p class="product-details-price">$${product.price.toFixed(2)}</p>
                <p class="product-details-category">Category: ${categories[product.category]}</p>
                <p class="product-details-description">${product.description}</p>
                <div class="product-details-actions">
                    <button onclick="toggleOrderForm()" class="order-now-btn">Order Now</button>
                    <button onclick="addToCart(${product.id})" class="add-to-cart-btn">Add to Cart</button>
                    <button onclick="window.location.href='index.html'" class="back-btn">Back to Products</button>
                </div>
            </div>
        </div>
    `;
}

function toggleOrderForm() {
    const modal = document.getElementById('orderModal');
    modal.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        updateOrderSummary();
    }
}

function updateOrderSummary() {
    const product = products.find(p => p.id === getProductIdFromUrl());
    const quantity = document.getElementById('quantity').value;
    const total = product.price * quantity;
    
    document.getElementById('orderSummary').innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-item">
            <span>Product:</span>
            <span>${product.name}</span>
        </div>
        <div class="summary-item">
            <span>Price per item:</span>
            <span>$${product.price.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Quantity:</span>
            <span>${quantity}</span>
        </div>
        <div class="summary-item total">
            <span>Total Amount:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = Object.fromEntries(formData.entries());
    const product = products.find(p => p.id === getProductIdFromUrl());
    
    // Here you would typically send this data to a server
    // For now, we'll just show a success message
    alert(`Order Placed Successfully!\n\nOrder Details:\nProduct: ${product.name}\nQuantity: ${orderData.quantity}\nDelivery Address: ${orderData.address}\nPayment Method: ${orderData.paymentMethod}`);
    
    // Clear form and close modal
    event.target.reset();
    toggleOrderForm();
}

// Add event listener for quantity changes
document.getElementById('quantity').addEventListener('change', updateOrderSummary);

// Initialize the product details page
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
    if (document.getElementById('productDetails')) {
        renderProductDetails();
    }
});
// Add this to your product-details.js file

function showSuccessMessage(orderData, product) {
    // Create success modal HTML
    const modalHTML = `
        <div id="successModal" class="success-modal active">
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h2 class="success-title">Order Placed Successfully!</h2>
                <p>Thank you for your order. We'll process it right away.</p>
                
                <div class="order-details">
                    <div class="order-detail-item">
                        <span>Order Number:</span>
                        <span>#${Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                    <div class="order-detail-item">
                        <span>Product:</span>
                        <span>${product.name}</span>
                    </div>
                    <div class="order-detail-item">
                        <span>Quantity:</span>
                        <span>${orderData.quantity}</span>
                    </div>
                    <div class="order-detail-item">
                        <span>Total Amount:</span>
                        <span>$${(product.price * orderData.quantity).toFixed(2)}</span>
                    </div>
                    <div class="order-detail-item">
                        <span>Delivery To:</span>
                        <span>${orderData.name}</span>
                    </div>
                    <div class="order-detail-item">
                        <span>Address:</span>
                        <span>${orderData.address}</span>
                    </div>
                    <div class="order-detail-item">
                        <span>Payment Method:</span>
                        <span>${orderData.paymentMethod}</span>
                    </div>
                </div>

                <div class="success-actions">
                    <button onclick="window.location.href='index.html'" class="continue-shopping">
                        Continue Shopping
                    </button>
                    <button onclick="closeSuccessModal()" class="view-orders">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add modal to the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.remove();
}

// Update the submitOrder function
function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = Object.fromEntries(formData.entries());
    const product = products.find(p => p.id === getProductIdFromUrl());
    
    // Show success message
    showSuccessMessage(orderData, product);
    
    // Clear form and close order modal
    event.target.reset();
    toggleOrderForm();
}
function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = Object.fromEntries(formData.entries());
    const product = products.find(p => p.id === getProductIdFromUrl());
    const total = product.price * orderData.quantity;

    const newOrder = {
        id: Date.now(),
        customerName: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        items: [{
            ...product,
            quantity: parseInt(orderData.quantity)
        }],
        total: total,
        status: 'pending',
        date: new Date().toISOString()
    };

    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Show success message
    showSuccessMessage(orderData, product);
    event.target.reset();
    toggleOrderForm();
}