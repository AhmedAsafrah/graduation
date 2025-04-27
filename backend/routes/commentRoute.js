const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const CommentModel = require("../models/commentModel");

const {
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
} = require("../services/commentService");

const {
    getSpecificCommentValidator,
    updateCommentValidator,
    deleteCommentValidator,
} = require("../validators/commentValidator");

const { restrictToResourceOwner } = require("../middleware/restrictResourceMiddleware");

const { protect, allowedTo } = authService;

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

router.get("/", getAllComments);

router.get("/:id", getSpecificCommentValidator, getComment);

router.put(
  "/:id",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  restrictToResourceOwner(CommentModel, "author"),
  updateCommentValidator,
  updateComment
);

router.delete(
  "/:id",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  restrictToResourceOwner(CommentModel, "author"),
  deleteCommentValidator,
  deleteComment
);

module.exports = router;