const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
  completeSignup,
  verifyEmailCode,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
} = require("../validators/authValidator");

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetPassword", verifyResetPasswordCode);
router.put("/resetPassword", resetPassword);

router.post("/verifyEmail", verifyEmailCode);
module.exports = router;
