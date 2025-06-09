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
  // Get Cloudinary URLs directly from multer's req.files
  const images = req.files
    ? req.files.map((file) => file.path || file.url)
    : [];

  const postData = {
    title,
    content,
    author,
    images, // array of Cloudinary URLs
  };
  if (club) postData.club = club;

  const post = await PostModel.create(postData);

  // ---- Notification logic ----
  try {
    if (req.user.role === "system_responsible") {
      const users = await userModel.find({}, "_id");
      const notifications = users.map((user) =>
        createNotification(user._id, "post_created", {
          message: `تم إنشاء منشور جديد بواسطة المدير، تفقده الآن!`,
        })
      );
      await Promise.all(notifications);
    } else if (req.user.role === "club_responsible" && club) {
      const clubDoc = await clubModel
        .findById(club)
        .populate("members", "_id role");
      if (clubDoc && clubDoc.members && clubDoc.members.length > 0) {
        const notifications = clubDoc.members.map((member) =>
          createNotification(member._id, "post_created", {
            message: `تمت إضافة منشور جديد في ناديك "${clubDoc.name}".`,
          })
        );
        await Promise.all(notifications);
      }
    }
  } catch (err) {
    console.error("Notification error:", err);
  }

  res.status(201).json({
    status: "success",
    data: post,
  });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  const { title, content, author, club } = req.body;

  // Fetch the existing post to get the old image URLs
  const post = await PostModel.findById(req.params.id);
  if (!post) {
    return next(new Error("No post found with that ID"));
  }

  // Prepare the update data
  const updateData = { title, content, author, club };

  // Function to extract public_id from Cloudinary URL
  const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileName}`;
  };

  // Handle image removal (remove all images if requested)
  if (req.body.images === "") {
    if (post.images && post.images.length > 0) {
      for (const url of post.images) {
        const oldImagePublicId = getPublicIdFromUrl(url);
        if (oldImagePublicId) {
          try {
            await cloudinary.uploader.destroy(oldImagePublicId);
          } catch (error) {}
        }
      }
    }
    updateData.images = [];
  }

  // Handle new image uploads (replace all images)
  if (req.files && req.files.length > 0) {
    // Optionally: remove old images first (if not already removed above)
    if (!req.body.images || req.body.images !== "") {
      if (post.images && post.images.length > 0) {
        for (const url of post.images) {
          const oldImagePublicId = getPublicIdFromUrl(url);
          if (oldImagePublicId) {
            try {
              await cloudinary.uploader.destroy(oldImagePublicId);
            } catch (error) {}
          }
        }
      }
    }
    const newImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "posts",
        });
        return result.secure_url;
      })
    );
    updateData.images = newImages;
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
    })
    .populate({
      path: "likes",
      populate: {
        path: "user",
        select: "_id", // Only return the user's _id
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

  // 3) Get the sorted comments (newest first) and populate author fields
  const comments = await CommentModel.find({ post: req.params.id })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "name profilePicture", // Adjust field name if needed
    });

  // 4) Send response
  res.status(200).json({
    status: "success",
    data: {
      postId: req.params.id,
      likes: numLikes,
      commentsCount: comments.length,
      comments, // return sorted comments array with populated author
    },
  });
});

exports.getPostsByClub = asyncHandler(async (req, res, next) => {
  const { clubId } = req.params;

  // Fetch all posts associated with the specified club, sort by newest first, and populate the club field
  const posts = await PostModel.find({ club: clubId })
    .sort({ createdAt: -1 })
    .populate("club");

  res.status(200).json({
    status: "success",
    data: posts,
  });
});
