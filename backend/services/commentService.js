const CommentModel = require("../models/commentModel");
const factory = require("./handlersFactory");

// Utility function for creating a comment (used in postRoute.js and eventRoute.js)
exports.createComment = async (commentData) => {
  const comment = await CommentModel.create(commentData);
  return comment;
};

// Use factory for standard CRUD operations
exports.getAllComments = factory.getAll(CommentModel);
exports.getComment = factory.getOne(CommentModel);
exports.updateComment = factory.updateOne(CommentModel);
exports.deleteComment = factory.deleteOne(CommentModel);