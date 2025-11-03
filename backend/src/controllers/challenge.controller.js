const { Challenge, UserChallenge } = require('../models/Challenge.model');
const User = require('../models/User.model');
const { sendSuccess, sendError, sendPaginatedResponse } = require('../utils/response.utils');

// @desc    Get all active challenges
// @route   GET /api/challenges
// @access  Public
exports.getAllChallenges = async (req, res) => {
  try {
    const { type, category, difficulty } = req.query;

    const query = { isActive: true, endDate: { $gte: new Date() } };
    if (type) query.type = type;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const challenges = await Challenge.find(query).sort({ startDate: -1 });

    sendSuccess(res, { challenges }, 'Challenges retrieved successfully');
  } catch (error) {
    console.error('Get challenges error:', error);
    sendError(res, 'Error retrieving challenges', 500);
  }
};

// @desc    Get challenge by ID
// @route   GET /api/challenges/:id
// @access  Public
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return sendError(res, 'Challenge not found', 404);
    }

    sendSuccess(res, { challenge }, 'Challenge retrieved successfully');
  } catch (error) {
    console.error('Get challenge error:', error);
    sendError(res, 'Error retrieving challenge', 500);
  }
};

// @desc    Get user's challenges
// @route   GET /api/challenges/user/:userId
// @access  Private
exports.getUserChallenges = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const query = { userId };
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }

    const userChallenges = await UserChallenge.find(query)
      .populate('challengeId')
      .sort({ startedAt: -1 });

    sendSuccess(res, { challenges: userChallenges }, 'User challenges retrieved successfully');
  } catch (error) {
    console.error('Get user challenges error:', error);
    sendError(res, 'Error retrieving user challenges', 500);
  }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return sendError(res, 'Challenge not found', 404);
    }

    if (!challenge.isActive || challenge.endDate < new Date()) {
      return sendError(res, 'Challenge is not active', 400);
    }

    // Check if user already joined
    const existingUserChallenge = await UserChallenge.findOne({
      userId: req.user._id,
      challengeId: challenge._id
    });

    if (existingUserChallenge) {
      return sendError(res, 'Already joined this challenge', 400);
    }

    // Create user challenge
    const userChallenge = await UserChallenge.create({
      userId: req.user._id,
      challengeId: challenge._id
    });

    // Add user to participants
    if (!challenge.participants.includes(req.user._id)) {
      challenge.participants.push(req.user._id);
      await challenge.save();
    }

    sendSuccess(res, { userChallenge }, 'Joined challenge successfully', 201);
  } catch (error) {
    console.error('Join challenge error:', error);
    sendError(res, 'Error joining challenge', 500);
  }
};

// @desc    Update challenge progress
// @route   PUT /api/challenges/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress === undefined || progress < 0) {
      return sendError(res, 'Valid progress value is required', 400);
    }

    const userChallenge = await UserChallenge.findOne({
      userId: req.user._id,
      challengeId: req.params.id
    }).populate('challengeId');

    if (!userChallenge) {
      return sendError(res, 'You have not joined this challenge', 404);
    }

    if (userChallenge.completed) {
      return sendError(res, 'Challenge already completed', 400);
    }

    // Update progress
    userChallenge.progress = Math.min(progress, userChallenge.challengeId.target);

    // Check if challenge is completed
    if (userChallenge.progress >= userChallenge.challengeId.target) {
      userChallenge.completed = true;
      userChallenge.completedAt = new Date();

      // Award rewards
      const user = await User.findById(req.user._id);
      if (userChallenge.challengeId.reward.greenCoins) {
        user.stats.greenCoins += userChallenge.challengeId.reward.greenCoins;
      }
      if (userChallenge.challengeId.reward.energyTokens) {
        user.stats.energyTokens += userChallenge.challengeId.reward.energyTokens;
      }
      if (userChallenge.challengeId.reward.achievement) {
        if (!user.achievements.includes(userChallenge.challengeId.reward.achievement)) {
          user.achievements.push(userChallenge.challengeId.reward.achievement);
        }
      }
      await user.save();
    }

    await userChallenge.save();

    sendSuccess(res, { userChallenge }, 'Progress updated successfully');
  } catch (error) {
    console.error('Update progress error:', error);
    sendError(res, 'Error updating progress', 500);
  }
};

// @desc    Create new challenge (admin only)
// @route   POST /api/challenges
// @access  Private/Admin
exports.createChallenge = async (req, res) => {
  try {
    const challengeData = req.body;

    const challenge = await Challenge.create(challengeData);

    sendSuccess(res, { challenge }, 'Challenge created successfully', 201);
  } catch (error) {
    console.error('Create challenge error:', error);
    sendError(res, 'Error creating challenge', 500);
  }
};

// @desc    Update challenge (admin only)
// @route   PUT /api/challenges/:id
// @access  Private/Admin
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return sendError(res, 'Challenge not found', 404);
    }

    sendSuccess(res, { challenge }, 'Challenge updated successfully');
  } catch (error) {
    console.error('Update challenge error:', error);
    sendError(res, 'Error updating challenge', 500);
  }
};

// @desc    Delete challenge (admin only)
// @route   DELETE /api/challenges/:id
// @access  Private/Admin
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return sendError(res, 'Challenge not found', 404);
    }

    // Delete all user challenges associated with this challenge
    await UserChallenge.deleteMany({ challengeId: req.params.id });

    sendSuccess(res, null, 'Challenge deleted successfully');
  } catch (error) {
    console.error('Delete challenge error:', error);
    sendError(res, 'Error deleting challenge', 500);
  }
};
