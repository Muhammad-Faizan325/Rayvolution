const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const { reportValidation, idParamValidation, validate } = require('../middleware/validation.middleware');

// Create report
router.post('/', protect, reportValidation, validate, reportController.createReport);

// Get user's reports
router.get('/user/:userId', protect, reportController.getUserReports);

// Get report by ID
router.get('/:id', protect, idParamValidation, validate, reportController.getReportById);

// Update report
router.put('/:id', protect, idParamValidation, validate, reportController.updateReport);

// Add comment
router.post('/:id/comments', protect, idParamValidation, validate, reportController.addComment);

// Upvote report
router.post('/:id/upvote', protect, idParamValidation, validate, reportController.upvoteReport);

// Delete report
router.delete('/:id', protect, idParamValidation, validate, reportController.deleteReport);

module.exports = router;
