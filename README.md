# FlipShop - E-Commerce Application 🛍️

A fully functional Flipkart-like e-commerce application built with Node.js, Express, and SQLite.

## Features

### 🛒 Shopping Features
- **Product Browsing**: Browse all products with detailed information
- **Category Filtering**: Shop by product categories
- **Search**: Quick search for products
- **Advanced Filters**: Filter by price range, rating, and sort options
- **Product Details**: View detailed product information with ratings and reviews
- **Shopping Cart**: Add/remove items from cart with quantity management
- **Checkout**: Multi-step checkout process with shipping and payment options

### 👤 User Features
- **User Registration**: Create new user accounts
- **User Login**: Secure login with password
- **User Profile**: Manage profile information and address
- **Order History**: View all past orders with status tracking
- **Logout**: Secure session management

### 💳 Payment & Shipping
- **Multiple Payment Methods**: Credit/Debit Card, UPI, Cash on Delivery
- **Shipping Address**: Save and manage shipping addresses
- **Order Tracking**: Track order status (pending, completed)
- **Tax Calculation**: Automatic tax calculation (10%)
- **Free Shipping**: Free shipping on orders above ₹500

### 📊 Product Management
- **8 Sample Products**: Pre-loaded e-commerce products
- **Product Ratings**: Star ratings and review counts
- **Discount Badges**: Show discounts on products
- **Stock Management**: Track product availability

## Project Structure

```
front/
├── server.js                 # Express server and API routes
├── package.json              # Project dependencies
├── ecommerce.db              # SQLite database (auto-created)
├── public/
│   ├── index.html            # Main HTML file
│   ├── styles.css            # Complete CSS styling
│   └── app.js                # Frontend JavaScript
└── README.md                 # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd d:\front
   ```

2. **Install dependencies** (already done, but to reinstall)
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

   The server will start at `http://localhost:3000`

4. **Open in browser**
   - Navigate to `http://localhost:3000` in your web browser

## API Documentation

### Authentication Routes

#### Register User
```
POST /api/auth/register
Body: { username, email, password, name }
```

#### Login User
```
POST /api/auth/login
Body: { username, password }
```

### User Routes

#### Get User Profile
```
GET /api/users/:id
```

#### Update User Profile
```
PUT /api/users/:id
Body: { name, phone, address, city, state, zipcode }
```

### Product Routes

#### Get All Products
```
GET /api/products
```

#### Get Single Product
```
GET /api/products/:id
```

#### Get Products by Category
```
GET /api/products/category/:category
```

#### Get Categories
```
GET /api/categories
```

### Cart Routes

#### Get Cart Items
```
GET /api/cart/:userId
```

#### Add to Cart
```
POST /api/cart
Body: { user_id, product_id, quantity }
```

#### Remove from Cart
```
DELETE /api/cart/:cartId
```

### Order Routes

#### Create Order
```
POST /api/orders
Body: { user_id, cart_items, total_amount, payment_method, shipping_address }
```

#### Get User Orders
```
GET /api/orders/:userId
```

#### Get Order Details
```
GET /api/orders/:userId/:orderId
```

## Database Schema

### Users Table
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password
- name
- phone
- address
- city
- state
- zipcode
- created_at

### Products Table
- id (PRIMARY KEY)
- name
- description
- price
- original_price
- discount
- category
- rating
- reviews
- image
- stock
- created_at

### Cart Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- quantity
- added_at

### Orders Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- total_amount
- status
- payment_method
- shipping_address
- created_at

### Order Items Table
- id (PRIMARY KEY)
- order_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- quantity
- price

## Usage Guide

### 1. Create Account
- Click "Account" → "Register here"
- Fill in username, email, full name, and password
- Click "Register"

### 2. Login
- Click "Account"
- Enter username and password
- Click "Login"

### 3. Browse Products
- View products on homepage
- Use categories to filter by type
- Use search bar to find specific products
- Use sidebar filters for advanced search

### 4. Add to Cart
- Click on a product to view details
- Click "Add to Cart" in product details modal
- Or click "Add to Cart" on product card

### 5. Manage Cart
- Click cart icon to view shopping cart
- Update quantities using +/- buttons
- Remove items with × button
- See total price calculation

### 6. Checkout
- Click "Proceed to Checkout" from cart
- Enter shipping address
- Select payment method
- Review order summary
- Click "Place Order"

### 7. View Orders
- Click "Account" → "My Orders" tab
- View all past orders with status and details

### 8. Update Profile
- Click "Account" → "Profile Info" tab
- Update personal information
- Click "Save Changes"

## Product Categories

1. **Electronics** - Earbuds, Smart Watch, Keyboard, Mouse
2. **Accessories** - USB Cable, Phone Stand, Screen Protector
3. **Bags** - Laptop Backpack

## Sample Test Data

Test accounts can be created with any credentials:
- Username: testuser
- Email: test@example.com
- Password: test123

Pre-loaded products include:
- Wireless Earbuds (₹1,999)
- Smart Watch (₹4,999)
- USB-C Cable (₹299)
- Phone Stand (₹399)
- Laptop Backpack (₹1,499)
- Mechanical Keyboard (₹3,999)
- Wireless Mouse (₹899)
- Screen Protector (₹199)

## Features Implementation

### Frontend Features
- ✅ Responsive design (works on mobile, tablet, desktop)
- ✅ Modal-based navigation
- ✅ Real-time cart updates
- ✅ Form validation
- ✅ Search and filter functionality
- ✅ Local storage for user session
- ✅ User authentication UI
- ✅ Order management interface

### Backend Features
- ✅ RESTful API
- ✅ User authentication
- ✅ Product management
- ✅ Shopping cart management
- ✅ Order processing
- ✅ Database management
- ✅ Error handling

## Customization

### Add More Products
Edit `server.js` and add products in the `insertSampleProducts()` function:

```javascript
const products = [
    { name: 'Product Name', category: 'Category', price: 999, ... },
    // Add more products here
];
```

### Change Prices/Discounts
Update the products array in `server.js`

### Modify Styles
Edit `public/styles.css` to customize colors, fonts, and layouts

### Add New Features
Extend API routes in `server.js` and frontend functionality in `public/app.js`

## Troubleshooting

### Server won't start
- Make sure port 3000 is not in use
- Check that all dependencies are installed: `npm install`

### Database errors
- Delete `ecommerce.db` to reset database
- Restart the server

### CORS errors
- CORS is already enabled in the app
- Make sure frontend is accessing `http://localhost:3000`

### Products not loading
- Check browser console for errors
- Verify API is responding: `http://localhost:3000/api/products`

## Performance Optimizations

- Lazy loading of products
- Client-side filtering and sorting
- Efficient database queries
- Local storage for user session
- CSS media queries for responsive design

## Security Features

- Password stored in database (in production, use hashing)
- Session management with localStorage
- Input validation
- CORS protection
- SQL injection prevention with parameterized queries

## Future Enhancements

- 🔐 Password hashing (bcryptjs)
- 📧 Email verification
- 💳 Real payment gateway integration
- ⭐ Wishlist functionality
- 📝 Product reviews and ratings
- 🔔 Order notifications
- 📊 Admin dashboard
- 🖼️ Product image uploads
- 🌙 Dark mode theme
- 🚀 Deploy to cloud platform

## License

MIT License - Free to use and modify

## Support

For issues or questions, check:
1. Browser console for error messages
2. Server console for API errors
3. Database file (ecommerce.db) integrity

---

**Built with ❤️ using Node.js, Express, and SQLite**

Enjoy your FlipShop experience! 🎉
