const express = require('express');
const router = express.Router();
const sindhController = require('../controllers/sindh.controller');
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { idParamValidation, validate } = require('../middleware/validation.middleware');

// Public routes
router.get('/districts', sindhController.getAllDistricts);
router.get('/districts/:name', sindhController.getDistrictByName);
router.get('/map-data', sindhController.getMapData);
router.get('/outages', sindhController.getOutages);
router.get('/stats', sindhController.getSindhStats);

// Protected routes
router.post('/outages', protect, sindhController.reportOutage);
router.put('/outages/:id', protect, idParamValidation, validate, sindhController.updateOutage);
router.post('/outages/:id/comments', protect, idParamValidation, validate, sindhController.addOutageComment);
router.post('/outages/:id/upvote', protect, idParamValidation, validate, sindhController.upvoteOutage);

module.exports = router;
