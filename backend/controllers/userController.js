const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/mailer');

// @desc    Auth user (Login or Register)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, phone, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // User exists, check phone match
      if (user.phone !== phone) {
        return res.status(401).json({ message: 'Invalid phone number for this email' });
      }
      // Login success
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      // User does not exist, register them (need name)
      if (!name) {
        return res.status(400).json({ message: 'Name is required for new registration' });
      }

      user = await User.create({ name, email, phone });

      // Send Welcome Email
      await sendEmail({
        email: user.email,
        subject: 'Welcome to SheSafeIn!',
        html: `<h2>Welcome, ${user.name}!</h2><p>Thank you for joining SheSafeIn. We are committed to your safety.</p>`,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to Newsletter
// @route   POST /api/users/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;
  const Subscriber = require('../models/Subscriber');

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed' });
    }

    await Subscriber.create({ email });

    await sendEmail({
      email,
      subject: 'Subscription Confirmed - SheSafeIn',
      html: `<h2>Thanks for subscribing!</h2><p>You will now receive updates on new products and offers.</p>`,
    });

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { authUser, subscribeNewsletter };
