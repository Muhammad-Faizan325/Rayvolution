const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

// Public routes
router.get('/cities', weatherController.getSupportedCities);
router.get('/:city', weatherController.getWeatherForecast);
router.get('/:city/sunlight', weatherController.getSunlightPrediction);

module.exports = router;
