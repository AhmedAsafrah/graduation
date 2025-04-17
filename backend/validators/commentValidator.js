const { body } = require('express-validator');
const mongoose = require('mongoose');

const commentValidator = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Content must be between 1 and 500 characters'),
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
  body('post')
    .notEmpty()
    .withMessage('Post is required')
    .isMongoId()
    .withMessage('Post must be a valid ObjectId')
    .custom(async (post) => {
      const postDoc = await mongoose.model('Post').findById(post);
      if (!postDoc) {
        throw new Error('Post does not exist');
      }
      return true;
    }),
];

module.exports = commentValidator;