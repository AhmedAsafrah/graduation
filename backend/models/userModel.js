const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true
    },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "default.jpg" },
    role: {
      type: String,
      enum: ["student", "club_responsible", "system_responsible"],
      default: "student",
    },
    college: {
      type: String,
      required: function () {
        return this.role === "student" || this.role === "club_responsible";
      },
    },
    managedClub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: function () {
        return this.role === "club_responsible";
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);