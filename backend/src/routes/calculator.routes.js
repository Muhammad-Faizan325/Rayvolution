const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculator.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');

// Protected routes
router.post('/', protect, calculatorController.calculateSolar);
router.get('/history', protect, calculatorController.getCalculationHistory);
router.get('/:id', protect, calculatorController.getCalculationById);
router.post('/recommend', protect, calculatorController.getRecommendation);

// Public routes
router.post('/compare', calculatorController.compareSetups);

module.exports = router;
