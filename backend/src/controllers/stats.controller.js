const User = require('../models/User.model');
const { sendSuccess, sendError } = require('../utils/response.utils');

// @desc    Get user statistics
// @route   GET /api/stats/user/:userId
// @access  Public
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, { stats: user.stats, achievements: user.achievements }, 'User stats retrieved successfully');
  } catch (error) {
    console.error('Get user stats error:', error);
    sendError(res, 'Error retrieving user stats', 500);
  }
};

// @desc    Get global leaderboard
// @route   GET /api/stats/leaderboard
// @access  Public
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const { sortBy = 'sustainabilityScore', limit = 50 } = req.query;

    const validSortFields = ['sustainabilityScore', 'energySaved', 'co2Reduced', 'greenCoins', 'streak'];
    const sortField = validSortFields.includes(sortBy) ? `stats.${sortBy}` : 'stats.sustainabilityScore';

    const leaderboard = await User.find()
      .select('name city stats achievements createdAt')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      city: user.city,
      stats: user.stats,
      achievementCount: user.achievements.length
    }));

    sendSuccess(res, { leaderboard: formattedLeaderboard }, 'Leaderboard retrieved successfully');
  } catch (error) {
    console.error('Get leaderboard error:', error);
    sendError(res, 'Error retrieving leaderboard', 500);
  }
};

// @desc    Get city leaderboard
// @route   GET /api/stats/leaderboard/city/:cityName
// @access  Public
exports.getCityLeaderboard = async (req, res) => {
  try {
    const { cityName } = req.params;
    const { sortBy = 'sustainabilityScore', limit = 50 } = req.query;

    const validSortFields = ['sustainabilityScore', 'energySaved', 'co2Reduced', 'greenCoins', 'streak'];
    const sortField = validSortFields.includes(sortBy) ? `stats.${sortBy}` : 'stats.sustainabilityScore';

    const leaderboard = await User.find({ city: cityName })
      .select('name stats achievements createdAt')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: user.name,
      stats: user.stats,
      achievementCount: user.achievements.length
    }));

    sendSuccess(res, { city: cityName, leaderboard: formattedLeaderboard }, 'City leaderboard retrieved successfully');
  } catch (error) {
    console.error('Get city leaderboard error:', error);
    sendError(res, 'Error retrieving city leaderboard', 500);
  }
};

// @desc    Get user rank
// @route   GET /api/stats/rank/:userId
// @access  Public
exports.getUserRank = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Get global rank
    const globalRank = await User.countDocuments({
      'stats.sustainabilityScore': { $gt: user.stats.sustainabilityScore }
    }) + 1;

    // Get city rank
    const cityRank = await User.countDocuments({
      city: user.city,
      'stats.sustainabilityScore': { $gt: user.stats.sustainabilityScore }
    }) + 1;

    sendSuccess(res, {
      globalRank,
      cityRank,
      sustainabilityScore: user.stats.sustainabilityScore
    }, 'User rank retrieved successfully');
  } catch (error) {
    console.error('Get user rank error:', error);
    sendError(res, 'Error retrieving user rank', 500);
  }
};
