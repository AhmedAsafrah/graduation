const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: [true, "Content is required"] },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, "Author is required"] 
    },
    image: { type: String, required: false },
    club: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Club' 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);