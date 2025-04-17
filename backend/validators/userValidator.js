const { body } = require("express-validator");
const mongoose = require("mongoose");

const userValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .withMessage("Email is invalid")
    .custom(async (email, { req }) => {
      const { role } = req.body;
      // Validate email format based on role
      if (role === "system_responsible") {
        if (!/^[a-zA-Z]+@ppu\.edu$/.test(email)) {
          throw new Error(
            "System responsible email must be in the format name@ppu.edu (e.g., ahmad@ppu.edu)"
          );
        }
      } else {
        // For student and club_responsible
        if (!/^[0-9]+@ppu\.edu\.ps$/.test(email)) {
          throw new Error(
            "Student or club responsible email must be a valid PPU student email (e.g., 222222@ppu.edu.ps)"
          );
        }
      }
      // Check for uniqueness
      const user = await mongoose.model("User").findOne({ email });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("profilePicture")
    .optional()
    .isString()
    .withMessage("Profile picture must be a string"),
  body("role")
    .isIn(["student", "club_responsible", "system_responsible"])
    .withMessage(
      "Role must be one of: student, club_responsible, system_responsible"
    ),
  body("college")
    .if(body("role").isIn(["student", "club_responsible"]))
    .notEmpty()
    .withMessage("College is required for student or club_responsible roles")
    .isString()
    .withMessage("College must be a string"),
  body("managedClub")
    .if(body("role").equals("club_responsible"))
    .notEmpty()
    .withMessage("Managed club is required for club_responsible role")
    .isMongoId()
    .withMessage("Managed club must be a valid ObjectId")
    .custom(async (managedClub) => {
      const club = await mongoose.model("Club").findById(managedClub);
      if (!club) {
        throw new Error("Managed club does not exist");
      }
      return true;
    }),
];

module.exports = userValidator;
