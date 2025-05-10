const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const factory = require("./handlersFactory");
const bcrypt = require("bcrypt");
const ClubModel = require("../models/clubModel");

exports.createUser = factory.createOne(UserModel);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findById(req.params.id);
  if (!document) {
    return next(
      new AppError(`No user found with the id ${req.params.id}`, 404)
    );
  }
  // Prevent password updates through this endpoint
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This endpoint is not for password updates. Use /changePassword instead.",
        400
      )
    );
  }
  Object.assign(document, req.body);
  await document.save();

  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Find the user and include the password field
  const user = await UserModel.findById(req.params.id).select("+password");
  if (!user) {
    return next(
      new AppError(`No user found with the id ${req.params.id}`, 404)
    );
  }
  // 2) Verify the current password
  const isPasswordCorrect = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );
  if (!isPasswordCorrect) {
    return next(new AppError("Your current password is incorrect", 401));
  }
  // 3) Update the password using findByIdAndUpdate
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );
  // 4) Respond with success
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    data: updatedUser,
  });
});

exports.deleteUser = factory.deleteOne(UserModel);

exports.getUser = factory.getOne(UserModel);

exports.getAllUsers = factory.getAll(UserModel);

exports.searchStudentsAndClubs = asyncHandler(async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return next(new AppError("Search query is required", 400));
  }

  // Search for students and club_responsible
  const users = await UserModel.find({
    name: { $regex: query, $options: "i" },
    $or: [{ role: "student" }, { role: "club_responsible" }],
  }).select("-password -emailVerificationCode -emailVerificationExpires -passwordResetCode -passwordResetExpires -passwordResetVerified -lastPasswordResetRequest");

  // Search for clubs
  const clubs = await ClubModel.find({
    name: { $regex: query, $options: "i" },
  });

  res.status(200).json({
    status: "success",
    data: {
      users,
      clubs,
    },
  });
});