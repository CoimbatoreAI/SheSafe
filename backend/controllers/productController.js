const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { title, price, description, vertical, badge, affiliateUrl, sections, mrp, features, sizes, rating, reviewsCount, activeOffer, stock, benefits, howToUse, specifications } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = await Product.create({
      title,
      price: Number(price),
      description,
      vertical,
      images,
      badge,
      affiliateUrl,
      sections: sections ? sections.split(',').map(s => s.trim()).filter(s => s !== "") : [],
      mrp: Number(mrp) || Number(price) * 1.5,
      features: features ? features.split(',').map(f => f.trim()).filter(f => f !== "") : [],
      sizes: sizes ? sizes.split(',').map(s => s.trim()).filter(s => s !== "") : [],
      rating: Number(rating) || 5.0,
      reviewsCount: Number(reviewsCount) || 0,
      activeOffer,
      stock: Number(stock) || 0,
      benefits,
      howToUse,
      specifications
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { title, price, description, vertical, badge, affiliateUrl, sections, mrp, features, sizes, rating, reviewsCount, activeOffer, stock, benefits, howToUse, specifications } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      if (title !== undefined) product.title = title;
      if (price !== undefined) product.price = Number(price);
      if (description !== undefined) product.description = description;
      if (vertical !== undefined) product.vertical = vertical;
      if (badge !== undefined) product.badge = badge;
      if (affiliateUrl !== undefined) product.affiliateUrl = affiliateUrl;
      if (sections !== undefined) product.sections = typeof sections === 'string' ? sections.split(',').map(s => s.trim()).filter(s => s !== "") : sections;
      if (mrp !== undefined) product.mrp = Number(mrp);
      if (features !== undefined) product.features = typeof features === 'string' ? features.split(',').map(f => f.trim()).filter(f => f !== "") : features;
      if (sizes !== undefined) product.sizes = typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()).filter(s => s !== "") : sizes;
      if (rating !== undefined) product.rating = Number(rating);
      if (reviewsCount !== undefined) product.reviewsCount = Number(reviewsCount);
      if (activeOffer !== undefined) product.activeOffer = activeOffer;
      if (stock !== undefined) product.stock = Number(stock);
      if (benefits !== undefined) product.benefits = benefits;
      if (howToUse !== undefined) product.howToUse = howToUse;
      if (specifications !== undefined) product.specifications = specifications;
      if (req.files && req.files.length > 0) {
         product.images = req.files.map(file => `/uploads/${file.filename}`);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
