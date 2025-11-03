const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

// Get user statistics
router.get('/user/:userId', statsController.getUserStats);

// Get global leaderboard
router.get('/leaderboard', statsController.getGlobalLeaderboard);

// Get city leaderboard
router.get('/leaderboard/city/:cityName', statsController.getCityLeaderboard);

// Get user rank
router.get('/rank/:userId', statsController.getUserRank);

module.exports = router;
