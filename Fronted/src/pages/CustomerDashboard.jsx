import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({ quantity: 1, deliveryType: 'Delivery' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/products');
        setProducts(res.data.products || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching all products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setOrderForm({ quantity: 1, deliveryType: 'Delivery' });
    setMessage('');
    setError('');
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const quantity = Number(orderForm.quantity);
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to place an order.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const payload = {
        items: [{ product: selectedProduct._id, quantity }],
        deliveryType: orderForm.deliveryType,
      };

      console.log('Payload:', payload);

      const response = await axios.post('http://localhost:8000/api/orders', payload, config);
      console.log('Response:', response.data);

      setMessage('Order placed successfully!');
      setSelectedProduct(null);
      setOrderForm({ quantity: 1, deliveryType: 'Delivery' });
    } catch (err) {
      console.error('Order Error:', err?.response?.data || err);
      setError(err?.response?.data?.message || 'Could not place order. Try again later.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'orderModalOverlay') {
      setSelectedProduct(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/CustomerDashboard" className="nav-link">Products</Link>
        <Link to="/OrderHistory" className="nav-link">Order History</Link>
        <Link to="/Profile" className="nav-link">Profile</Link>
        <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
      </nav>

      <h2 className="heading">All Available Farmer Products</h2>

      {message && <div className="message-success">{message}</div>}
      {error && <div className="message-error">{error}</div>}

      {loading ? (
        <p className="loading">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="no-products">No products available at the moment.</p>
      ) : (
        <div className="products-grid">
          {products.map((prod) => (
            <div key={prod._id} className="product-card">
              {prod.image && (
                <img src={prod.image} alt={prod.name} className="product-img" />
              )}
              <h3 className="product-name">{prod.name}</h3>
              <p className="product-category">Category: {prod.category}</p>
              <p className="product-desc">{prod.description}</p>
              <p className="product-price">₹ {prod.price}</p>
              <p className="product-available">Available: {prod.quantity}</p>
              <button onClick={() => handleOrderClick(prod)} className="order-btn">
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div
          id="orderModalOverlay"
          className="modal-overlay"
          onClick={handleOverlayClick}
        >
          <div className="modal-content">
            <h3 className="modal-title">Order: {selectedProduct.name}</h3>

            <form onSubmit={handleOrderSubmit} className="modal-form">
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={orderForm.quantity}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, quantity: Number(e.target.value) })
                  }
                  required
                />
              </label>

              <label>
                Delivery Type:
                <select
                  value={orderForm.deliveryType}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, deliveryType: e.target.value })
                  }
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="submit" className="modal-submit">Place Order</button>
                <button type="button" onClick={() => setSelectedProduct(null)} className="modal-cancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;