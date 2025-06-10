const LikeModel = require("../models/likeModel");
const EventModel = require("../models/eventModel");
const PostModel = require("../models/postModel");
const factory = require("./handlersFactory");
const AppError = require("../utils/appError");

exports.getAllLikes = factory.getAll(LikeModel);

exports.toggleLike = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.body;
    const userId = req.user.id;
    const user = req.body.user;

    if (user !== userId) {
      return next(
        new AppError("You can only create a like for yourself", 403)
      );
    }

    const TargetModel = targetType === "event" ? EventModel : PostModel;

    const existingLike = await LikeModel.findOne({
      user,
      targetType,
      targetId,
    });

    if (existingLike) {
      await LikeModel.deleteOne({ _id: existingLike._id });

      const target = await TargetModel.findById(targetId);
      if (target && target.likes) {
        target.likes = target.likes.filter(
          (likeId) => likeId.toString() !== existingLike._id.toString()
        );
        await target.save();
      }

      const updatedTarget = await TargetModel.findById(targetId).populate({
        path: "likes",
        populate: {
          path: "user",
          select: "_id name"
        }
      });

      return res.status(200).json({
        status: "success",
        message: "Like removed successfully",
        data: {
          likes: updatedTarget && updatedTarget.likes ? updatedTarget.likes : [],
        },
      });
    }

    const newLike = await LikeModel.create({
      user,
      targetType,
      targetId,
    });

    const target = await TargetModel.findById(targetId);
    if (target) {
      if (!target.likes) {
        target.likes = [];
      }
      target.likes.push(newLike._id);
      await target.save();
    }

    const updatedTarget = await TargetModel.findById(targetId).populate({
      path: "likes",
      populate: {
        path: "user",
        select: "_id name"
      }
    });

    res.status(201).json({
      status: "success",
      data: {
        like: newLike._id,
        likes: updatedTarget && updatedTarget.likes ? updatedTarget.likes : [],
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("You have already liked this target", 400));
    }
    return next(new AppError(error.message, 400));
  }
};