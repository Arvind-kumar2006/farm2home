const express = require('express');
const router = express.Router();

const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../Controllers/Order');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Customer Routes
router.post('/', authenticateUser, createOrder);
router.get('/my-orders', authenticateUser, authorizeRoles('customer'), getUserOrders);

// Farmer Routes
router.get('/', authenticateUser, authorizeRoles('farmer'), getAllOrders);
router.put('/:id', authenticateUser, authorizeRoles('farmer'), updateOrderStatus);

module.exports = router;