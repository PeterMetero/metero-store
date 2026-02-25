const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Import auth middleware
const auth = require('../middleware/auth');

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products (admin only – requires auth middleware to set req.user)
router.post('/', auth, createProduct);

// PUT /api/products/:id (admin only – requires auth middleware)
router.put('/:id', auth, updateProduct);

// DELETE /api/products/:id (admin only – requires auth middleware)
router.delete('/:id', auth, deleteProduct);

// PUT /api/products/:id (admin only)
router.put('/:id', updateProduct);

// DELETE /api/products/:id (admin only)
router.delete('/:id', deleteProduct);

module.exports = router;