const { body } = require("express-validator");

const clubValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .custom(async (name) => {
      const club = await mongoose.model("Club").findOne({ name });
      if (club) {
        throw new Error("Club name already exists");
      }
      return true;
    }),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("profilePicture")
    .notEmpty()
    .withMessage("Profile picture is required")
    .isString()
    .withMessage("Profile picture must be a string"),
  body("coverPicture")
    .notEmpty()
    .withMessage("Cover picture is required")
    .isString()
    .withMessage("Cover picture must be a string"),
  body("college")
    .notEmpty()
    .withMessage("College is required")
    .isString()
    .withMessage("College must be a string"),
];

module.exports = clubValidator;
