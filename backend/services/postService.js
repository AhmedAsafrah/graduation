const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const AppError = require("../utils/appError");
const PostModel = require("../models/postModel");
const CommentModel = require("../models/commentModel");

exports.createPost = factory.createOne(PostModel);

exports.updatePost = factory.updateOne(PostModel);

exports.deletePost = factory.deleteOne(PostModel);

exports.getPost = factory.getOne(PostModel);

exports.getAllPosts = factory.getAll(PostModel);

exports.getPostEngagement = asyncHandler(async (req, res, next) => {
  // 1) Find the post by ID
  const post = await PostModel.findById(req.params.id);

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  // 2) Get the number of likes (length of the likes array)
  const numLikes = post.likes.length;

  // 3) Get the number of comments (count documents in the Comment model)
  const numComments = await CommentModel.countDocuments({
    post: req.params.id,
  });

  // 4) Send response
  res.status(200).json({
    status: "success",
    data: {
      postId: req.params.id,
      likes: numLikes,
      comments: numComments,
    },
  });
});

exports.getPostsByClub = asyncHandler(async (req, res, next) => {
  const { clubId } = req.params;

  // Fetch all posts associated with the specified club
  const posts = await PostModel.find({ club: clubId });

  res.status(200).json({
    status: "success",
    data: posts,
  });
});
