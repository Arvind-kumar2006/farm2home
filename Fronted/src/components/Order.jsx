import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Order.css';

const Order = ({ userType }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [userType]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = userType === 'customer' ? '/api/orders/customer' : '/api/orders/farmer';
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <h2>{userType === 'customer' ? 'My Orders' : 'Farmer Orders'}</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4>{item.product.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.product.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <p className="total">Total: ${order.totalPrice}</p>
              <p className="delivery-type">Delivery: {order.deliveryType}</p>
              <p className="date">
                Ordered on: {new Date(order.orderDate).toLocaleDateString()}
              </p>
              
              {userType === 'farmer' && order.status === 'Pending' && (
                <div className="order-actions">
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'Accepted')}
                    className="accept-btn"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(order._id, 'Rejected')}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              )}
              
              {userType === 'farmer' && order.status === 'Accepted' && (
                <button 
                  onClick={() => updateOrderStatus(order._id, 'Delivered')}
                  className="deliver-btn"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order; 