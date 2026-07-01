const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      email: admin.email,
      token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' })
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

module.exports = { authAdmin };
