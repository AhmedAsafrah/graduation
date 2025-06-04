const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const AppError = require("../utils/appError");
const PostModel = require("../models/postModel");
const CommentModel = require("../models/commentModel");
const cloudinary = require("../utils/cloudinaryConfig");
const { createNotification } = require("./notificationService");
const userModel = require("../models/userModel");
const clubModel = require("../models/clubModel");

exports.createPost = asyncHandler(async (req, res, next) => {
  const { title, content, author, club } = req.body;

  const image = req.files?.image ? req.files.image[0].path : undefined;

  const post = await PostModel.create({
    title,
    content,
    author,
    image,
    club,
  });

  // ---- Notification logic ----
  try {
    if (req.user.role === "system_responsible") {
      // Notify everyone in the system
      const users = await userModel.find({}, "_id");
      const notifications = users.map((user) =>
        createNotification(user._id, "post_created", {
          message: `A new post was created by the manager, Check it out!`,
        })
      );
      await Promise.all(notifications);
    } else if (req.user.role === "club_responsible" && club) {
      const clubDoc = await clubModel
        .findById(club)
        .populate("members", "_id role");
      if (clubDoc && clubDoc.members && clubDoc.members.length > 0) {
        // Notify all members (students and club_responsible)
        const notifications = clubDoc.members.map((member) =>
          createNotification(member._id, "post_created", {
            message: `A new post was added in your club "${clubDoc.name}".`,
          })
        );
        await Promise.all(notifications);
      }
    }
  } catch (err) {
    console.error("Notification error:", err);
  }
  // ---------------------------

  res.status(201).json({
    status: "success",
    data: post,
  });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  const { title, content, author, club } = req.body;

  // Fetch the existing post to get the old image URL
  const post = await PostModel.findById(req.params.id);
  if (!post) {
    return next(new Error("No post found with that ID"));
  }

  // Prepare the update data
  const updateData = { title, content, author, club };

  // Handle image upload if present
  if (req.files && req.files.image) {
    // Function to extract public_id from Cloudinary URL
    const getPublicIdFromUrl = (url) => {
      if (!url) return null;
      const parts = url.split("/");
      const fileName = parts[parts.length - 1].split(".")[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${fileName}`;
    };

    // Delete old image from Cloudinary
    if (post.image) {
      const oldImagePublicId = getPublicIdFromUrl(post.image);
      if (oldImagePublicId) {
        try {
          await cloudinary.uploader.destroy(oldImagePublicId);
        } catch (error) {}
      }
    }
    // Set new image path
    updateData.image = req.files.image[0].path;
    // Optionally invalidate new image in Cloudinary
    const newImagePublicId = getPublicIdFromUrl(req.files.image[0].path);
    if (newImagePublicId) {
      try {
        await cloudinary.api.resource(newImagePublicId, { invalidate: true });
      } catch (error) {}
    }
  }

  // Update the post with new data
  const updatedPost = await PostModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedPost,
  });
});

exports.deletePost = factory.deleteOne(PostModel);

exports.getPost = factory.getOne(PostModel);

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  let posts = await PostModel.find()
    .sort({ createdAt: -1 })
    .populate("club")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "_id profilePicture name",
      },
    });

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: posts,
  });
});

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

  // Fetch all posts associated with the specified club and populate the club field
  const posts = await PostModel.find({ club: clubId }).populate("club");

  res.status(200).json({
    status: "success",
    data: posts,
  });
});
