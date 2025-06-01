const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    student: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, "Student is required"] 
    },
    club: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Club',
      required: [true, "Club is required"]
    },
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "pending" 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Registration", registrationSchema);