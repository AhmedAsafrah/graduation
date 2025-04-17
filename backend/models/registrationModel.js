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
      ref: 'Club' 
    },
    event: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event' 
    },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
  },
  {
    timestamps: true,
  }
);

// Ensure at least one of club or event is provided
registrationSchema.pre('save', function (next) {
  if (!this.club && !this.event) {
    return next(new Error('Either club or event must be provided'));
  }
  next();
});

module.exports = mongoose.model("Registration", registrationSchema);