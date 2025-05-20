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

  return (
    <div className="farmer-orders-container">
      <h2>Customer Orders</h2>
      <div className="order-list">
        {orders.map((order) => {
          const item = order.items?.[0];
          const product = item?.product || {};
          // Debug log
          console.log('Order:', order);
          console.log('Product:', product);
          return (
            <div key={order._id} className="order-card">
              <div className="order-img-col">
                <img
                  src={product.image ? product.image : 'https://placehold.co/120x120?text=No+Image'}
                  alt={product.name || 'Product'}
                  className="order-img"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x120?text=No+Image'; }}
                />
              </div>
              <div className="order-main-col">
                <div className="order-header">
                  <h3 className="product-name">{product.name || 'N/A'}</h3>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="order-info">
                  <p><strong>Customer:</strong> {order.customer?.name || 'Unknown'}</p>
                  <p><strong>Quantity:</strong> {item?.quantity || 0}</p>
                  <p><strong>Total Price:</strong> ₹{
                    (typeof product.price === 'number' && typeof item?.quantity === 'number')
                      ? (product.price * item.quantity).toFixed(2)
                      : (order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A')
                  }</p>
                  <p><strong>Delivery Type:</strong> {order.deliveryType || 'N/A'}</p>
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
  );
};

export default FarmerOrders;