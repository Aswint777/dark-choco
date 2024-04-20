const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const addressSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  secondName: {
    type: String,
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  secondName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,

    trim: true,
   
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
    // min : 10,
    // max : 15
  },
  address: {
    type: String,
  },
  pinNumber: {
    type: Number,
  },
});

const orderSchema = new mongoose.Schema({
  subTotal: {
    type: Number,
  },
  shipping: {
    type: Number,
    default: 0,
  },
  couponOffer: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  total: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    required: true,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "canceled",
      "rejected",
      "return request",
      "return approved",
      "return rejected",
      "pickup completed",
      "returned",
    ],
    default: "pending",
  },
  products: [
    {
      quantity: {
        type: Number,
        min: 1,
      },

      oneProductTotal: {
        type: Number,
      },
      stock: {
        type: String,
        // required:true,
        trim: true,
      },

      image1: {
        type: String,
      },
      image2: {
        type: String,
      },
      image3: {
        type: String,
      },

      status: {
        type: Boolean,
        default: true,
      },
      productDescription: {
        type: String,
      },
      date: {
        type: Date,
        default: new Date(),
      },
      quantity: {
        type: Number,
        min: 0,
      },
      amount: {
        type: Number,
        min: 1,
      },
      markup: {
        type: Number,
        min: 1,
      },
    },
  ],
  paymentMode: {
    type: String,
    required: true,
    enum: ["cod", "razorPay", "myWallet"],
  },
  address: addressSchema,
  userDetails: userSchema,
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",

  },
  returnReason: {
    type: String,
  },
});

const order = mongoose.model("order", orderSchema);
module.exports = order;
