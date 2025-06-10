const CommentModel = require("../models/commentModel");
const factory = require("./handlersFactory");

exports.createComment = async (commentData) => {
  const comment = await CommentModel.create(commentData);
  return comment;
};

exports.getAllComments = factory.getAll(CommentModel);
exports.getComment = factory.getOne(CommentModel);
exports.updateComment = factory.updateOne(CommentModel);
exports.deleteComment = factory.deleteOne(CommentModel);