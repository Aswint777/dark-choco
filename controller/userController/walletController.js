const wallet = require("../../model/walletModel");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const order = require("../../model/orderModel");
const { Transaction } = require("mongodb");

const walletHistory = async (req, res) => {
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    let walletData;
    if (userId) {
      walletData = await wallet
        .findOne({ userData: userId })
        .populate("transactions.orderData");
      if (!walletData) {
        walletData = await wallet.create({ userData: userId });
      }
      console.log(walletData, "walletData");
      res.render("userViews/walletHistory", { walletData });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  walletHistory,
};
