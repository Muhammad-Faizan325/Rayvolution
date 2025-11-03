const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { idParamValidation, validate } = require('../middleware/validation.middleware');

// Get user by ID (public)
router.get('/:id', idParamValidation, validate, userController.getUserById);

// Update user profile (protected)
router.put('/:id', protect, idParamValidation, validate, userController.updateUser);

// Delete user account (protected)
router.delete('/:id', protect, idParamValidation, validate, userController.deleteUser);

// Update user stats (protected)
router.put('/:id/stats', protect, idParamValidation, validate, userController.updateUserStats);

// Add achievement (protected)
router.post('/:id/achievements', protect, idParamValidation, validate, userController.addAchievement);

// Update streak (protected)
router.post('/:id/streak', protect, idParamValidation, validate, userController.updateStreak);

module.exports = router;
