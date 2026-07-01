const Hero = require('../models/Hero');

// @desc    Get all active hero images
// @route   GET /api/hero
// @access  Public
const getHeroImages = async (req, res) => {
  try {
    const heroes = await Hero.find({ isActive: true }).sort('-createdAt');
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a hero image
// @route   POST /api/hero
// @access  Private/Admin
const createHeroImage = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    if (images.length === 0) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const createdHeroes = [];
    for (const image of images) {
       const hero = await Hero.create({ image });
       createdHeroes.push(hero);
    }
    
    res.status(201).json(createdHeroes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a hero image
// @route   DELETE /api/hero/:id
// @access  Private/Admin
const deleteHeroImage = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (hero) {
      await hero.deleteOne();
      res.json({ message: 'Hero removed' });
    } else {
      res.status(404).json({ message: 'Hero not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHeroImages, createHeroImage, deleteHeroImage };
