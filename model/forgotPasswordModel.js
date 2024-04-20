const mongoose = require("mongoose");

const forgotSchema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true,
    trim: true,
    expiresAt: { type: Date, default: Date.now, expires: "5m" },
  },
  email: {
    type: String,
    required: [true, "please enter the email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});



const restPassword = mongoose.model("forgot", forgotSchema);
module.exports = restPassword;
