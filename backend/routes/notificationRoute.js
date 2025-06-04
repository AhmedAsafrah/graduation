const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  sendSystemNotification,
  sendClubNotification,
} = require("../services/notificationService");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all notifications for the logged-in user
router.get("/", getUserNotifications);

// Mark a notification as read
router.put("/:id/read", markAsRead);

// Send a custom system notification (system_responsible only)
router.post(
  "/system",
  allowedTo("system_responsible"),
  sendSystemNotification
);

router.post(
  "/club",
  allowedTo("club_responsible"),
  sendClubNotification
);

module.exports = router;