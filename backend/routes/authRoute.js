const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
  verifyEmailCode,
  getMe,
  protect,
  changePassword,
  updateMe,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
} = require("../validators/authValidator");

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetPassword", verifyResetPasswordCode);
router.put("/resetPassword", resetPassword);

router.post("/verifyEmail", verifyEmailCode);

// Logged in user
router.get("/me", protect, getMe);
router.put("/changePassword", protect, changePassword);
router.put("/updateMe", protect, updateMe);

module.exports = router;
