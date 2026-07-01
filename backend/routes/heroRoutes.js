const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getHeroImages, createHeroImage, deleteHeroImage } = require('../controllers/heroController');
const { protectAdmin } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'hero_' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.route('/')
  .get(getHeroImages)
  .post(protectAdmin, upload.array('images', 5), createHeroImage);

router.route('/:id')
  .delete(protectAdmin, deleteHeroImage);

module.exports = router;
