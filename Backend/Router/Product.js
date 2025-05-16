const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFarmerProducts
} = require('../Controllers/Product');

const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Correct order of routes
router.get('/my-products', authenticateUser, authorizeRoles('farmer'), getFarmerProducts);
router.get('/', getAllProducts); // this must come BEFORE any route with ":id"
router.get('/:id', getProductById);
router.post('/', authenticateUser, authorizeRoles('farmer'), createProduct);
router.put('/:id', authenticateUser, authorizeRoles('farmer'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('farmer'), deleteProduct);

module.exports = router;