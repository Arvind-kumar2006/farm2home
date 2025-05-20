import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:8000/api/orders/farmer-orders', config);
        setOrders(res.data);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:8000/api/orders/${orderId}`, { status }, config);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="orders-container">
      <h2>Incoming Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <img
                  src={order.items[0].product.image || 'https://placehold.co/80x80?text=No+Image'}
                  alt={order.items[0].product.name}
                  className="order-img"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80?text=No+Image'; }}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginRight: 16 }}
                />
                <h3>{order.items[0].product.name}</h3>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p>Customer: {order.customer.name}</p>
                <p>Quantity: {order.items[0].quantity}</p>
                <p>
                  Total Price: ₹
                  {order.totalPrice && order.totalPrice > 0
                    ? order.totalPrice
                    : (order.items[0].product.price && order.items[0].quantity
                        ? (order.items[0].product.price * order.items[0].quantity).toFixed(2)
                        : 'N/A')}
                </p>
                <p>Delivery Type: {order.deliveryType}</p>
              </div>
              <div className="order-actions">
                {order.status === 'Pending' && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => updateOrderStatus(order._id, 'Accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => updateOrderStatus(order._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {order.status === 'Accepted' && (
                  <button
                    className="deliver-btn"
                    onClick={() => updateOrderStatus(order._id, 'Delivered')}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;