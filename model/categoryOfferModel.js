const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const categoryOfferSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  status: {
    type: Boolean,
    default: true,
  },
  categoryName: {
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

const offerCategory = mongoose.model("categoryOffer", categoryOfferSchema);
module.exports = offerCategory;
