const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const UserModel = require("../models/userModel");
const { signToken } = require("../utils/createToken");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Signup controller (unchanged)
exports.signup = asyncHandler(async (req, res, next) => {
  // 1) Check if a user with this email already exists
  const existingUser = await UserModel.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new AppError("A user with this email already exists", 400));
  }

  // 2) Create a temporary user document (not fully signed up yet)
  const tempUser = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "student",
    college: req.body.college,
    managedClub: req.body.managedClub,
    profilePicture: req.body.profilePicture || "default.jpg",
    emailVerified: false,
  });

  // 3) Generate a 6-digit verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(verificationCode)
    .digest("hex");

  tempUser.emailVerificationCode = hashedVerificationCode;
  tempUser.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await tempUser.save();

  // 4) Send the verification code via email
  const message = `Hi ${tempUser.name},\n 
      Thank you for signing up with Club Hub PPU! Your email verification code is: ${verificationCode}. \n
      Please use this code to verify your email and complete your signup.\n
      If you didn’t request this, please ignore this email.`;

  try {
    await sendEmail({
      email: tempUser.email,
      subject: "Email Verification Code -- valid for 10 minutes",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "A verification code has been sent to your email.",
    });
  } catch (error) {
    // If email sending fails, delete the temporary user
    await UserModel.deleteOne({ _id: tempUser._id });
    return next(
      new AppError(
        "There was an error sending the verification email. Try again later.",
        500
      )
    );
  }
});

// Updated verifyEmailCode controller to complete signup
exports.verifyEmailCode = asyncHandler(async (req, res, next) => {
  // 1) Hash the provided verification code
  const hashedVerificationCode = crypto
    .createHash("sha256")
    .update(req.body.verificationCode)
    .digest("hex");

  // 2) Find the user with the matching code and non-expired verification
  const user = await UserModel.findOne({
    email: req.body.email,
    emailVerificationCode: hashedVerificationCode,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification code", 400));
  }

  // 3) Mark the email as verified and complete signup
  user.emailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // 4) Generate JWT token and send response
  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    message: "Email verified and signup completed!",
    data: {
      user,
    },
    token,
  });
});

// Login controller (unchanged)
exports.login = asyncHandler(async (req, res, next) => {
  // 1) Check if user exists and password is correct
  const user = await UserModel.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 2) Check if email is verified
  if (!user.emailVerified) {
    return next(
      new AppError("Please verify your email before logging in.", 403)
    );
  }

  // 3) Verify password
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 4) Generate JWT token
  const token = signToken(user._id);

  // 5) Send response
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});

// Modified login controller to require email verification
exports.login = asyncHandler(async (req, res, next) => {
  // 1) Check if user exists and password is correct
  const user = await UserModel.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 2) Check if email is verified
  if (!user.emailVerified) {
    return next(
      new AppError("Please verify your email before logging in.", 403)
    );
  }

  // 3) Verify password
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 4) Generate JWT token
  const token = signToken(user._id);

  // 5) Send response
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verify token (not expired, not modified)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //   console.log(decoded);

  // 3) check if user still exists
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // Password changed after token was created
  if (currentUser.passwordChangedAt) {
    const passChangeTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    // Password changed after token was created
    if (decoded.iat < passChangeTimestamp) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// allow to specific roles only to access the route
// (...roles) will get the roles as an array ["admin", "user"] ...
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user using the protect middleware (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not allowed to perform this action", 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Check if the user is logged in (optional token in Authorization header)
  let loggedInUser;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      loggedInUser = await UserModel.findById(decoded.id);
    } catch (err) {
      // Invalid token, proceed as if not logged in
    }
  }

  // 2) If logged in, restrict to their own email
  if (loggedInUser) {
    if (loggedInUser.email !== req.body.email) {
      return next(
        new AppError(
          "You can only request a password reset for your own email.",
          403
        )
      );
    }
  }

  // 3) Find the user by email
  const user = await UserModel.findOne({ email: req.body.email });

  // 4) Generic response to prevent email enumeration
  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "If the email exists, a reset code has been sent.",
    });
  }

  // 5) Rate limiting: Check if a reset was requested recently
  const cooldownPeriod = 1 * 60 * 1000; // 1 minute (changed for testing)
  if (user.lastPasswordResetRequest) {
    const timeSinceLastRequest = Date.now() - user.lastPasswordResetRequest;
    if (timeSinceLastRequest < cooldownPeriod) {
      return next(
        new AppError(
          "A reset code was recently requested. Please wait before trying again.",
          429
        )
      );
    }
  }

  // 6) Generate and save reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.lastPasswordResetRequest = Date.now();
  await user.save();

  console.log("🔍 Reset code generated:", resetCode);

  // 7) Send the email
  const message = `Hi ${user.name},\n 
        We received a request to reset your password. Your reset code is: ${resetCode}. \n
        Please use this code to reset your password.\n
        If you didn't request a password reset, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset code -- valid for 10 minutes",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "If the email exists, a reset code has been sent.",
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;
    user.lastPasswordResetRequest = undefined;
    await user.save();
    return next(
      new AppError(
        "There was an error while sending the email. Try again later.",
        500
      )
    );
  }
});

exports.verifyResetPasswordCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired reset code", 400));
  }

  user.passwordResetVerified = true;
  user.lastPasswordResetRequest = undefined; // Clear the rate limit
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Reset code verified!",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Check if the user is logged in (optional token in Authorization header)
  let loggedInUser;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      loggedInUser = await UserModel.findById(decoded.id);
    } catch (err) {
      // Invalid token, proceed as if not logged in
    }
  }

  // 2) If logged in, restrict to their own email
  if (loggedInUser) {
    if (loggedInUser.email !== req.body.email) {
      return next(
        new AppError("You can only reset the password for your own email.", 403)
      );
    }
  }

  // 3) Get user based on the email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user with this email ${req.body.email}`, 404)
    );
  }

  // 4) Check if the reset code is verified
  if (!user.passwordResetVerified) {
    return next(new AppError("Please verify the reset code first", 400));
  }

  // 5) Set the new password (let pre-save hook handle hashing if it exists)
  user.password = req.body.newPassword; // Set plain text password
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;
  user.lastPasswordResetRequest = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  // 6) Generate token and send it to the user
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Password reset successfully!",
    token,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  // 1) User is already attached to req by the protect middleware
  const user = await UserModel.findById(req.user._id).select("-password");

  // 2) Send response
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await UserModel.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changedTimestamp) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  // 1) Get the user from req.user (set by protect middleware)
  const user = await UserModel.findById(req.user._id).select("+password");

  // 2) Verify the current password
  if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  // 3) Hash the new password
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();

  // 4) Save the updated user (pre-save hook will hash the password)
  await user.save();

  // 5) Generate a new token (since the old one will be invalid due to passwordChangedAt)
  const token = signToken(user._id);

  // 6) Send response
  res.status(200).json({
    status: "success",
    message:
      "Password changed successfully! Please use the new token to continue.",
    token,
  });
});

exports.updateMe = asyncHandler(async (req, res, next) => {
    if (req.body.password || req.body.email) {
      return next(
        new AppError(
          "This route is not for password or email updates. Use /changePassword for password updates.",
          400
        )
      );
    }
  
    const filteredBody = {};
    if (req.body.name) filteredBody.name = req.body.name;
    if (req.body.college) filteredBody.college = req.body.college;
    if (req.body.profilePicture) filteredBody.profilePicture = req.body.profilePicture;
    if (req.body.managedClub) filteredBody.managedClub = req.body.managedClub;
  
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
  
    const token = signToken(updatedUser._id);
  
    res.status(200).json({
      status: "success",
      message: "User data updated successfully!",
      data: {
        user: updatedUser,
      },
      token,
    });
  });
