const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: false },
    clubName: { type: String, required: true, default: "Student Affairs" }, 
    likes: { type: Number, default: 0 },
  },
  {  
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);

