const Offer = require('../models/Offer');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Public
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort('-createdAt');
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private/Admin
const createOffer = async (req, res) => {
  try {
    const { code, discountPercentage } = req.body;
    
    if (!code || !discountPercentage) {
      return res.status(400).json({ message: 'Code and discount percentage are required' });
    }

    const offer = await Offer.create({
      code,
      discountPercentage: Number(discountPercentage)
    });

    res.status(201).json(offer);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Offer code already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (offer) {
      await offer.deleteOne();
      res.json({ message: 'Offer removed' });
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
const updateOffer = async (req, res) => {
  try {
    const { code, discountPercentage, isActive } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (offer) {
      if (code) offer.code = code;
      if (discountPercentage !== undefined) offer.discountPercentage = Number(discountPercentage);
      if (isActive !== undefined) offer.isActive = Boolean(isActive);

      const updatedOffer = await offer.save();
      res.json(updatedOffer);
    } else {
      res.status(404).json({ message: 'Offer not found' });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Offer code already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer
};
