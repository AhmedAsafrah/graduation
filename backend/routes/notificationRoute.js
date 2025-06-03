const express = require("express");
const notificationService = require("../services/notificationService");
const { protect } = require("../services/authService"); // Use your actual function name

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all notifications for the logged-in user
router.get("/", notificationService.getUserNotifications);

// Mark a notification as read
router.put("/:id/read", notificationService.markAsRead);

module.exports = router;