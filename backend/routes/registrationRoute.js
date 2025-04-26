const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const { setAuthor } = require("../middleware/setAuthorMiddleware");

const {
  createRegistration,
  approveRegistration,
  getAllRegistrations,
} = require("../services/registrationService");

const {
  createRegistrationValidator,
  updateRegistrationValidator,
} = require("../validators/registrationValidator");

const { protect, allowedTo } = authService;

router.post(
  "/",
  protect,
  allowedTo("student", "club_responsible"),
  setAuthor,
  createRegistrationValidator,
  createRegistration
);

router.put(
  "/:id",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  updateRegistrationValidator,
  approveRegistration
);

router.get("/", protect, allowedTo("system_responsible"), getAllRegistrations);

module.exports = router;