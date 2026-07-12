const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', jobController.getAllJobs);
router.get('/recruiter/my-jobs', protect, authorizeRoles('recruiter', 'admin'), jobController.getRecruiterJobs);
router.get('/:id', jobController.getJobById);

router.post('/', protect, authorizeRoles('recruiter', 'admin'), jobController.createJob);
router.put('/:id', protect, authorizeRoles('recruiter', 'admin'), jobController.updateJob);
router.delete('/:id', protect, authorizeRoles('recruiter', 'admin'), jobController.deleteJob);
router.patch('/:id/status', protect, authorizeRoles('recruiter', 'admin'), jobController.updateJobStatus);

module.exports = router;
