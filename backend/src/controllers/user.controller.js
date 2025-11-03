const User = require('../models/User.model');
const { sendSuccess, sendError, sendPaginatedResponse } = require('../utils/response.utils');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, { user }, 'User retrieved successfully');
  } catch (error) {
    console.error('Get user error:', error);
    sendError(res, 'Error retrieving user', 500);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (own profile only)
exports.updateUser = async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to update this profile', 403);
    }

    const { name, phone, city, solarPanels, energyGoal } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city) user.city = city;
    if (solarPanels !== undefined) user.solarPanels = solarPanels;
    if (energyGoal) user.energyGoal = energyGoal;

    await user.save();

    sendSuccess(res, { user }, 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    sendError(res, 'Error updating user', 500);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private (own account only or admin)
exports.deleteUser = async (req, res) => {
  try {
    // Check authorization
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this account', 403);
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    sendError(res, 'Error deleting user', 500);
  }
};

// @desc    Update user stats
// @route   PUT /api/users/:id/stats
// @access  Private (own profile only)
exports.updateUserStats = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return sendError(res, 'Not authorized to update these stats', 403);
    }

    const { energySaved, co2Reduced, greenCoins, energyTokens } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Update stats (only allow adding, not subtracting)
    if (energySaved && energySaved > 0) user.stats.energySaved += energySaved;
    if (co2Reduced && co2Reduced > 0) user.stats.co2Reduced += co2Reduced;
    if (greenCoins !== undefined) user.stats.greenCoins += greenCoins; // Can be negative for purchases
    if (energyTokens !== undefined) user.stats.energyTokens += energyTokens; // Can be negative for sales

    // Recalculate sustainability score
    user.calculateSustainabilityScore();

    await user.save();

    sendSuccess(res, { stats: user.stats }, 'Stats updated successfully');
  } catch (error) {
    console.error('Update stats error:', error);
    sendError(res, 'Error updating stats', 500);
  }
};

// @desc    Add achievement to user
// @route   POST /api/users/:id/achievements
// @access  Private (own profile only)
exports.addAchievement = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return sendError(res, 'Not authorized', 403);
    }

    const { achievement } = req.body;

    if (!achievement) {
      return sendError(res, 'Achievement is required', 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Check if achievement already exists
    if (user.achievements.includes(achievement)) {
      return sendError(res, 'Achievement already earned', 400);
    }

    user.achievements.push(achievement);

    // Award GreenCoins for achievement
    user.stats.greenCoins += 50;

    await user.save();

    sendSuccess(res, { achievements: user.achievements }, 'Achievement added successfully');
  } catch (error) {
    console.error('Add achievement error:', error);
    sendError(res, 'Error adding achievement', 500);
  }
};

// @desc    Update user streak
// @route   POST /api/users/:id/streak
// @access  Private (own profile only)
exports.updateStreak = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return sendError(res, 'Not authorized', 403);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const newStreak = user.updateStreak();

    // Award GreenCoins for streak milestones
    if (newStreak % 7 === 0) {
      user.stats.greenCoins += 100; // Weekly bonus
    }
    if (newStreak % 30 === 0) {
      user.stats.greenCoins += 500; // Monthly bonus
    }

    await user.save();

    sendSuccess(res, { streak: user.stats.streak }, 'Streak updated successfully');
  } catch (error) {
    console.error('Update streak error:', error);
    sendError(res, 'Error updating streak', 500);
  }
};
