const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const uploadImage = require('../middleware/imageUploadMiddleware');
const multer = require('multer');

// Get current user
router.get('/me', protect, userController.getCurrentUser);

// Update profile details
router.put('/profile', protect, userController.updateProfile);

// Upload profile image
router.post('/profile-image', protect, (req, res, next) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum size is 2MB.' });
      }
      return res.status(400).json({ error: err.field || err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, userController.uploadProfileImage);

module.exports = router;
