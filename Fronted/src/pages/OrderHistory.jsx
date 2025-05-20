import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          return;
        }
        
        const config = { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        };
        
        const res = await axios.get('http://localhost:8000/api/orders/my-orders', config);
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history-container">
      <h2>My Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-details">
                <img
                  src={order.items[0].product.image || 'https://placehold.co/80x80'}
                  alt={order.items[0].product.name}
                  className="order-img"
                />
                <div>
                  <h3 className="product-name">{order.items[0].product.name}</h3>
                  <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Quantity: {order.items[0].quantity}</p>
                  <p>
                    Total Price: ₹{
                      order.totalPrice
                        ? order.totalPrice.toFixed(2)
                        : order.items.reduce(
                            (sum, item) => sum + (item.product.price * item.quantity),
                            0
                          ).toFixed(2)
                    }
                  </p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
              <button className="track-order-btn">Track Order</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;