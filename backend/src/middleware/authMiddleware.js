const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, token missing' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Not authorized, token expired' });
      }
      return res.status(401).json({ error: 'Not authorized, token invalid' });
    }

    // Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({ error: 'The user belonging to this token no longer exists' });
    }

    // Check if user is active
    if (!currentUser.isActive) {
      return res.status(401).json({ error: 'This user account has been deactivated' });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    next();
  };
};
