const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  walletAmount: {
    type: Number,
    default: 0,
  },

  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
    required: true,
    unique: true,
  },
  transactions: [
    {

      amount: {
        type: Number,
      },
      type: {
        type: String,
        enum: ["credit", "debit"],
      },
        description: {
          type: String,
        },
      orderData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const wallet = mongoose.model("wallet", walletSchema);
module.exports = wallet;
