import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../styles/FarmerOrders.css';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${config.API_BASE_URL}/orders/farmer-orders`, axiosConfig);
      setOrders(response.data);
    } catch (error) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
      
      const data = { status };
      if (status === 'rejected' && rejectionReason) {
        data.rejectionReason = rejectionReason;
      }

      await axios.put(`${config.API_BASE_URL}/orders/${orderId}`, data, axiosConfig);
      setRejectionReason('');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      setError('Failed to update order status. Please try again.');
      console.error('Error updating order status:', error);
    }
  };

  const handleRejectClick = (order) => {
    setSelectedOrder(order);
  };

  const closeRejectionModal = () => {
    setSelectedOrder(null);
    setRejectionReason('');
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

      {loading ? (
        <div className="loading-spinner">Loading orders...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            const item = order.items?.[0];
            const product = item?.product || {};
            const snapshot = item?.productSnapshot || {};
            const displayProduct = (product && product.name) ? product : snapshot;
            return (
              <div key={order._id} className="order-card">
                <div className="order-img-col">
                  <img
                    src={displayProduct.image ? displayProduct.image : 'https://placehold.co/120x120?text=No+Image'}
                    alt={displayProduct.name || 'Product'}
                    className="order-img"
                  />
                </div>
                <div className="order-main-col">
                  <div className="order-header">
                    <h3 className="product-name">{displayProduct.name || 'N/A'}</h3>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
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
                        (typeof displayProduct.price === 'number' && typeof item?.quantity === 'number')
                          ? (displayProduct.price * item.quantity)
                          : (order.totalPrice ? order.totalPrice : 'N/A')
                      }</p>
                      <p><strong>Delivery Type:</strong> {order.deliveryType || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="order-actions">
                    {order.status === 'Pending' ? (
                      <>
                        <button 
                          className="accept-btn" 
                          onClick={() => updateOrderStatus(order._id, 'Accepted')}
                        >
                          Accept Order
                        </button>
                        <button 
                          className="reject-btn" 
                          onClick={() => handleRejectClick(order)}
                        >
                          Reject Order
                        </button>
                      </>
                    ) : order.status === 'Accepted' ? (
                      <button 
                        className="deliver-btn" 
                        onClick={() => updateOrderStatus(order._id, 'Delivered')}
                      >
                        Mark as Delivered
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      {selectedOrder && (
        <div className="rejection-modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeRejectionModal}>&times;</span>
            <h3>Reject Order</h3>
            <p>Please provide a reason for rejecting this order:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={closeRejectionModal}
              >
                Cancel
              </button>
              <button 
                className="confirm-reject-btn" 
                onClick={() => updateOrderStatus(selectedOrder._id, 'Rejected')}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;