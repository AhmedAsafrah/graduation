const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const PostModel = require("../models/postModel");
const { createComment } = require("../services/commentService");
const {
  restrictToResourceOwner,
} = require("../middleware/restrictResourceMiddleware");
const { setAuthor } = require("../middleware/setAuthorMiddleware");
const { createCommentValidator } = require("../validators/commentValidator");
const { protect, allowedTo } = authService;

const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getPostEngagement,
  getPostsByClub,
} = require("../services/postService");

const {
  createPostValidator,
  getSpecificPostValidator,
  updatePostValidator,
  deletePostValidator,
} = require("../validators/postValidator");

const { getPostsByClubValidator } = require("../validators/clubValidator");
const setUploadFolder = require("../middleware/setUploadFolderMiddleware");
const upload = require("../utils/multerConfig");
const LikeModel = require("../models/likeModel");
const { createNotification } = require("../services/notificationService");

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

router.post(
  "/",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  setUploadFolder("posts"),
  upload.array("images", 5),
  setAuthor,
  createPostValidator,
  createPost
); /** */

router.get("/", getAllPosts);

router.get("/:id", getSpecificPostValidator, getPost);

router.post(
  "/:id/comments",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  setAuthor,
  createCommentValidator,
  async (req, res) => {
    try {
      const post = await PostModel.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          status: "fail",
          message: "Post not found",
        });
      }

      // Set comment fields
      req.body.role = "post";
      req.body.post = req.params.id;
      req.body.event = null;

      const comment = await createComment(req.body);
      if (!post.comments) {
        post.comments = [];
      }
      post.comments.push(comment._id);
      await post.save();

      // --- Notification logic for users who liked the post ---
      const likes = await LikeModel.find({
        targetType: "post",
        targetId: post._id,
      }).populate("user", "name");
      const commenterName = req.user.name;
      const notifications = likes
        .filter((like) => like.user)
        .map((like) =>
          createNotification(like.user._id, "post_commented", {
            message: `${commenterName} commented on a post you liked 🚀`,
          })
        );
      await Promise.all(notifications);
      // -------------------------------------------------------

      res.status(201).json({
        status: "success",
        data: {
          comment,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
); /** */

router.put(
  "/:id",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  setUploadFolder("posts"),
  upload.array("images", 5), // Accept up to 5 images with the key "images"
  restrictToResourceOwner(PostModel, "author"),
  updatePostValidator,
  updatePost
);

router.delete(
  "/:id",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  restrictToResourceOwner(PostModel, "author"),
  deletePostValidator,
  deletePost
);

router.get(
  "/:id/engagement",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getPostEngagement
);

router.get(
  "/club/:clubId",
  protect,
  allowedTo("student", "club_responsible", "system_responsible"),
  getPostsByClubValidator,
  getPostsByClub
);

module.exports = router;
