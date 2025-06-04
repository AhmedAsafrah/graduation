const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const UserModel = require("../models/userModel");
const LeaderboardModel = require("../models/leaderboardModel");
const AppError = require("../utils/appError");
const { createNotification } = require("./notificationService");

// Create Leaderboard with Emails for Top Users
exports.createLeaderboard = asyncHandler(async (req, res, next) => {
  const { name, description, top1, top2, top3, event } = req.body;

  // Resolve emails to user IDs
  const top1User = top1 ? await UserModel.findOne({ email: top1 }) : null;
  const top2User = top2 ? await UserModel.findOne({ email: top2 }) : null;
  const top3User = top3 ? await UserModel.findOne({ email: top3 }) : null;

  if (top1 && !top1User) {
    return next(new AppError(`User with email ${top1} not found.`, 400));
  }
  if (top2 && !top2User) {
    return next(new AppError(`User with email ${top2} not found.`, 400));
  }
  if (top3 && !top3User) {
    return next(new AppError(`User with email ${top3} not found.`, 400));
  }

  // Create the leaderboard
  const leaderboard = await LeaderboardModel.create({
    name,
    description,
    top1: top1User ? top1User._id : null,
    top2: top2User ? top2User._id : null,
    top3: top3User ? top3User._id : null,
    event,
    author: req.user._id,
  });

  // ---- Notification logic for everyone ----
  try {
    const users = await UserModel.find({}, "_id");
    const notifications = users.map((user) =>
      createNotification(user._id, "leaderboard_created", {
        message: `A new leaderboard "${leaderboard.name}" has been created!`,
      })
    );
    await Promise.all(notifications);
  } catch (err) {
    console.error("Notification error:", err);
  }
  // ----------------------------------------

  res.status(201).json({
    status: "success",
    data: leaderboard,
  });
});

// Use factory for generic CRUD operations
exports.getAllLeaderboards = factory.getAll(LeaderboardModel);
exports.getLeaderboard = factory.getOne(LeaderboardModel);
exports.updateLeaderboard = factory.updateOne(LeaderboardModel);
exports.deleteLeaderboard = factory.deleteOne(LeaderboardModel);
