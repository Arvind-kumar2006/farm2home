const express = require('express');
const router = express.Router();
const OrderController = require('../Controllers/OrderController');
const auth = require('../middleware/auth');

// Create new order
router.post('/create', auth, OrderController.createOrder);

// Get all orders for customer
router.get('/customer', auth, OrderController.getCustomerOrders);

// Get all orders for farmer
router.get('/farmer', auth, OrderController.getFarmerOrders);

// Get single order details
router.get('/:orderId', auth, OrderController.getOrderDetails);

// Update order status
router.patch('/:orderId/status', auth, OrderController.updateOrderStatus);

module.exports = router; 