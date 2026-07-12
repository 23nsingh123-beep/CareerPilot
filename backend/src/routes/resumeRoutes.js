const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const resumeAnalysisController = require('../controllers/resumeAnalysisController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const multer = require('multer');

// Single file upload route
router.post('/upload', protect, authorizeRoles('student'), (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.field });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, resumeController.uploadResume);

// Get current resume metadata route
router.get('/current', protect, authorizeRoles('student'), resumeController.getCurrentResume);

// AI Analysis Routes
router.post('/analyze', protect, authorizeRoles('student'), resumeAnalysisController.analyzeResume);
router.get('/analysis', protect, authorizeRoles('student'), resumeAnalysisController.getResumeAnalysis);

module.exports = router;
