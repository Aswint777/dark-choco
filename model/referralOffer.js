const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const referralOfferSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: true,
  },
  offerAmount: {
    type: Number,
  },
});

const referral = mongoose.model("referralOffer", referralOfferSchema);
module.exports = referral;
