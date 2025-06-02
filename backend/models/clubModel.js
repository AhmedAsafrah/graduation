const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    description: { type: String, required: [true, "Description is required"] },
    profilePicture: {
      type: String,
      required: [true, "Profile picture is required"],
    },
    coverPicture: {
      type: String,
      required: [true, "Cover picture is required"],
    },
    college: { type: String, required: [true, "College is required"] },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true,
  }
);
clubSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Club", clubSchema);
