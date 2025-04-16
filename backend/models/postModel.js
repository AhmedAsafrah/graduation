const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    authorEmail: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: false },
    clubName: { type: String },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
