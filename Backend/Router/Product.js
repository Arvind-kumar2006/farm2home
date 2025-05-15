const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} = require('../Controllers/Product');

const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');


router.get('/', getAllProducts);
router.get('/:id', getProductById);


router.post('/', authenticateUser, authorizeRoles('farmer'), createProduct);
router.put('/:id', authenticateUser, authorizeRoles('farmer'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('farmer'), deleteProduct);

module.exports = router;