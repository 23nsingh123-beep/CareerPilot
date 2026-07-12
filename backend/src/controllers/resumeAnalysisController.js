const User = require('../models/User');
const geminiResumeService = require('../services/geminiResumeService');

exports.analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.resumeText) {
      return res.status(400).json({ error: 'No extracted resume text found. Please upload a valid text-based resume first.' });
    }

    // Call Gemini Service
    const analysisResult = await geminiResumeService.analyzeResume(user.resumeText);

    // Save to User Model
    user.resumeAnalysis = {
      ...analysisResult.data,
      analyzedAt: new Date(),
      model: analysisResult.model
    };

    await user.save({ validateBeforeSave: false });

    // Return the updated analysis
    res.status(200).json({
      success: true,
      analysis: user.resumeAnalysis
    });

  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to analyze resume.' });
  }
};

exports.getResumeAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.resumeAnalysis || !user.resumeAnalysis.analyzedAt) {
      return res.status(200).json({
        success: true,
        analysis: null
      });
    }

    res.status(200).json({
      success: true,
      analysis: user.resumeAnalysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analysis.' });
  }
};
