const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "event_created",
        "reset_password",
        "club_created",
        "event_commented",
        "event_updated",
        "leaderboard_created",
        "post_commented",
        "post_created",
        "signup",
        "system",
        "announcement",
        "club_custom",
        "club_approved",
      ],
      default: "other",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
