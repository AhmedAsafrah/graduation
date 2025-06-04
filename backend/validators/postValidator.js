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
  body("club").custom(async (val, { req }) => {
    // If system_responsible, club is optional
    if (req.user.role === "system_responsible") {
      if (!val) return true; // allow missing club
      // If provided, validate it
      if (!mongoose.Types.ObjectId.isValid(val)) {
        throw new Error("Invalid Club ID format");
      }
      const club = await mongoose.model("Club").findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
      return true;
    }
    // For club_responsible, club is required and must match managedClub
    if (!val) {
      throw new Error("Club ID is required for club_responsible");
    }
    if (!mongoose.Types.ObjectId.isValid(val)) {
      throw new Error("Invalid Club ID format");
    }
    const club = await mongoose.model("Club").findById(val);
    if (!club) {
      throw new Error("Club not found");
    }
    if (!req.user.managedClub) {
      throw new Error("You are not assigned to manage any club");
    }
    if (req.user.managedClub.toString() !== val.toString()) {
      throw new Error("You are not authorized to post for this club");
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
