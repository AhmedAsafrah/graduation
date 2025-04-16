const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    studentEmail: { type: String, required: true },
    clubName: { type: String },
    eventTitle: { type: String },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", registrationSchema);
