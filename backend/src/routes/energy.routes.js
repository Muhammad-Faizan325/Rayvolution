const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energy.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { energyDataValidation, validate } = require('../middleware/validation.middleware');

// Record energy data (protected)
router.post('/', protect, energyDataValidation, validate, energyController.recordEnergy);

// Get user energy history (protected)
router.get('/user/:userId', protect, energyController.getUserEnergyHistory);

// Get all cities (public)
router.get('/cities', energyController.getAllCities);

// Get specific city (public)
router.get('/cities/:name', energyController.getCityByName);

// Get national statistics (public)
router.get('/national', energyController.getNationalStats);

// Get energy trends (public)
router.get('/trends', energyController.getEnergyTrends);

module.exports = router;
