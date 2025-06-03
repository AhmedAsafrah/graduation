const Notification = require("../models/notificationModel");

// Get all notifications for a user
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", results: notifications.length, notifications });
  } catch (err) {
    next(err);
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ status: "fail", message: "Notification not found" });
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