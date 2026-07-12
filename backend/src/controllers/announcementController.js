const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role; // 'student', 'recruiter', or 'admin'
    
    let query = { isActive: true };
    
    if (userRole === 'student') {
      query.audience = { $in: ['all', 'student'] };
    } else if (userRole === 'recruiter') {
      query.audience = { $in: ['all', 'recruiter'] };
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
