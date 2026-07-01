const express = require('express');
const router = express.Router();
const { authUser, subscribeNewsletter } = require('../controllers/userController');

router.post('/login', authUser);
router.post('/subscribe', subscribeNewsletter);

module.exports = router;
