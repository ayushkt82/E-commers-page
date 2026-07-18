const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('./ecommerce.db', (err) => {
    if (err) {
        console.error('Database opening error:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            name TEXT,
            phone TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            zipcode TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL,
            original_price REAL,
            discount INTEGER DEFAULT 0,
            category TEXT,
            rating REAL DEFAULT 4.5,
            reviews INTEGER DEFAULT 0,
            image TEXT,
            stock INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, () => {
            // Insert sample products
            insertSampleProducts();
        });

        // Cart table
        db.run(`CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER DEFAULT 1,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);

        // Orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount REAL,
            status TEXT DEFAULT 'pending',
            payment_method TEXT,
            shipping_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Order items table
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(product_id) REFERENCES products(id)
        )`);
    });
}

function insertSampleProducts() {
    const products = [
        { name: 'Wireless Earbuds', category: 'Electronics', price: 1999, original_price: 2999, discount: 33, image: 'earbuds.jpg', stock: 50 },
        { name: 'Smart Watch', category: 'Electronics', price: 4999, original_price: 7999, discount: 37, image: 'watch.jpg', stock: 30 },
        { name: 'USB-C Cable', category: 'Accessories', price: 299, original_price: 599, discount: 50, image: 'cable.jpg', stock: 100 },
        { name: 'Phone Stand', category: 'Accessories', price: 399, original_price: 799, discount: 50, image: 'stand.jpg', stock: 75 },
        { name: 'Laptop Backpack', category: 'Bags', price: 1499, original_price: 2999, discount: 50, image: 'backpack.jpg', stock: 40 },
        { name: 'Mechanical Keyboard', category: 'Electronics', price: 3999, original_price: 5999, discount: 33, image: 'keyboard.jpg', stock: 25 },
        { name: 'Wireless Mouse', category: 'Electronics', price: 899, original_price: 1499, discount: 40, image: 'mouse.jpg', stock: 60 },
        { name: 'Screen Protector', category: 'Accessories', price: 199, original_price: 399, discount: 50, image: 'protector.jpg', stock: 200 },
    ];

    const checkStmt = `SELECT COUNT(*) as count FROM products`;
    db.get(checkStmt, (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare(`INSERT INTO products (name, category, price, original_price, discount, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            products.forEach(product => {
                stmt.run(product.name, product.category, product.price, product.original_price, product.discount, product.image, product.stock);
            });
            stmt.finalize();
            console.log('Sample products inserted');
        }
    });
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    const query = `SELECT * FROM products`;
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM products WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(row);
        }
    });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
    const { category } = req.params;
    const query = `SELECT * FROM products WHERE category = ?`;
    db.all(query, [category], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Register user
app.post('/api/auth/register', (req, res) => {
    const { username, email, password, name } = req.body;
    const query = `INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)`;
    db.run(query, [username, email, password, name], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ message: 'User registered successfully', id: this.lastID });
        }
    });
});

// Login user
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT id, username, email, name FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            res.json({ message: 'Login successful', user: row });
        }
    });
});

// Get user profile
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT id, username, email, name, phone, address, city, state, zipcode FROM users WHERE id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(row);
        }
    });
});

// Update user profile
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, address, city, state, zipcode } = req.body;
    const query = `UPDATE users SET name = ?, phone = ?, address = ?, city = ?, state = ?, zipcode = ? WHERE id = ?`;
    db.run(query, [name, phone, address, city, state, zipcode, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Profile updated successfully' });
        }
    });
});

// Get cart
app.get('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT c.id, p.id as product_id, p.name, p.price, p.image, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `;
    db.all(query, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`;
    db.get(checkQuery, [user_id, product_id], (err, row) => {
        if (row) {
            const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`;
            db.run(updateQuery, [quantity, user_id, product_id], (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ message: 'Cart updated successfully' });
                }
            });
        } else {
            const insertQuery = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
            db.run(insertQuery, [user_id, product_id, quantity], (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json({ message: 'Item added to cart successfully' });
                }
            });
        }
    });
});

// Remove from cart
app.delete('/api/cart/:cartId', (req, res) => {
    const { cartId } = req.params;
    const query = `DELETE FROM cart WHERE id = ?`;
    db.run(query, [cartId], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Item removed from cart' });
        }
    });
});

// Create order
app.post('/api/orders', (req, res) => {
    const { user_id, cart_items, total_amount, payment_method, shipping_address } = req.body;
    const orderQuery = `INSERT INTO orders (user_id, total_amount, payment_method, shipping_address, status) VALUES (?, ?, ?, ?, 'pending')`;
    
    db.run(orderQuery, [user_id, total_amount, payment_method, shipping_address], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const orderId = this.lastID;
            const itemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
            const stmt = db.prepare(itemQuery);
            let inserted = 0;

            cart_items.forEach(item => {
                stmt.run(orderId, item.product_id, item.quantity, item.price, (err) => {
                    inserted++;
                    if (inserted === cart_items.length) {
                        // Clear cart
                        const clearCartQuery = `DELETE FROM cart WHERE user_id = ?`;
                        db.run(clearCartQuery, [user_id], () => {
                            res.json({ message: 'Order placed successfully', orderId });
                        });
                    }
                });
            });
            stmt.finalize();
        }
    });
});

// Get user orders
app.get('/api/orders/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(query, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get order details
app.get('/api/orders/:userId/:orderId', (req, res) => {
    const { userId, orderId } = req.params;
    const query = `
        SELECT o.*, 
               json_group_array(json_object('product_id', oi.product_id, 'product_name', p.name, 'quantity', oi.quantity, 'price', oi.price)) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ? AND o.id = ?
        GROUP BY o.id
    `;
    db.get(query, [userId, orderId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Order not found' });
        } else {
            res.json(row);
        }
    });
});

// Get all categories
app.get('/api/categories', (req, res) => {
    const query = `SELECT DISTINCT category FROM products ORDER BY category`;
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows.map(r => r.category));
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
