const { body } = require("express-validator");
const mongoose = require("mongoose");

const likeValidator = [
  body("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("User must be a valid ObjectId")
    .custom(async (user) => {
      const userDoc = await mongoose.model("User").findById(user);
      if (!userDoc) {
        throw new Error("User does not exist");
      }
      return true;
    }),
  body("targetType")
    .isIn(["event", "post"])
    .withMessage("Target type must be either event or post"),
  body("targetId")
    .notEmpty()
    .withMessage("Target ID is required")
    .isMongoId()
    .withMessage("Target ID must be a valid ObjectId")
    .custom(async (targetId, { req }) => {
      const { targetType } = req.body;
      const Model =
        targetType === "event"
          ? mongoose.model("Event")
          : mongoose.model("Post");
      const doc = await Model.findById(targetId);
      if (!doc) {
        throw new Error(`${targetType} does not exist`);
      }
      return true;
    }),
];

module.exports = likeValidator;
