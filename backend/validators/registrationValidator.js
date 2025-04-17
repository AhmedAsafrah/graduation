const { body } = require('express-validator');
const mongoose = require('mongoose');

const registrationValidator = [
  body('student')
    .notEmpty()
    .withMessage('Student is required')
    .isMongoId()
    .withMessage('Student must be a valid ObjectId')
    .custom(async (student) => {
      const user = await mongoose.model('User').findById(student);
      if (!user) {
        throw new Error('Student does not exist');
      }
      if (user.role === 'system_responsible') {
        throw new Error('System responsible cannot register');
      }
      return true;
    }),
  body('club')
    .optional()
    .isMongoId()
    .withMessage('Club must be a valid ObjectId')
    .custom(async (club, { req }) => {
      if (!club) return true;
      const clubDoc = await mongoose.model('Club').findById(club);
      if (!clubDoc) {
        throw new Error('Club does not exist');
      }
      return true;
    }),
  body('event')
    .optional()
    .isMongoId()
    .withMessage('Event must be a valid ObjectId')
    .custom(async (event, { req }) => {
      if (!event) return true;
      const eventDoc = await mongoose.model('Event').findById(event);
      if (!eventDoc) {
        throw new Error('Event does not exist');
      }
      return true;
    }),
  body('status')
    .isIn(['pending', 'approved'])
    .withMessage('Status must be either pending or approved'),
  body()
    .custom((value, { req }) => {
      if (!req.body.club && !req.body.event) {
        throw new Error('Either club or event must be provided');
      }
      return true;
    }),
];

module.exports = registrationValidator;