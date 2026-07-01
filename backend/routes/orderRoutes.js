const express = require('express');
const router = express.Router();
const { addOrderItems, verifyPayment } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.post('/verify', protect, verifyPayment);

module.exports = router;
