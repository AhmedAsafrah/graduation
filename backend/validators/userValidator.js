const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  check("email")
    .notEmpty()
    .withMessage("Email is requirz`ed")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val, { req }) => {
      const user = await UserModel.findOne({ email: val });
      if (user) {
        throw new Error("Email already exists");
      }
      const role = req.body.role || "student";
      if (role === "student" || role === "club_responsible") {
        if (!/^[0-9]+@ppu\.edu\.ps$/.test(val)) {
          throw new Error(
            "Email must be a numeric ID followed by @ppu.edu.ps for student or club_responsible"
          );
        }
      } else if (role === "system_responsible") {
        if (!/^[a-zA-Z]+@ppu\.edu$/.test(val)) {
          throw new Error(
            "Email must be alphabetic followed by @ppu.edu for system_responsible"
          );
        }
      } else {
        throw new Error("Invalid role");
      }
      return true;
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters long")
    .custom((password, { req }) => {
      if (!password || password.trim().length === 0) {
        throw new Error("Password cannot be just whitespace");
      }
      if (!req.body.passwordConfirm) {
        throw new Error("Password Confirmation is required");
      }
      if (password !== req.body.passwordConfirm) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage("Password Confirmation is required"),
  check("profilePicture")
    .optional()
    .isString()
    .withMessage("Profile picture must be a string"),
  check("role")
    .optional()
    .isIn(["student", "club_responsible", "system_responsible"])
    .withMessage(
      "Role must be student, club_responsible, or system_responsible"
    ),
  check("college").custom(async (val, { req }) => {
    const role = req.body.role || "student";
    if (role === "student" || role === "club_responsible") {
      if (!val) {
        throw new Error("College is required for student or club_responsible");
      }
      if (typeof val !== "string") {
        throw new Error("College must be a string");
      }
    }
    return true;
  }),
  check("managedClub").custom(async (val, { req }) => {
    const role = req.body.role || "student";
    if (role === "club_responsible") {
      if (!val) {
        throw new Error("Managed club is required for club_responsible");
      }
      if (!mongoose.isValidObjectId(val)) {
        throw new Error("Invalid Club ID format");
      }
      const club = await mongoose.model("Club").findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
    }
    return true;
  }),
  validatorMiddleware,
];

exports.getSpecificUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User ID format")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);
      if (!user) {
        throw new Error("User not found");
      }
      // Only system_responsible or the user themselves can update
      // if (req.user.role !== "system_responsible" && user._id.toString() !== req.user._id.toString()) {
      //   throw new Error("You are not allowed to update this user");
      // }
      // return true;
    }),
  check("name").optional().isString().withMessage("Name must be a string"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val, { req }) => {
      const existingUser = await UserModel.findOne({
        email: val,
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        throw new Error("Email already exists");
      }
      const user = await UserModel.findById(req.params.id);
      const role = req.body.role || user.role;
      if (role === "student" || role === "club_responsible") {
        if (!/^[0-9]+@ppu\.edu\.ps$/.test(val)) {
          throw new Error(
            "Email must be a numeric ID followed by @ppu.edu.ps for student or club_responsible"
          );
        }
      } else if (role === "system_responsible") {
        if (!/^[a-zA-Z]+@ppu\.edu$/.test(val)) {
          throw new Error(
            "Email must be alphabetic followed by @ppu.edu for system_responsible"
          );
        }
      }
      return true;
    }),
  // check("password")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Password is required")
  //   .isLength({ min: 8, max: 128 })
  //   .withMessage("Password must be between 8 and 128 characters long")
  //   .custom((password, { req }) => {
  //     if (!password || password.trim().length === 0) {
  //       throw new Error("Password cannot be just whitespace");
  //     }
  //     if (!req.body.passwordConfirm) {
  //       throw new Error("Password Confirmation is required");
  //     }
  //     if (password !== req.body.passwordConfirm) {
  //       throw new Error("Passwords don't match");
  //     }
  //     return true;
  //   }),

  // check("passwordConfirm")
  //   .trim()
  //   .notEmpty()
  //   .withMessage("Password Confirmation is required"),

  check("profilePicture")
    .optional()
    .isString()
    .withMessage("Profile picture must be a string"),
  check("role")
    .optional()
    .isIn(["student", "club_responsible", "system_responsible"])
    .withMessage(
      "Role must be student, club_responsible, or system_responsible"
    ),
  check("college")
    .optional()
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(req.params.id);
      const role = req.body.role || user.role;
      if (role === "student" || role === "club_responsible") {
        if (!val) {
          throw new Error(
            "College is required for student or club_responsible"
          );
        }
        if (typeof val !== "string") {
          throw new Error("College must be a string");
        }
      }
      return true;
    }),
  check("managedClub")
    .optional()
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(req.params.id);
      const role = req.body.role || user.role;
      if (role === "club_responsible") {
        if (!val) {
          throw new Error("Managed club is required for club_responsible");
        }
        if (!mongoose.isValidObjectId(val)) {
          throw new Error("Invalid Club ID format");
        }
        const club = await mongoose.model("Club").findById(val);
        if (!club) {
          throw new Error("Club not found");
        }
      }
      return true;
    }),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User ID format")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);
      if (!user) {
        throw new Error("User not found");
      }
      return true;
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("New password must be between 8 and 128 characters long")
    .custom((password, { req }) => {
      if (!password || password.trim().length === 0) {
        throw new Error("New password cannot be just whitespace");
      }
      if (!req.body.passwordConfirm) {
        throw new Error("Password confirmation is required");
      }
      if (password !== req.body.passwordConfirm) {
        throw new Error("New passwords don't match");
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation is required"),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User ID format")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);
      if (!user) {
        throw new Error("User not found");
      }
      // Only system_responsible or the user themselves can delete
      // if (req.user.role !== "system_responsible" && user._id.toString() !== req.user._id.toString()) {
      //   throw new Error("You are not allowed to delete this user");
      // }
      // return true;
    }),
  validatorMiddleware,
];
