const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const resumeParserService = require('../services/resumeParserService');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file is invalid.' });
    }

    const newResumeUrl = `/uploads/resumes/${req.file.filename}`;
    
    // Attempt text extraction first
    let extractedText = '';
    try {
      extractedText = await resumeParserService.extractResumeText(req.file.path, req.file.mimetype);
    } catch (parseError) {
      // If extraction fails (including DOC format rejection or empty text), cleanup the new file immediately
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: parseError.message });
    }

    // Fetch the user to get their old resume URL
    const user = await User.findById(req.user._id);
    if (!user) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'User not found' });
    }

    const oldResumeUrl = user.resume;

    // Update user's resume and extraction metadata in DB
    user.resume = newResumeUrl;
    user.resumeText = extractedText;
    user.resumeOriginalName = req.file.originalname;
    user.resumeMimeType = req.file.mimetype;
    user.resumeUploadedAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Only delete the old file if DB update succeeds and the file exists
    if (oldResumeUrl && oldResumeUrl.startsWith('/uploads/resumes/')) {
      const oldFileName = oldResumeUrl.replace('/uploads/resumes/', '');
      const oldFilePath = path.join(__dirname, '../../uploads/resumes', oldFileName);
      
      // Ensure we only delete within the safe directory
      if (oldFilePath.includes(path.normalize('uploads/resumes'))) {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    res.status(200).json({
      success: true,
      resumeUrl: newResumeUrl,
      filename: req.file.originalname,
      textExtracted: true,
      characterCount: extractedText.length
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || 'Server error during upload' });
  }
};

exports.getCurrentResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.resume) {
      return res.status(200).json({ success: true, resume: null });
    }

    res.status(200).json({
      success: true,
      resume: {
        url: user.resume,
        filename: user.resumeOriginalName || user.resume.split('/').pop(),
        mimeType: user.resumeMimeType,
        uploadedAt: user.resumeUploadedAt,
        textExtracted: !!user.resumeText,
        characterCount: user.resumeText ? user.resumeText.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current resume' });
  }
};
