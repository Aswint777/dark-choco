const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const productOfferSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  status: {
    type: Boolean,
    default: true,
  },
  productName: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  offerRate: {
    type: Number,
  },
});

const offerProduct = mongoose.model("productOffer", productOfferSchema);
module.exports = offerProduct;
