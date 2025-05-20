const express = require('express');
const router = express.Router();

const { createOrder, getUserOrders, getAllOrders, updateOrderStatus ,getFarmerOrders} = require('../Controllers/Order');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');


router.post('/', authenticateUser, createOrder);
router.get('/my-orders', authenticateUser, authorizeRoles('customer'), getUserOrders);
router.get('/farmer-orders', authenticateUser, authorizeRoles('farmer'), getFarmerOrders);

router.get('/', authenticateUser, authorizeRoles('farmer'), getAllOrders);
router.put('/:id', authenticateUser, authorizeRoles('farmer'), updateOrderStatus);

module.exports = router;