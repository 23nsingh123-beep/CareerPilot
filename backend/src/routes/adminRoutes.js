const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorizeRoles('admin'), adminController.getDashboardData);

router.get('/users', protect, authorizeRoles('admin'), adminController.getUsers);
router.get('/users/:id', protect, authorizeRoles('admin'), adminController.getUserById);
router.patch('/users/:id/status', protect, authorizeRoles('admin'), adminController.updateUserStatus);
router.patch('/users/:id/role', protect, authorizeRoles('admin'), adminController.updateUserRole);
router.delete('/users/:id', protect, authorizeRoles('admin'), adminController.deleteUser);

router.get('/reports', protect, authorizeRoles('admin'), adminController.getReports);

router.post('/announcements', protect, authorizeRoles('admin'), adminController.createAnnouncement);
router.get('/announcements', protect, authorizeRoles('admin'), adminController.getAnnouncements);
router.put('/announcements/:id', protect, authorizeRoles('admin'), adminController.updateAnnouncement);
router.patch('/announcements/:id/status', protect, authorizeRoles('admin'), adminController.updateAnnouncementStatus);
router.delete('/announcements/:id', protect, authorizeRoles('admin'), adminController.deleteAnnouncement);

module.exports = router;
