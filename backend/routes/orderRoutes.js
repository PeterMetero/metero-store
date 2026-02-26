const express = require('express');
const { addToCart, getCart } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/cart/add', auth, addToCart);
router.get('/cart', auth, getCart);

module.exports = router;