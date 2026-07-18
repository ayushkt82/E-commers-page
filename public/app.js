const API_BASE = 'http://localhost:3000/api';

let currentUser = null;
let cart = [];
let allProducts = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    setupEventListeners();
    checkUserSession();
});

// Setup Event Listeners
function setupEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Navbar links
    document.getElementById('accountLink').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
            showProfileModal();
        } else {
            document.getElementById('loginModal').classList.add('show');
        }
    });

    document.getElementById('cartLink').addEventListener('click', (e) => {
        e.preventDefault();
        showCartModal();
    });

    // Search
    document.getElementById('searchBtn').addEventListener('click', searchProducts);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProducts();
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginModal').classList.remove('show');
        document.getElementById('registerModal').classList.add('show');
    });
    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerModal').classList.remove('show');
        document.getElementById('loginModal').classList.add('show');
    });

    // Filters
    document.getElementById('priceRange').addEventListener('input', (e) => {
        document.getElementById('priceValue').textContent = '₹' + e.target.value;
    });
    document.getElementById('applyFilters').addEventListener('click', applyFilters);

    // Profile form
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Profile tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tab).classList.add('active');
            
            if (tab === 'my-orders') {
                loadUserOrders();
            }
        });
    });

    // Checkout form
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const categories = await response.json();
        
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = categories.map(cat => `
            <div class="category-card" onclick="filterByCategory('${cat}')">
                <p>${cat}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">
                    ${product.name}
                </div>
                ${product.discount > 0 ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="rating-stars">★★★★☆</span>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    ${product.original_price ? `<span class="original-price">₹${product.original_price}</span>` : ''}
                </div>
                <button class="btn-add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id}, 1)">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Filter by category
async function filterByCategory(category) {
    try {
        const response = await fetch(`${API_BASE}/products/category/${category}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error filtering by category:', error);
    }
}

// Search products
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
    );
    displayProducts(filtered);
}

// Apply filters
function applyFilters() {
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    const minRating = document.getElementById('ratingFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    let filtered = allProducts.filter(p => p.price <= maxPrice);

    if (minRating) {
        filtered = filtered.filter(p => p.rating >= parseInt(minRating));
    }

    if (sortBy === 'low-to-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-to-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    displayProducts(filtered);
}

// Show product detail
async function showProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const detailHtml = `
        <div class="product-detail-image">
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white;">
                ${product.name}
            </div>
        </div>
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <div class="product-detail-rating">
                <span class="rating-stars">★★★★☆</span>
                <span>${product.rating} (${product.reviews} reviews)</span>
            </div>
            <div class="product-detail-price">
                <span class="price-main">₹${product.price}</span>
                ${product.original_price ? `<span class="price-original">₹${product.original_price}</span>` : ''}
                ${product.discount > 0 ? `<span class="price-discount">${product.discount}% OFF</span>` : ''}
            </div>
            <div class="product-detail-stock">
                <span class="${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
            </div>
            <div class="product-detail-description">
                <p>${product.name} - Premium quality product with excellent reviews. Great value for money.</p>
            </div>
            <div class="product-detail-actions">
                <button class="btn-primary" onclick="addToCart(${product.id}, 1)">Add to Cart</button>
                <button class="btn-secondary" onclick="document.getElementById('productModal').classList.remove('show')">Close</button>
            </div>
        </div>
    `;

    document.getElementById('productDetail').innerHTML = detailHtml;
    document.getElementById('productModal').classList.add('show');
}

// Add to cart
function addToCart(productId, quantity) {
    if (!currentUser) {
        alert('Please login first');
        document.getElementById('loginModal').classList.add('show');
        return;
    }

    fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            product_id: productId,
            quantity: quantity
        })
    })
    .then(res => res.json())
    .then(data => {
        updateCartCount();
        alert('Product added to cart!');
        document.getElementById('productModal').classList.remove('show');
    })
    .catch(error => console.error('Error adding to cart:', error));
}

// Update cart count
function updateCartCount() {
    if (currentUser) {
        fetch(`${API_BASE}/cart/${currentUser.id}`)
            .then(res => res.json())
            .then(items => {
                const total = items.reduce((sum, item) => sum + item.quantity, 0);
                document.getElementById('cartCount').textContent = total;
            });
    }
}

// Show cart modal
async function showCartModal() {
    if (!currentUser) {
        alert('Please login first');
        document.getElementById('loginModal').classList.add('show');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/cart/${currentUser.id}`);
        const cartItems = await response.json();

        let html = '';
        if (cartItems.length === 0) {
            html = '<div class="cart-empty">Your cart is empty</div>';
        } else {
            let subtotal = 0;
            cartItems.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            html = `
                <div class="cart-items">
                    ${cartItems.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; text-align: center; padding: 5px;">
                                    ${item.name}
                                </div>
                            </div>
                            <div class="cart-item-info">
                                <h3>${item.name}</h3>
                                <p>₹${item.price}</p>
                            </div>
                            <div class="cart-item-quantity">
                                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <input type="text" value="${item.quantity}" readonly>
                                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span>Subtotal:</span>
                        <span>₹${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>Shipping:</span>
                        <span>₹${subtotal > 500 ? 'FREE' : '50'}</span>
                    </div>
                    <div class="cart-summary-row">
                        <span>Tax (10%):</span>
                        <span>₹${(subtotal * 0.1).toFixed(2)}</span>
                    </div>
                    <div class="cart-summary-total">
                        <span>Total:</span>
                        <span>₹${((subtotal * 1.1) + (subtotal > 500 ? 0 : 50)).toFixed(2)}</span>
                    </div>
                </div>
                <div class="cart-actions">
                    <button class="btn-secondary" onclick="document.getElementById('cartModal').classList.remove('show')">Continue Shopping</button>
                    <button class="btn-primary" onclick="showCheckout()">Proceed to Checkout</button>
                </div>
            `;
        }

        document.getElementById('cartContainer').innerHTML = html;
        document.getElementById('cartModal').classList.add('show');
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Remove from cart
function removeFromCart(cartId) {
    fetch(`${API_BASE}/cart/${cartId}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            updateCartCount();
            showCartModal();
        })
        .catch(error => console.error('Error removing from cart:', error));
}

// Show checkout
async function showCheckout() {
    const response = await fetch(`${API_BASE}/cart/${currentUser.id}`);
    const cartItems = await response.json();

    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const summary = `
        ${cartItems.map(item => `
            <div class="order-summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <div class="order-summary-item">
            <span>Subtotal</span>
            <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div class="order-summary-item">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'FREE' : '₹' + shipping}</span>
        </div>
        <div class="order-summary-item">
            <span>Tax (10%)</span>
            <span>₹${tax.toFixed(2)}</span>
        </div>
        <div class="order-summary-item total">
            <span>Total</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
    `;

    document.getElementById('orderSummary').innerHTML = summary;
    document.getElementById('checkoutForm').dataset.total = total.toFixed(2);
    document.getElementById('cartModal').classList.remove('show');
    document.getElementById('checkoutModal').classList.add('show');
}

// Handle checkout
function handleCheckout(e) {
    e.preventDefault();

    const name = document.getElementById('chkName').value;
    const address = document.getElementById('chkAddress').value;
    const city = document.getElementById('chkCity').value;
    const state = document.getElementById('chkState').value;
    const zipcode = document.getElementById('chkZipcode').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    const shippingAddress = `${address}, ${city}, ${state} - ${zipcode}`;

    fetch(`${API_BASE}/cart/${currentUser.id}`)
        .then(res => res.json())
        .then(cartItems => {
            const orderItems = cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }));

            return fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    cart_items: orderItems,
                    total_amount: parseFloat(document.getElementById('checkoutForm').dataset.total),
                    payment_method: paymentMethod,
                    shipping_address: shippingAddress
                })
            });
        })
        .then(res => res.json())
        .then(data => {
            alert(`Order placed successfully! Order ID: ${data.orderId}`);
            document.getElementById('checkoutModal').classList.remove('show');
            document.getElementById('checkoutForm').reset();
            updateCartCount();
        })
        .catch(error => console.error('Error placing order:', error));
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            document.getElementById('loginForm').reset();
            document.getElementById('loginModal').classList.remove('show');
            document.getElementById('accountLink').textContent = `👤 ${currentUser.name}`;
            updateCartCount();
            alert('Login successful!');
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const name = document.getElementById('regName').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, name, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            document.getElementById('registerForm').reset();
            document.getElementById('registerModal').classList.remove('show');
            document.getElementById('loginModal').classList.add('show');
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}

// Check user session
function checkUserSession() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('accountLink').textContent = `👤 ${currentUser.name}`;
        updateCartCount();
    }
}

// Show profile modal
async function showProfileModal() {
    try {
        const response = await fetch(`${API_BASE}/users/${currentUser.id}`);
        const user = await response.json();

        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileAddress').value = user.address || '';
        document.getElementById('profileCity').value = user.city || '';
        document.getElementById('profileState').value = user.state || '';
        document.getElementById('profileZipcode').value = user.zipcode || '';

        document.getElementById('profileModal').classList.add('show');
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update profile
function updateProfile(e) {
    e.preventDefault();

    const name = document.getElementById('profileName').value;
    const phone = document.getElementById('profilePhone').value;
    const address = document.getElementById('profileAddress').value;
    const city = document.getElementById('profileCity').value;
    const state = document.getElementById('profileState').value;
    const zipcode = document.getElementById('profileZipcode').value;

    fetch(`${API_BASE}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address, city, state, zipcode })
    })
    .then(res => res.json())
    .then(data => {
        alert('Profile updated successfully!');
        currentUser.name = name;
        localStorage.setItem('user', JSON.stringify(currentUser));
        document.getElementById('accountLink').textContent = `👤 ${name}`;
    })
    .catch(error => console.error('Error updating profile:', error));
}

// Load user orders
async function loadUserOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders/${currentUser.id}`);
        const orders = await response.json();

        let html = '';
        if (orders.length === 0) {
            html = '<p style="text-align: center; color: #999;">No orders yet</p>';
        } else {
            html = orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">Order #${order.id}</span>
                        <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Amount:</strong> ₹${order.total_amount.toFixed(2)}</p>
                        <p><strong>Payment:</strong> ${order.payment_method.toUpperCase()}</p>
                        <p><strong>Shipping:</strong> ${order.shipping_address}</p>
                    </div>
                </div>
            `).join('');
        }

        document.getElementById('ordersContainer').innerHTML = html;
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    document.getElementById('profileModal').classList.remove('show');
    document.getElementById('accountLink').textContent = '👤 Account';
    document.getElementById('cartCount').textContent = '0';
    alert('Logged out successfully!');
}
