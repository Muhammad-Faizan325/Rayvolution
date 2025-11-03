const { validationResult } = require('express-validator');

// Middleware to handle validation errors
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

// Common validation rules
const { body, param, query } = require('express-validator');

exports.signupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('city')
    .notEmpty().withMessage('City is required')
    .isIn(['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Rawalpindi', 'Hyderabad', 'Other'])
    .withMessage('Invalid city'),
  body('phone').optional().trim(),
  body('solarPanels').optional().isBoolean(),
  body('energyGoal').optional().isIn(['low', 'medium', 'high'])
];

exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.energyDataValidation = [
  body('city')
    .notEmpty().withMessage('City is required')
    .isIn(['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Rawalpindi', 'Hyderabad', 'Other'])
    .withMessage('Invalid city'),
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['usage', 'savings', 'production']).withMessage('Invalid energy type'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('source').optional().isIn(['solar', 'grid', 'hybrid', 'other']),
  body('metadata').optional().isObject()
];

exports.reportValidation = [
  body('type')
    .notEmpty().withMessage('Report type is required')
    .isIn(['outage', 'solar_usage', 'suggestion', 'issue', 'feedback']).withMessage('Invalid report type'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),
  body('city')
    .notEmpty().withMessage('City is required'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical'])
];

exports.idParamValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format')
];
