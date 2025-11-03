const express = require('express');
const router = express.Router();
const advisorController = require('../controllers/advisor.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

// Public routes (but can be personalized if authenticated)
router.post('/', optionalAuth, advisorController.getAdvice);
router.get('/tips', advisorController.getQuickTips);
router.get('/starters', advisorController.getConversationStarters);

module.exports = router;
