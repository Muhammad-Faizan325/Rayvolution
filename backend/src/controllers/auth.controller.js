const User = require('../models/User.model');
const { generateAccessToken, generateRefreshToken, setTokenCookie, clearTokenCookie } = require('../utils/jwt.utils');
const { sendSuccess, sendError } = require('../utils/response.utils');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, city, solarPanels, energyGoal } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      city,
      solarPanels: solarPanels || false,
      energyGoal: energyGoal || 'medium'
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Set token cookie
    setTokenCookie(res, accessToken);

    // Remove sensitive data
    const userData = user.toJSON();

    sendSuccess(res, {
      user: userData,
      accessToken,
      refreshToken
    }, 'User registered successfully', 201);
  } catch (error) {
    console.error('Signup error:', error);
    sendError(res, error.message || 'Error registering user', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Update streak
    user.updateStreak();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set token cookie
    setTokenCookie(res, accessToken);

    // Remove sensitive data
    const userData = user.toJSON();

    sendSuccess(res, {
      user: userData,
      accessToken,
      refreshToken
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, error.message || 'Error logging in', 500);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Clear refresh token from database
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    // Clear token cookie
    clearTokenCookie(res);

    sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 'Error logging out', 500);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 'Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user with this refresh token
    const user = await User.findOne({ _id: decoded.id, refreshToken }).select('+refreshToken');
    if (!user) {
      return sendError(res, 'Invalid refresh token', 401);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set token cookie
    setTokenCookie(res, newAccessToken);

    sendSuccess(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }, 'Token refreshed successfully');
  } catch (error) {
    console.error('Refresh token error:', error);
    sendError(res, 'Invalid or expired refresh token', 401);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, { user }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get me error:', error);
    sendError(res, 'Error retrieving user', 500);
  }
};
