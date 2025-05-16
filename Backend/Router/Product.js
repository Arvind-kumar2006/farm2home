const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getFarmerProducts} = require('../Controllers/Product');

const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');


// Place custom routes BEFORE any :id route
router.get('/my-products', authenticateUser, authorizeRoles('farmer'), getFarmerProducts);
router.get('/:id', getProductById);
router.get('/', getAllProducts);
router.post('/', authenticateUser, authorizeRoles('farmer'), createProduct);

// Place :id-based routes last
router.get('/:id', getProductById);
router.put('/:id', authenticateUser, authorizeRoles('farmer'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('farmer'), deleteProduct);
module.exports = router;