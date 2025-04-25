const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const UserModel = require("../models/userModel");
const { signToken } = require("../utils/createToken");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.signup = asyncHandler(async (req, res, next) => {
  // 1) Create the user
  const newUser = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "student",
    college: req.body.college,
    managedClub: req.body.managedClub,
    profilePicture: req.body.profilePicture || "default.jpg",
  });

  // 2) Generate JWT token
  const token = signToken(newUser._id);

  // 3) Respond with the new user and token
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  // 1) Check if user exists and password is correct
  const user = await UserModel.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 2) Generate JWT token
  const token = signToken(user._id);

  // 3) Send response
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
