import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
        
        const axiosConfig = { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        };
        
        const res = await axios.get(`${config.API_BASE_URL}/orders/my-orders`, axiosConfig);
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return '#4CAF50';
      case 'rejected':
        return '#f44336';
      case 'delivered':
        return '#2196F3';
      case 'pending':
        return '#FFA500';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      case 'delivered':
        return '📦';
      case 'pending':
        return '⏳';
      default:
        return '•';
    }
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="order-history-container">
      <h2>My Orders</h2>
      {loading ? (
        <div className="loading-spinner">Loading orders...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">No orders found.</div>
      ) : (
        <>
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Order Date</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const item = order.items[0];
                  const product = item.product || {};
                  const snapshot = item.productSnapshot || {};
                  const displayProduct = (product && product.name) ? product : snapshot;
                  return (
                    <tr key={order._id}>
                      <td>{displayProduct.name || 'Product Deleted'}</td>
                      <td>
                        <img
                          src={displayProduct.image || 'https://placehold.co/80x80'}
                          alt={displayProduct.name || 'Product Deleted'}
                          className="order-img"
                        />
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{item.quantity}</td>
                      <td>₹{
                        order.totalPrice
                          ? order.totalPrice.toFixed(2)
                          : (displayProduct.price && item.quantity)
                            ? (displayProduct.price * item.quantity).toFixed(2)
                            : 'N/A'
                      }</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="track-order-btn"
                          onClick={() => handleTrackOrder(order)}
                        >
                          Track Order
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="order-details-modal">
              <div className="modal-content">
                <span className="close-button" onClick={closeOrderDetails}>&times;</span>
                <h3>Order Details</h3>
                <div className="order-info">
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p><strong>Delivery Type:</strong> {selectedOrder.deliveryType}</p>
                  {selectedOrder.status === 'rejected' && selectedOrder.rejectionReason && (
                    <p><strong>Rejection Reason:</strong> {selectedOrder.rejectionReason}</p>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <p><strong>Delivery Date:</strong> {new Date(selectedOrder.updatedAt).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="email-notification-info">
                  <p>📧 Email notifications have been sent for all status updates.</p>
                  <p>Please check your email for detailed order information.</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistory;