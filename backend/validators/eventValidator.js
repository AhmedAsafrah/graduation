const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const EventModel = require("../models/eventModel");
const mongoose = require("mongoose");

exports.createEventValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  check("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  check("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isString()
    .withMessage("Start time must be a string")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  check("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isString()
    .withMessage("End time must be a string")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  check("location")
    .notEmpty()
    .withMessage("Location is required")
    .isString()
    .withMessage("Location must be a string"),
  check("image")
    .optional()
    .isString()
    .withMessage("Image must be a string"),
  check("club")
    .notEmpty()
    .withMessage("Club ID is required")
    .isMongoId()
    .withMessage("Invalid Club ID format")
    .custom(async (val, { req }) => {
      const club = await mongoose.model("Club").findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
    }),
  validatorMiddleware,
];

exports.getSpecificEventValidator = [
  check("id").isMongoId().withMessage("Invalid Event ID format"),
  validatorMiddleware,
];

exports.updateEventValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Event ID format")
    .custom(async (val, { req }) => {
      const event = await EventModel.findById(val);
      if (!event) {
        throw new Error("Event not found");
      }
    }),
  check("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  check("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  check("startTime")
    .optional()
    .isString()
    .withMessage("Start time must be a string")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  check("endTime")
    .optional()
    .isString()
    .withMessage("End time must be a string")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  check("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),
  check("image")
    .optional()
    .isString()
    .withMessage("Image must be a string"),
  check("club")
    .optional()
    .isMongoId()
    .withMessage("Invalid Club ID format")
    .custom(async (val, { req }) => {
      const club = await mongoose.model("Club").findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
    }),
  validatorMiddleware,
];

exports.deleteEventValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Event ID format")
    .custom(async (val, { req }) => {
      const event = await EventModel.findById(val);
      if (!event) {
        throw new Error("Event not found");
      }
    }),
  validatorMiddleware,
];

exports.getEventsByClubValidator = [
  check("clubId")
    .isMongoId()
    .withMessage("Invalid Club ID format")
    .custom(async (val) => {
      const club = await mongoose.model("Club").findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
      return true;
    }),
  validatorMiddleware,
];