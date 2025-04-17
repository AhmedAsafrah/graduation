const { body } = require('express-validator');
const mongoose = require('mongoose');

const eventValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date (e.g., 2025-05-01T00:00:00Z)'),
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format (e.g., 09:00)'),
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format (e.g., 12:00)'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a string'),
  body('club')
    .notEmpty()
    .withMessage('Club is required')
    .isMongoId()
    .withMessage('Club must be a valid ObjectId')
    .custom(async (club) => {
      const clubDoc = await mongoose.model('Club').findById(club);
      if (!clubDoc) {
        throw new Error('Club does not exist');
      }
      return true;
    }),
];

module.exports = eventValidator;