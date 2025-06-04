const express = require("express");
const router = express.Router();

const authService = require("../services/authService");
const { setAuthor } = require("../middleware/setAuthorMiddleware");
const { protect, allowedTo } = authService;

const {
  createRegistration,
  approveRegistration,
  getAllRegistrations,
  rejectRegistration,
  leaveClub
} = require("../services/registrationService");

const {
  createRegistrationValidator,
  updateRegistrationValidator,
} = require("../validators/registrationValidator");

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

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

router.patch(
  "/:id/reject",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  rejectRegistration
);

router.delete(
  "/:clubId/leave",
  protect,
  allowedTo("student", "club_responsible"),
  leaveClub
);

router.get("/", protect, allowedTo("system_responsible"), getAllRegistrations);

module.exports = router;