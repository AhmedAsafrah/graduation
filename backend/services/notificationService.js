const Notification = require("../models/notificationModel");
const userModel = require("../models/userModel");
const ClubModel = require("../models/clubModel");

exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      status: "success",
      results: notifications.length,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notification not found" });
    }
    res.status(200).json({ status: "success", notification });
  } catch (err) {
    next(err);
  }
};

exports.createNotification = async (userId, type, data = {}) => {
  return Notification.create({
    user: userId,
    type,
    ...data,
  });
};

exports.sendSystemNotification = async (req, res, next) => {
  try {
    if (req.user.role !== "system_responsible") {
      return res
        .status(403)
        .json({ status: "fail", message: "Not authorized" });
    }

    const { message, type = "system" } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ status: "fail", message: "Message is required" });
    }

    const users = await userModel.find({}, "_id");
    const notifications = users.map((user) =>
      Notification.create({
        user: user._id,
        type,
        message,
      })
    );
    await Promise.all(notifications);

    res
      .status(201)
      .json({ status: "success", message: "Notification sent to all users" });
  } catch (err) {
    next(err);
  }
};

exports.sendClubNotification = async (req, res, next) => {
  try {
    if (req.user.role !== "club_responsible") {
      return res
        .status(403)
        .json({ status: "fail", message: "Not authorized" });
    }

    const { clubId, message, type = "club_custom" } = req.body;
    if (!clubId || !message) {
      return res
        .status(400)
        .json({ status: "fail", message: "clubId and message are required" });
    }

    if (!req.user.managedClub || req.user.managedClub.toString() !== clubId) {
      return res
        .status(403)
        .json({ status: "fail", message: "You are not the manager of this club" });
    }

    const club = await ClubModel.findById(clubId).populate("members", "_id");
    if (!club) {
      return res
        .status(404)
        .json({ status: "fail", message: "Club not found" });
    }

    const notifications = club.members.map((member) =>
      Notification.create({
        user: member._id,
        type,
        message,
      })
    );
    await Promise.all(notifications);

    res.status(201).json({
      status: "success",
      message: "Notification sent to all club members",
    });
  } catch (err) {
    next(err);
  }
};