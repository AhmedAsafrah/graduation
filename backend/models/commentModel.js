const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["post", "event"],
      required: [true, "Role is required (must be 'post' or 'event')"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [
        function () {
          return this.role === "post";
        },
        "Post ID is required for post comments",
      ],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [
        function () {
          return this.role === "event";
        },
        "Event ID is required for event comments",
      ],
    },
  },
  {
    timestamps: true,
    validate: {
      validator: function () {
        if (this.role === "post") {
          return this.post && !this.event;
        }
        if (this.role === "event") {
          return this.event && !this.post;
        }
        return false;
      },
      message: "A comment must reference a post if role is 'post', or an event if role is 'event', but not both.",
    },
  }
);

module.exports = mongoose.model("Comment", commentSchema);