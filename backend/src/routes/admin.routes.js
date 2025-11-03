const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { idParamValidation, validate } = require('../middleware/validation.middleware');

// All routes require admin role
router.use(protect, authorize('admin'));

// Analytics
router.get('/analytics', adminController.getSystemAnalytics);

// Reports management
router.get('/reports', adminController.getAllReports);
router.put('/reports/:id/status', idParamValidation, validate, adminController.updateReportStatus);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', idParamValidation, validate, adminController.updateUserRole);

// City data management
router.put('/cities/:name', adminController.updateCityData);

// Data export
router.get('/export/:type', adminController.exportData);

module.exports = router;
