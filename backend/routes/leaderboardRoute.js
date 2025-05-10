const express = require("express");
const router = express.Router();
const { protect, allowedTo } = require("../services/authService");
const {
  createLeaderboard,
  getAllLeaderboards,
  getLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
} = require("../services/leaderboardService");

const {
  createLeaderboardValidator,
  updateLeaderboardValidator,
  getLeaderboardValidator,
  deleteLeaderboardValidator,
} = require("../validators/leaderboardValidator");

// Create a leaderboard
router.post(
  "/",
  protect,
  allowedTo("admin", "system_responsible"),
  createLeaderboardValidator,
  createLeaderboard
);

// Get all leaderboards
router.get(
  "/",
  protect,
  allowedTo("admin", "system_responsible"),
  getAllLeaderboards
);

// Get a specific leaderboard by ID
router.get(
  "/:id",
  protect,
  allowedTo("admin", "system_responsible"),
  getLeaderboardValidator,
  getLeaderboard
);

// Update a leaderboard by ID
router.put(
  "/:id",
  protect,
  allowedTo("admin", "system_responsible"),
  updateLeaderboardValidator,
  updateLeaderboard
);

// Delete a leaderboard by ID
router.delete(
  "/:id",
  protect,
  allowedTo("admin", "system_responsible"),
  deleteLeaderboardValidator,
  deleteLeaderboard
);

module.exports = router;
