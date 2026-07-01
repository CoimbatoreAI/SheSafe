const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protectAdmin } = require('../middleware/authMiddleware'); // For Admin protect

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.route('/')
  .get(getProducts)
  .post(protectAdmin, upload.array('images', 5), createProduct);

router.route('/:id')
  .put(protectAdmin, upload.array('images', 5), updateProduct)
  .delete(protectAdmin, deleteProduct);

module.exports = router;
