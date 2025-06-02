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
const { restrictToResourceOwner } = require("../middleware/restrictResourceMiddleware");

// Create a leaderboard
router.post(
  "/",
  protect,
  allowedTo("admin", "system_responsible", ),
  createLeaderboardValidator,
  createLeaderboard
);

// Get all leaderboards
router.get(
  "/",
  protect,
  allowedTo("system_responsible", "club_responsible", "student"),
  getAllLeaderboards
);

// Get a specific leaderboard by ID
router.get(
  "/:id",
  protect,
  allowedTo("system_responsible", "club_responsible"),
  getLeaderboardValidator,
  getLeaderboard
);

// Update a leaderboard by ID
router.put(
  "/:id",
  protect,
  allowedTo( "system_responsible", "club_responsible"),
  // Allow club_responsible to update leaderboards they manage
  restrictToResourceOwner("Leaderboard", "managedClub"),
  updateLeaderboardValidator,
  updateLeaderboard
);

// Delete a leaderboard by ID
router.delete(
  "/:id",
  protect,
  allowedTo("system_responsible", "club_responsible"),
  deleteLeaderboardValidator,
  deleteLeaderboard
);

module.exports = router;
