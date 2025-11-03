const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { idParamValidation, validate } = require('../middleware/validation.middleware');

// Public routes
router.get('/', challengeController.getAllChallenges);
router.get('/:id', idParamValidation, validate, challengeController.getChallengeById);

// Protected routes
router.get('/user/:userId', protect, challengeController.getUserChallenges);
router.post('/:id/join', protect, idParamValidation, validate, challengeController.joinChallenge);
router.put('/:id/progress', protect, idParamValidation, validate, challengeController.updateProgress);

// Admin routes
router.post('/', protect, authorize('admin'), challengeController.createChallenge);
router.put('/:id', protect, authorize('admin'), idParamValidation, validate, challengeController.updateChallenge);
router.delete('/:id', protect, authorize('admin'), idParamValidation, validate, challengeController.deleteChallenge);

module.exports = router;
