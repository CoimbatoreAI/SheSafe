const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay (Fallback to test keys if env variables not set)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',
});

// @desc    Create new order & Razorpay Order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    try {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Create Razorpay order
      const options = {
        amount: Math.round(totalPrice * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: `receipt_order_${createdOrder._id}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.status(201).json({
        orderId: createdOrder._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';

  // Create signature for verification
  let hmac = crypto.createHmac('sha256', key_secret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment verified
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'success',
        update_time: Date.now(),
      };
      await order.save();
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
};

module.exports = { addOrderItems, verifyPayment };
