const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const {
  restrictToResourceOwner,
} = require("../middleware/restrictResourceMiddleware");
const UserModel = require("../models/userModel");

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} = require("../services/userService");

const {
  createUserValidator,
  getSpecificUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../validators/userValidator");

const { protect, allowedTo } = authService;

router.post(
  "/",
  protect,
  allowedTo("system_responsible"),
  createUserValidator,
  createUser
);

router.get("/", protect, allowedTo("system_responsible"), getAllUsers);

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
  restrictToResourceOwner(UserModel, "_id"),
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

module.exports = router;
