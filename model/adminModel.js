const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");



const adminSchema = new mongoose.Schema({
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
  });
  
  adminSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  const Admin = mongoose.model("adminData", adminSchema);

  module.exports = Admin;
