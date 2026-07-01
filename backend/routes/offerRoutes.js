const express = require('express');
const router = express.Router();
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getOffers)
  .post(protectAdmin, createOffer);

router.route('/:id')
  .put(protectAdmin, updateOffer)
  .delete(protectAdmin, deleteOffer);

module.exports = router;
