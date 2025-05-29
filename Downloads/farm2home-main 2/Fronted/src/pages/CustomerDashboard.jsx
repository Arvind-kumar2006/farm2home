import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import config from '../config';
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
      const response = await axios.get(`${config.API_BASE_URL}/products`);
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
        `${config.API_BASE_URL}/orders`,
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

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="nav-logo">FarmFresh</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/CustomerDashboard" className="nav-link">Products</Link>
          <Link to="/OrderHistory" className="nav-link">Order History</Link>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Categories</h3>
        <div className="category-list">
          {categories.map((category) => (
            <label key={category} className="category-item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="page-title">All Available Farmer Products</h1>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
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
                {product.image && (
                  <img src={product.image} alt={product.name} className="product-image" />
                )}
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">Category: {product.category}</p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">₹ {product.price}</p>
                  <p className="product-availability">Available: {product.quantity}</p>
                  <button onClick={() => handleOrderClick(product)} className="order-button">
                    Order Now
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
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Type:</label>
                  <select
                    value={orderForm.deliveryType}
                    onChange={(e) => setOrderForm({ ...orderForm, deliveryType: e.target.value })}
                  >
                    <option value="Delivery">Delivery</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">Place Order</button>
                  <button type="button" onClick={() => setSelectedProduct(null)} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;