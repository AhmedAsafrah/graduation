const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    targetType: {
      type: String,
      enum: ["event", "post"],
      required: [true, "Target type is required"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Target ID is required"],
      // Dynamically set the reference based on targetType
      refPath: "targetType", // Will reference either "Event" or "Post" based on targetType
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique likes (user can't like the same target twice)
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);