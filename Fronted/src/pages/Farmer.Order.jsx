import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FarmerOrders.css';

const FarmerOrders = () => {
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
        console.error('Error fetching orders:', err);
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
      console.error('Error updating order status:', err);
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="farmer-orders-container">
      <h2>Incoming Orders</h2>
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
                  <h3>{order.items[0].product.name}</h3>
                  <p>Customer: {order.customer.name}</p>
                  <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Quantity: {order.items[0].quantity}</p>
                  <p>Total Price: ₹{order.totalPrice}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
              {order.status === 'Pending' && (
                <div className="order-actions">
                  <button onClick={() => updateOrderStatus(order._id, 'Accepted')}>Accept</button>
                  <button onClick={() => updateOrderStatus(order._id, 'Rejected')}>Reject</button>
                </div>
              )}
              {order.status === 'Accepted' && (
                <button onClick={() => updateOrderStatus(order._id, 'Delivered')}>Mark as Delivered</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default FarmerOrders;