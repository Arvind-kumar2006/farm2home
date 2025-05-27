import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FarmerOrders.css';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:8000/api/orders/farmer-orders', config);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/orders/${orderId}`, { status }, config);
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'Pending').length,
    accepted: orders.filter(order => order.status === 'Accepted').length,
    rejected: orders.filter(order => order.status === 'Rejected').length,
    delivered: orders.filter(order => order.status === 'Delivered').length,
  };

  return (
    <>
    <div className="farmer-orders-container">
      <h2>Customer Orders</h2>
      
      {/* Order Summary Bar */}
      <div className="order-summary-bar">
        <div className="summary-item">
          <span className="summary-label">Total Orders</span>
          <span className="summary-value">{orderStats.total}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Pending</span>
          <span className="summary-value pending">{orderStats.pending}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Accepted</span>
          <span className="summary-value accepted">{orderStats.accepted}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Rejected</span>
          <span className="summary-value rejected">{orderStats.rejected}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Delivered</span>
          <span className="summary-value delivered">{orderStats.delivered}</span>
        </div>
      </div>

      <div className="order-list">
        {orders.map((order) => {
          const item = order.items?.[0];
          const product = item?.product || {};
          return (
            <div key={order._id} className="order-card">
              <div className="order-img-col">
                <img
                  src={product.image ? product.image : 'https://placehold.co/120x120?text=No+Image'}
                  alt={product.name || 'Product'}
                  className="order-img"
                />
              </div>
              <div className="order-main-col">
                <div className="order-header">
                  <h3 className="product-name">{product.name || 'N/A'}</h3>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="order-info">
                  <div className="customer-info">
                    <h4>Customer Details</h4>
                    <p><strong>Name:</strong> {order.customer?.name || 'Unknown'}</p>
                    <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
                  </div>
                  <div className="order-details">
                    <p><strong>Quantity:</strong> {item?.quantity || 0}</p>
                    <p><strong>Total Price:</strong> ₹{
                      (typeof product.price === 'number' && typeof item?.quantity === 'number')
                        ? (product.price * item.quantity)
                        : (order.totalPrice ? order.totalPrice : 'N/A')
                    }</p>
                    <p><strong>Delivery Type:</strong> {order.deliveryType || 'N/A'}</p>
                  </div>
                </div>
                <div className="order-actions">
                  {order.status === 'Pending' ? (
                    <>
                      <button className="accept-btn" onClick={() => updateOrderStatus(order._id, 'Accepted')}>Accept</button>
                      <button className="reject-btn" onClick={() => updateOrderStatus(order._id, 'Rejected')}>Reject</button>
                    </>
                  ) : order.status === 'Accepted' ? (
                    <button className="deliver-btn" onClick={() => updateOrderStatus(order._id, 'Delivered')}>Mark as Delivered</button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default FarmerOrders;