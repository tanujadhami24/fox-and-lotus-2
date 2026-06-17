const express = require('express');
const router = express.Router();
const { createCheckoutOrder, verifyPayment, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/checkout', protect, createCheckoutOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);

module.exports = router;
