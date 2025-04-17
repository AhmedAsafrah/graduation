const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    date: { type: Date, required: [true, "Date is required"] },
    startTime: { type: String, required: [true, "Start Time is required"] },
    endTime: { type: String, required: [true, "End Time is required"] },
    location: { type: String, required: [true, "Location is required"] },
    image: { type: String, required: false },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
