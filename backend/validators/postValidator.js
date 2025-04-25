const { check, body } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const PostModel = require("../models/postModel");
const mongoose = require("mongoose");

exports.createPostValidator = [
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters"),
  body("image").optional().isString().withMessage("Image must be a string"),
  body("club")
    .notEmpty() // Make club required since a post must belong to a club
    .withMessage("Club ID is required")
    .isMongoId()
    .withMessage("Invalid Club ID format")
    .custom(async (val, { req }) => {
      const club = await mongoose.model("Club").findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
      // If the user is club_responsible, ensure they manage this club
      if (req.user.role !== "system_responsible") {
        if (!req.user.managedClub) {
          throw new Error("You are not assigned to manage any club");
        }
        if (req.user.managedClub.toString() !== val.toString()) {
          throw new Error("You are not authorized to post for this club");
        }
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getSpecificPostValidator = [
  check("id").isMongoId().withMessage("Invalid Post ID format"),
  validatorMiddleware,
];

exports.updatePostValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Post ID format")
    .custom(async (val, { req }) => {
      const post = await PostModel.findById(val);
      if (!post) {
        throw new Error("Post not found");
      }
      // Only the author or system_responsible can update
      // if (
      //   req.user.role !== "system_responsible" &&
      //   post.author.toString() !== req.user._id.toString()
      // ) {
      //   throw new Error("You are not allowed to update this post");
      // }
      // return true;
    }),
  check("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters"),
  check("image").optional().isString().withMessage("Image must be a string"),
  check("club")
    .optional()
    .isMongoId()
    .withMessage("Invalid Club ID format")
    .custom(async (val, { req }) => {
      const club = await mongoose.model("Club").findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
      // If updating club, ensure the user is the club_responsible
      // if (req.user.role !== "system_responsible" && req.user.managedClub?.toString() !== val.toString()) {
      //   throw new Error("You are not authorized to update the post to this club");
      // }
      // return true;
    }),
  validatorMiddleware,
];

exports.deletePostValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Post ID format")
    .custom(async (val, { req }) => {
      // Check if user is authenticated
      if (!req.user) {
        throw new Error("User not authenticated");
      }

      // Check if post exists
      const post = await PostModel.findById(val);
      if (!post) {
        throw new Error("Post not found");
      }

      // Only the author or system_responsible can delete
      // if (
      //   req.user.role !== "system_responsible" &&
      //   post.author.toString() !== req.user._id.toString()
      // ) {
      //   throw new Error("You are not allowed to delete this post");
      // }

      return true;
    }),
  validatorMiddleware,
];
