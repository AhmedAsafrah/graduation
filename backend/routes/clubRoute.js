const express = require("express");
const router = express.Router();

const authService = require("../services/authService");

const {
  restrictToClubManager,
} = require("../middleware/restrictResourceMiddleware");

const ClubModel = require("../models/clubModel");
const upload = require("../utils/multerConfig");

const {
  createClub,
  getAllClubs,
  getClub,
  updateClub,
  deleteClub,
  getUnregisteredClubs,
  getJoinedClubs,
  getNotJoinedClubs,
  getClubMembers,
  getPendingRequests,
} = require("../services/clubService");

const {
  createClubValidator,
  getSpecificClubValidator,
  updateClubValidator,
  deleteClubValidator,
} = require("../validators/clubValidator");

const setUploadFolder = require("../middleware/setUploadFolderMiddleware");

const { protect, allowedTo } = authService;

const registrationService = require("../services/registrationService");

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

// Create club
router.post(
  "/",
  protect,
  allowedTo("system_responsible"),
  setUploadFolder("clubs"),
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  createClubValidator,
  createClub
); /* */

router.get(
  "/:clubId/registrations",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  registrationService.getRegistrationsByClub
);

router.get(
  "/:clubId/pending-requests",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  restrictToClubManager(ClubModel, "clubId"),
  getPendingRequests
);

// Get all clubs
router.get("/", getAllClubs);

// Get all unregistered clubs for user
router.get(
  "/unregistered",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getUnregisteredClubs
);

// Get all joined clubs for user
router.get(
  "/joined",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getJoinedClubs
);

// Get all not-joined clubs for user
router.get(
  "/not-joined",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getNotJoinedClubs
);

// Get all members of a specific club (IMPORTANT: Place before /:id)
router.get(
  "/:clubId/members",
  protect,
  allowedTo("system_responsible", "club_responsible", "student"),
  getClubMembers
);

// Get specific club
router.get("/:id", getSpecificClubValidator, getClub);

// Update club
router.put(
  "/:id",
  protect,
  allowedTo("system_responsible"),
  setUploadFolder("clubs"),
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateClub
);

// Delete club
router.delete(
  "/:id",
  protect,
  allowedTo("system_responsible"),
  deleteClubValidator,
  deleteClub
);


module.exports = router;