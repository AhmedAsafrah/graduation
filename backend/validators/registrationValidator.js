const validatorMiddleware = require("../middleware/validatorMiddleware");
const mongoose = require("mongoose");
const { body, param } = require("express-validator");

exports.createRegistrationValidator = [
  body("club")
    .notEmpty()
    .withMessage("Club is required")
    .isMongoId()
    .withMessage("Club ID must be a valid Mongo ID")
    .custom(async (val) => {
      try {
        const club = await mongoose.model("Club").findById(val);
        if (!club) {
          throw new Error("Club not found");
        }
        return true;
      } catch (error) {
        console.error("Error in club validation:", error);
        throw new Error("Error validating club");
      }
    }),
  // Validate that a club_responsible user has a valid managedClub
  body().custom(async (val, { req }) => {
    if (req.user.role === "club_responsible") {
      if (!req.user.managedClub) {
        throw new Error("Club responsible user must have a managed club assigned");
      }
      try {
        const managedClub = await mongoose.model("Club").findById(req.user.managedClub);
        if (!managedClub) {
          throw new Error("The club you manage does not exist");
        }
      } catch (error) {
        console.error("Error validating managedClub:", error);
        throw new Error("Error validating managed club");
      }
    }
    return true;
  }),
  validatorMiddleware,
];

exports.updateRegistrationValidator = [
  param("id")
    .isMongoId()
    .withMessage("Registration ID must be a valid Mongo ID"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "approved"])
    .withMessage("Status must be either 'pending' or 'approved'"),
  // Validate that a club_responsible user has a valid managedClub
  body().custom(async (val, { req }) => {
    if (req.user.role === "club_responsible") {
      if (!req.user.managedClub) {
        throw new Error("Club responsible user must have a managed club assigned");
      }
      try {
        const managedClub = await mongoose.model("Club").findById(req.user.managedClub);
        if (!managedClub) {
          throw new Error("The club you manage does not exist");
        }
      } catch (error) {
        console.error("Error validating managedClub:", error);
        throw new Error("Error validating managed club");
      }
    }
    return true;
  }),
  validatorMiddleware,
];