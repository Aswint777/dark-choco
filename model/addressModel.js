const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressData: [
    {
      firstName: {
        type: String,
        required: [true, "please enter the firstName"],
      },
      secondName: {
        type: String,
        required: [true, "please enter the secondName"],
      },
      address: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: [true, "please enter the email"],
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
    },
  ],
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
    required: true,
  },
});

const address = mongoose.model("address", addressSchema);

module.exports = address;
