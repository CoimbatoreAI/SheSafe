const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const Admin = require('./models/Admin');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const heroRoutes = require('./routes/heroRoutes');
const offerRoutes = require('./routes/offerRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow loading images via cross origin
app.use(cors({ origin: process.env.FRONTEND_URL || '*' })); // Restrict CORS in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  // express-mongo-sanitize's default middleware crashes in Express 5 because req.query is a getter.
  // We sanitize in place instead.
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
});
app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads dir exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Seed Admin if it doesn't exist
    const adminExists = await Admin.findOne({ email: 'admin@shesafe.in' });
    if (!adminExists) {
      await Admin.create({ email: 'admin@shesafe.in', password: 'ramesh@1141' });
      console.log('Admin user seeded');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/offers', offerRoutes);

app.get('/api/config/razorpay', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
