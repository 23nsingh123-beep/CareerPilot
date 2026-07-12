const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required']
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter ID is required']
    },
    resume: {
      type: String,
      default: '' // Pending file upload integration
    },
    coverLetter: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'],
      default: 'Applied'
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate applications: one student per job
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
