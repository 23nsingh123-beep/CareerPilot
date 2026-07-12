const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let normalizedRole = 'student';
    if (role && typeof role === 'string') {
      const parsedRole = role.toLowerCase();
      if (['student', 'recruiter'].includes(parsedRole)) {
        normalizedRole = parsedRole;
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};
