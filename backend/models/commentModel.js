const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: [true, "Content is required"] },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, "Author is required"] 
    },
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post', 
      required: [true, "Post is required"] 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);