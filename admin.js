// Load orders from localStorage
function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Display orders in the admin dashboard
function displayOrders() {
    const orders = getOrders();
    const status = document.getElementById('orderStatus').value;
    const container = document.getElementById('ordersContainer');
    
    // Filter orders if status is selected
    const filteredOrders = status === 'all' 
        ? orders 
        : orders.filter(order => order.status === status);

    container.innerHTML = filteredOrders.map(order => `
        <div class="order-card" onclick="showOrderDetails(${order.id})">
            <div class="order-header">
                <div>
                    <strong>Order #${order.id}</strong>
                    <div>Customer: ${order.customerName}</div>
                </div>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
            <div>
                <div>Items: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                <div>Total: $${order.total.toFixed(2)}</div>
                <div>Date: ${new Date(order.date).toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// Show order details in modal
function showOrderDetails(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    const modal = document.getElementById('orderModal');
    const details = document.getElementById('orderDetails');

    details.innerHTML = `
        <h2>Order #${order.id}</h2>
        <div class="status-badge status-${order.status}">${order.status}</div>
        
        <h3>Customer Information</h3>
        <p>Name: ${order.customerName}</p>
        <p>Email: ${order.email}</p>
        <p>Phone: ${order.phone}</p>
        <p>Address: ${order.address}</p>

        <h3>Order Items</h3>
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <div><strong>${item.name}</strong></div>
                        <div>Quantity: ${item.quantity}</div>
                        <div>Price: $${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
            `).join('')}
            <div><strong>Total: $${order.total.toFixed(2)}</strong></div>
        </div>
    `;

    modal.classList.add('active');
    currentOrderId = orderId;
}

// Update order status
function updateStatus(newStatus) {
    const orders = getOrders();
    const order = orders.find(o => o.id === currentOrderId);
    
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        showOrderDetails(currentOrderId);
    }
}

// Filter orders
function filterOrders() {
    displayOrders();
}

// Close modal
document.querySelector('.close').onclick = function() {
    document.getElementById('orderModal').classList.remove('active');
};

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        modal.classList.remove('active');
    }
};

// Initialize dashboard
let currentOrderId = null;
document.addEventListener('DOMContentLoaded', displayOrders);