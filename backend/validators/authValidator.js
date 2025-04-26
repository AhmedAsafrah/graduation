const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

exports.signupValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
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

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  check("password").notEmpty().withMessage("Password is required"),

  validatorMiddleware,
];
