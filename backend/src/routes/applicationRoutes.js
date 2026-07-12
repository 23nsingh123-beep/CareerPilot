const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/my', protect, authorizeRoles('student'), applicationController.getMyApplications);
router.get('/recruiter', protect, authorizeRoles('recruiter', 'admin'), applicationController.getRecruiterApplications);
router.get('/job/:jobId', protect, authorizeRoles('recruiter', 'admin'), applicationController.getJobApplicants);
router.post('/', protect, authorizeRoles('student'), applicationController.applyForJob);
router.get('/:id', protect, authorizeRoles('recruiter', 'admin'), applicationController.getApplicationById);
router.patch('/:id/status', protect, authorizeRoles('recruiter', 'admin'), applicationController.updateApplicationStatus);

module.exports = router;
