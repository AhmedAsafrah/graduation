const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const ClubModel = require("../models/clubModel");
const { default: mongoose } = require("mongoose");

exports.createClubValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .custom(async (val) => {
      const club = await ClubModel.findOne({ name: val });
      if (club) {
        throw new Error("Club name already exists");
      }
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  // check("profilePicture")
  //   .notEmpty()
  //   .withMessage("Profile picture is required")
  //   .isString()
  //   .withMessage("Profile picture must be a string"),
  // check("coverPicture")
  //   .notEmpty()
  //   .withMessage("Cover picture is required")
  //   .isString()
  //   .withMessage("Cover picture must be a string"),
  check("college")
    .notEmpty()
    .withMessage("College is required")
    .isString()
    .withMessage("College must be a string"),
  validatorMiddleware,
];

exports.getSpecificClubValidator = [
  check("id").isMongoId().withMessage("Invalid Club ID format"),
  validatorMiddleware,
];

exports.updateClubValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Club ID format")
    .custom(async (val, { req }) => {
      const club = await ClubModel.findById(val);
      if (!club) {
        throw new Error("Club not found");
      }
      // Only system_responsible or club_responsible of this club can update
      // if (
      //   req.user.role !== "system_responsible" &&
      //   req.user.managedClub?.toString() !== val.toString()
      // ) {
      //   throw new Error("You are not allowed to update this club");
      // }
      // return true;
    }),
  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .custom(async (val, { req }) => {
      const club = await ClubModel.findOne({
        name: val,
        _id: { $ne: req.params.id },
      });
      if (club) {
        throw new Error("Club name already exists");
      }
      return true;
    }),
  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  check("profilePicture")
    .optional()
    .isString()
    .withMessage("Profile picture must be a string"),
  check("coverPicture")
    .optional()
    .isString()
    .withMessage("Cover picture must be a string"),
  check("college")
    .optional()
    .isString()
    .withMessage("College must be a string"),
  validatorMiddleware,
];

exports.deleteClubValidator = [
  check("id").isMongoId().withMessage("Invalid Club ID format"),
  // .custom(async (val, { req }) => {
  //   const club = await ClubModel.findById(val);
  //   if (!club) {
  //     throw new Error("Club not found");
  //   }
  //   // Only system_responsible or club_responsible of this club can delete
  //   if (
  //     req.user.role !== "system_responsible" &&
  //     req.user.managedClub?.toString() !== val.toString()
  //   ) {
  //     throw new Error("You are not allowed to delete this club");
  //   }
  //   return true;
  // }),
  validatorMiddleware,
];

exports.getPostsByClubValidator = [
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