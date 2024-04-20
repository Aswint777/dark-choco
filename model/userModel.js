const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is required"],
    trim: true,
  },
  secondName: {
    type: String,
    required: [true, "second name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please enter the email"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter the password"],
    minLength: [6, "minimum password length is 6"],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: Boolean,
    default: true,
  },
  phoneNumber: {
    type: Number,
    min: 10,
    max: 15,
  },
  address: {
    type: String,
  },
  pinNumber: {
    type: Number,
  },
  allCoupon: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon",
    },
  ],
  userReferralCode: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const user = mongoose.model("userData", userSchema);

module.exports = user;
