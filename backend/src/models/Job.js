const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters long']
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    department: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    responsibilities: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    preferredQualifications: {
      type: [String],
      default: []
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    preferredSkills: {
      type: [String],
      default: []
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['full-time', 'part-time', 'internship', 'contract']
    },
    workMode: {
      type: String,
      required: [true, 'Work mode is required'],
      enum: ['on-site', 'hybrid', 'remote']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    salaryMin: {
      type: Number,
      default: null
    },
    salaryMax: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      default: 'USD'
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, 'Must have at least 1 opening']
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required']
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'expired'],
      default: 'draft'
    },
    aiMatchingEnabled: {
      type: Boolean,
      default: true
    },
    minimumMatchScore: {
      type: Number,
      min: [0, 'Minimum match score cannot be less than 0'],
      max: [100, 'Minimum match score cannot be more than 100'],
      default: 60
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required']
    },
    applicantCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

jobSchema.pre('validate', function() {
  if (this.salaryMin !== null && this.salaryMax !== null) {
    if (this.salaryMax < this.salaryMin) {
      this.invalidate('salaryMax', 'salaryMax cannot be lower than salaryMin');
    }
  }

  if (this.status === 'active' && this.applicationDeadline) {
    if (this.applicationDeadline <= new Date()) {
      this.invalidate('applicationDeadline', 'Active jobs must have a future application deadline');
    }
  }
});

module.exports = mongoose.model('Job', jobSchema);
