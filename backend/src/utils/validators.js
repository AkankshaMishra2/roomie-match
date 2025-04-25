 
// src/utils/validators.js
const { body, param, query, validationResult } = require('express-validator');

/**
 * Helper to process validation results
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} Error response or continues to next middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validation rules
const authValidators = {
  // Validate user profile updates
  updateProfile: [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('displayName')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Display name must be between 2 and 50 characters'),
    body('photoURL')
      .optional()
      .isURL()
      .withMessage('Photo URL must be a valid URL'),
    body('phoneNumber')
      .optional()
      .isMobilePhone()
      .withMessage('Phone number must be valid'),
    body('bio')
      .optional()
      .isString()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    validate
  ]
};

// Quiz validation rules
const quizValidators = {
  // Validate quiz submission
  submitQuiz: [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('answers')
      .isObject()
      .withMessage('Answers must be an object')
      .notEmpty()
      .withMessage('Answers cannot be empty'),
    validate
  ]
};

// Mood validation rules
const moodValidators = {
  // Validate mood update
  updateMood: [
    param('userId').notEmpty().withMessage('User ID is required'),
    body('mood')
      .notEmpty()
      .withMessage('Mood is required')
      .isIn(['happy', 'sad', 'busy', 'relaxed', 'tired', 'productive', 'stressed', 'social'])
      .withMessage('Invalid mood value'),
    body('status')
      .optional()
      .isString()
      .isLength({ max: 100 })
      .withMessage('Status cannot exceed 100 characters'),
    validate
  ]
};

// Chat validation rules
const chatValidators = {
  // Validate sending a message
  sendMessage: [
    param('chatId').notEmpty().withMessage('Chat ID is required'),
    body('text')
      .notEmpty()
      .withMessage('Message text is required')
      .isString()
      .withMessage('Message text must be a string')
      .isLength({ max: 1000 })
      .withMessage('Message cannot exceed 1000 characters'),
    body('senderId').notEmpty().withMessage('Sender ID is required'),
    body('receiverId').notEmpty().withMessage('Receiver ID is required'),
    validate
  ],
  
  // Validate getting messages
  getMessages: [
    param('chatId').notEmpty().withMessage('Chat ID is required'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    validate
  ]
};

module.exports = {
  authValidators,
  quizValidators,
  moodValidators,
  chatValidators,
  validate
};