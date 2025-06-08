const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const CommentModel = require("../models/commentModel");
const mongoose = require("mongoose");

exports.createCommentValidator = [
  check("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  check("role")
    .optional() // Make role optional
    .isIn(["post", "event"])
    .withMessage("Role must be either 'post' or 'event'"),
  check("post")
    .optional()
    .isMongoId()
    .withMessage("Invalid Post ID format")
    .custom(async (val, { req }) => {
      if (req.body.role === "post") {
        const post = await mongoose.model("Post").findById(val);
        if (!post) {
          throw new Error("Post not found");
        }
      }
    }),
  check("event")
    .optional()
    .isMongoId()
    .withMessage("Invalid Event ID format")
    .custom(async (val, { req }) => {
      if (req.body.role === "event") {
        const event = await mongoose.model("Event").findById(val);
        if (!event) {
          throw new Error("Event not found");
        }
      }
    }),
  validatorMiddleware,
];

exports.getSpecificCommentValidator = [
  check("id").isMongoId().withMessage("Invalid Comment ID format"),
  validatorMiddleware,
];

exports.updateCommentValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Comment ID format")
    .custom(async (val, { req }) => {
      const comment = await CommentModel.findById(val);
      if (!comment) {
        throw new Error("Comment not found");
      }
    }),
  check("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters"),
  validatorMiddleware,
];

exports.deleteCommentValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Comment ID format")
    .custom(async (val, { req }) => {
      const comment = await CommentModel.findById(val);
      if (!comment) {
        throw new Error("Comment not found");
      }
    }),
  validatorMiddleware,
];
