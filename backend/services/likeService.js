const LikeModel = require("../models/likeModel");
const EventModel = require("../models/eventModel");
const PostModel = require("../models/postModel");
const factory = require("./handlersFactory");
const AppError = require("../utils/appError");

exports.getAllLikes = factory.getAll(LikeModel);

exports.toggleLike = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.body;
    const userId = req.user.id; // req.user.id is already a string
    const user = req.body.user; // Set by setAuthor middleware

    // Ensure the user field matches the logged-in user
    if (user !== userId) {
      return next(
        new AppError("You can only create a like for yourself", 403)
      );
    }

    // Check if the like already exists
    const existingLike = await LikeModel.findOne({
      user,
      targetType,
      targetId,
    });

    if (existingLike) {
      // If the like exists, remove it (toggle off)
      await LikeModel.deleteOne({ _id: existingLike._id });

      // Remove the like from the target's likes array (if applicable)
      const TargetModel = targetType === "event" ? EventModel : PostModel;
      const target = await TargetModel.findById(targetId);
      if (target.likes) {
        target.likes = target.likes.filter(
          (likeId) => likeId.toString() !== existingLike._id.toString()
        );
        await target.save();
      }

      return res.status(200).json({
        status: "success",
        message: "Like removed successfully",
        data: null,
      });
    }

    // If the like doesn't exist, create it (toggle on)
    const newLike = await LikeModel.create({
      user,
      targetType,
      targetId,
    });

    // Add the like to the target's likes array (if applicable)
    const TargetModel = targetType === "event" ? EventModel : PostModel;
    const target = await TargetModel.findById(targetId);
    if (target) {
      if (!target.likes) {
        target.likes = [];
      }
      target.likes.push(newLike._id);
      await target.save();
    }

    res.status(201).json({
      status: "success",
      data: {
        like: newLike,
      },
    });
  } catch (error) {
    // If the error is a duplicate key error (user already liked this target), it should be handled by the toggle logic
    if (error.code === 11000) {
      return next(new AppError("You have already liked this target", 400));
    }
    return next(new AppError(error.message, 400));
  }
};