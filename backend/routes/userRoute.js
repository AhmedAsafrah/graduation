const express = require("express");
const router = express.Router();

const authService = require("../services/authService");
const UserModel = require("../models/userModel");
const { protect, allowedTo } = authService;

const {
  restrictToResourceOwner,
} = require("../middleware/restrictResourceMiddleware");

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  searchStudentsAndClubs,
  toggleUserActive,
} = require("../services/userService");

const {
  createUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../validators/userValidator");
const upload = require("../utils/multerConfig");

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

router.post(
  "/",
  protect,
  allowedTo("system_responsible"),
  createUserValidator,
  createUser
);

router.put(
  "/:id/toggleActive",
  protect,
  allowedTo("system_responsible"),
  toggleUserActive
);

router.get(
  "/",
  protect,
  allowedTo("system_responsible", "club_responsible"),
  getAllUsers
);

router.get(
  "/:id",
  protect,
  restrictToResourceOwner(UserModel, "_id"),
  getSpecificUserValidator,
  getUser
);

router.put(
  "/:id",
  protect,
  allowedTo("system_responsible", "club_responsible"),
  upload.single("profilePicture"), // <-- add this
  updateUserValidator,
  updateUser
);

router.delete(
  "/:id",
  protect,
  allowedTo("system_responsible"),
  deleteUserValidator,
  deleteUser
);

router.put(
  "/:id/changePassword",
  protect,
  restrictToResourceOwner(UserModel, "_id"),
  changeUserPasswordValidator,
  changeUserPassword
);

router.post("/search", protect, searchStudentsAndClubs);

module.exports = router;
