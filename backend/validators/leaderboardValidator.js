const { body, param } = require("express-validator");
const UserModel = require("../models/userModel");
const EventModel = require("../models/eventModel");

exports.createLeaderboardValidator = [
  body("name")
    .notEmpty()
    .withMessage("Leaderboard name is required")
    .isString()
    .withMessage("Leaderboard name must be a string")
    .trim(),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .trim(),

  body("top1")
    .optional()
    .isEmail()
    .withMessage("Top1 must be a valid email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return true;
    }),

  body("top2")
    .optional()
    .isEmail()
    .withMessage("Top2 must be a valid email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return true;
    }),

  body("top3")
    .optional()
    .isEmail()
    .withMessage("Top3 must be a valid email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return true;
    }),

  body("event")
    .optional()
    .isMongoId()
    .withMessage("Event must be a valid MongoDB ID")
    .custom(async (id) => {
      const event = await EventModel.findById(id);
      if (!event) {
        throw new Error(`Event with ID ${id} not found`);
      }
      return true;
    }),
];

exports.updateLeaderboardValidator = [
  param("id")
    .isMongoId()
    .withMessage("Leaderboard ID must be a valid MongoDB ID"),

  body("name")
    .optional()
    .isString()
    .withMessage("Leaderboard name must be a string")
    .trim(),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim(),

  body("top1")
    .optional()
    .isEmail()
    .withMessage("Top1 must be a valid email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return true;
    }),

  body("top2")
    .optional()
    .isEmail()
    .withMessage("Top2 must be a valid email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return true;
    }),

  body("top3")
    .optional()
    .isEmail()
    .withMessage("Top3 must be a valid email")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return true;
    }),

  body("event")
    .optional()
    .isMongoId()
    .withMessage("Event must be a valid MongoDB ID")
    .custom(async (id) => {
      const event = await EventModel.findById(id);
      if (!event) {
        throw new Error(`Event with ID ${id} not found`);
      }
      return true;
    }),
];

exports.getLeaderboardValidator = [
  param("id")
    .isMongoId()
    .withMessage("Leaderboard ID must be a valid MongoDB ID"),
];

exports.deleteLeaderboardValidator = [
  param("id")
    .isMongoId()
    .withMessage("Leaderboard ID must be a valid MongoDB ID"),
];