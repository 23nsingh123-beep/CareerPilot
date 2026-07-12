const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, announcementController.getAnnouncements);

module.exports = router;
