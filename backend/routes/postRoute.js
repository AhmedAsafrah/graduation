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

///////////////////////////////////////////////////// ******* ROUTES ******* /////////////////////////////////////////////////////

router.post(
  "/",
  protect,
  allowedTo("club_responsible", "system_responsible"),
  setUploadFolder("posts"),
  upload.fields([{ name: "image", maxCount: 1 }]),
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
  allowedTo("student", "club_responsible", "system_responsible"),
  setUploadFolder("posts"),
  upload.fields([{ name: "image", maxCount: 1 }]),
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
