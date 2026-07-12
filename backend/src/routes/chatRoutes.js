const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { chatRateLimiter } = require('../middleware/rateLimitMiddleware');

// Public route but rate limited
router.post('/', chatRateLimiter, chatController.handleChat);

module.exports = router;
