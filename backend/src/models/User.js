const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin'],
      default: 'student'
    },
    profileImage: {
      type: String,
      default: ''
    },
    resume: {
      type: String,
      default: ''
    },
    resumeText: {
      type: String,
      default: ''
    },
    resumeOriginalName: {
      type: String,
      default: ''
    },
    resumeMimeType: {
      type: String,
      default: ''
    },
    resumeUploadedAt: {
      type: Date,
      default: null
    },
    resumeAnalysis: {
      overallScore: { type: Number, default: 0 },
      atsScore: { type: Number, default: 0 },
      summary: { type: String, default: '' },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      recommendations: { type: [String], default: [] },
      recommendedRoles: { type: [String], default: [] },
      sectionScores: {
        summary: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        skills: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
        certifications: { type: Number, default: 0 }
      },
      analyzedAt: { type: Date, default: null },
      model: { type: String, default: '' }
    },
    phone: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    headline: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Return safe object without password
userSchema.methods.toSafeObject = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
