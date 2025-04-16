const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    profilePicture: { type: String, required: true },
    coverPicture: { type: String, required: true },
    college: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Club", clubSchema);


