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
} = require("../services/clubService");

const {
  createClubValidator,
  getSpecificClubValidator,
  updateClubValidator,
  deleteClubValidator,
} = require("../validators/clubValidator");

const setUploadFolder = require("../middleware/setUploadFolderMiddleware");

const { protect, allowedTo } = authService;

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////
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
);

router.get("/", getAllClubs);

router.get(
  "/unregistered",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getUnregisteredClubs
);

router.get(
  "/joined",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getJoinedClubs
);

router.get(
  "/not-joined",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getNotJoinedClubs
);

router.get("/:id", getSpecificClubValidator, getClub);

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

router.delete(
  "/:id",
  protect,
  allowedTo("system_responsible"),
  deleteClubValidator,
  deleteClub
);

module.exports = router;
