const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vertical: {
    type: String,
    enum: ['Safety Products', 'Referral Products', 'Awareness Sessions'],
    required: true
  },
  images: [{
    type: String // URL or local path to the image
  }],
  badge: {
    type: String
  },
  affiliateUrl: {
    type: String
  },
  sections: [{
    type: String,
    enum: ['Best Sellers', 'New Launches', 'Essentials', 'Uncategorized']
  }],
  mrp: {
    type: Number,
    required: true,
    default: 0
  },
  features: [{
    type: String
  }],
  sizes: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 5.0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  activeOffer: {
    type: String
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  benefits: {
    type: String
  },
  howToUse: {
    type: String
  },
  specifications: {
    type: String
  }
});

module.exports = mongoose.model('Product', productSchema);
