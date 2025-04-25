const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: [true, "Content is required"] },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    image: { type: String, required: false },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: [true, "Club is required"],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
