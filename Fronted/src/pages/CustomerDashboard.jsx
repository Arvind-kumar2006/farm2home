import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({ quantity: 1, deliveryType: 'Delivery' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = ['Vegetables', 'Grains', 'Dairy', 'Fruits', 'Pulses', 'Spices'];
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategories, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/products');
      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setOrderForm({ quantity: 1, deliveryType: 'Delivery' });
    setMessage('');
    setError('');
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to place an order.');
        return;
      }

      // Check if requested quantity is greater than available stock
      if (orderForm.quantity > selectedProduct.quantity) {
        setError(`Sorry, only ${selectedProduct.quantity} units available. Please reduce your order quantity.`);
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/orders',
        {
          items: [{ product: selectedProduct._id, quantity: orderForm.quantity }],
          deliveryType: orderForm.deliveryType,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage('Order placed successfully!');
      setSelectedProduct(null);
      setOrderForm({ quantity: 1, deliveryType: 'Delivery' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">Farm2Home</Link>
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/CustomerDashboard" className="nav-link">Products</Link>
          <Link to="/OrderHistory" className="nav-link">Order History</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Filter by Category</h3>
        <div className="category-list">
          {categories.map((category) => (
            <label key={category} className="category-item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="page-title">Fresh Farm Products</h1>
        <p className="page-subtitle">Direct from local farmers to your table</p>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by product name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {message && <div className="message-success">{message}</div>}
        {error && <div className="message-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">No products available at the moment.</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">
                    <span>No image available</span>
                  </div>
                )}
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-availability">
                    {product.quantity > 0 ? `${product.quantity} units available` : 'Out of stock'}
                  </p>
                  <button
                    onClick={() => handleOrderClick(product)}
                    className="order-button"
                    disabled={product.quantity === 0}
                  >
                    {product.quantity > 0 ? 'Order Now' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Modal */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && setSelectedProduct(null)}>
            <div className="modal-content">
              <h3 className="modal-title">Order: {selectedProduct.name}</h3>
              <form onSubmit={handleOrderSubmit} className="modal-form">
                <div className="form-group">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Type:</label>
                  <select
                    value={orderForm.deliveryType}
                    onChange={(e) => setOrderForm({ ...orderForm, deliveryType: e.target.value })}
                    required
                  >
                    <option value="Delivery">Home Delivery</option>
                    <option value="Pickup">Store Pickup</option>
                  </select>
                </div>
                <button type="submit">Place Order</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;