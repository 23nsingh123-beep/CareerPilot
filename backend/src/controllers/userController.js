const User = require('../models/User');

exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, headline, summary } = req.body;
    
    // Only update allowed fields
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (headline !== undefined) updates.headline = headline;
    if (summary !== undefined) updates.summary = summary;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image file' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      profileImage: imageUrl,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};
