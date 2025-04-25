const validatorMiddleware = require("../middleware/validatorMiddleware");
const mongoose = require("mongoose");
const { body } = require("express-validator");

exports.createLikeValidator = [
  body("targetType")
    .notEmpty()
    .withMessage("Target type is required")
    .isIn(["event", "post"])
    .withMessage("Target type must be either 'event' or 'post'"),
  body("targetId")
    .notEmpty()
    .withMessage("Target ID is required")
    .isMongoId()
    .withMessage("Target ID must be a valid Mongo ID")
    .custom(async (val, { req }) => {
      const targetType = req.body.targetType;
      const Model = targetType === "event" ? "Event" : "Post";
      const target = await mongoose.model(Model).findById(val);
      if (!target) {
        throw new Error(`${targetType} not found`);
      }
      return true;
    }),
  validatorMiddleware,
];