const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  audience: {
    type: String,
    enum: ['all', 'student', 'recruiter'],
    default: 'all',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
