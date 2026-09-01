const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc    Register a new user (or admin)
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password) {
      res.status(400);
      throw new Error('Please add name, email, mobile and password');
    }

    // Check if user exists by email or mobile
    const userExists = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (userExists) {
      res.status(400);
      throw new Error('User with this email or mobile number already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: role || 'user' // Default to user if not specified
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate a user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      res.status(400);
      throw new Error('Please provide mobile and password');
    }

    // Check for user
    const user = await User.findOne({ mobile }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // Check if user is blocked
    if (user.isBlocked) {
      res.status(403);
      throw new Error('Your account is blocked. Please contact support.');
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile,
        role: req.user.role,
        createdAt: req.user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      res.status(401);
      throw new Error('Incorrect current password');
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '30d'
  });
};
