const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Leaderboard name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    top1: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    top2: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    top3: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Populate user details for top1, top2, top3
leaderboardSchema.pre(/^find/, function (next) {
  this.populate({
    path: "top1 top2 top3",
    select: "name profilePicture",
  }).populate({
    path: "event",
    select: "name date",
  });
  next();
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

module.exports = Leaderboard;
