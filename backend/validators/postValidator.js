const { body } = require('express-validator');
const mongoose = require('mongoose');

const postValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isMongoId()
    .withMessage('Author must be a valid ObjectId')
    .custom(async (author) => {
      const user = await mongoose.model('User').findById(author);
      if (!user) {
        throw new Error('Author does not exist');
      }
      return true;
    }),
  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a string'),
  body('club')
    .optional()
    .isMongoId()
    .withMessage('Club must be a valid ObjectId')
    .custom(async (club, { req }) => {
      if (!club) return true; // Optional field
      const clubDoc = await mongoose.model('Club').findById(club);
      if (!clubDoc) {
        throw new Error('Club does not exist');
      }
      return true;
    }),
];

module.exports = postValidator;