const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const { setAuthor } = require("../middleware/setAuthorMiddleware");

const { getAllLikes, toggleLike } = require("../services/likeService");

const { createLikeValidator } = require("../validators/likeValidator");

const { protect, allowedTo } = authService;

router.get("/", getAllLikes);

router.post(
  "/",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  setAuthor,
  createLikeValidator,
  toggleLike
);

module.exports = router;