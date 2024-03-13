const order = require("../../model/orderModel");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const wallet = require("../../model/walletModel");
const product = require('../../model/productModel')

const userOrderHistoryPage = async (req, res) => {
  const token = req.cookies.loginToken;
  const data = jwt.verify(token, process.env.SECRET_KEY);
  const { userId } = data;
  console.log("dhfbvdkjfn");
  const orderHistory = await order.find({ userData: userId });
  console.log(orderHistory);
  res.render("userViews/userOrderHistory", { orderHistory });
};

const userOrderDetails = async (req, res) => {
  console.log('hai')
  const { _id } = req.query;
  console.log(_id)
  const details = await order.findOne({ _id: _id });
  console.log(details)
  res.render("userViews/userOrderDetailsPage", { details });
};

const cancelOrder = async (req, res) => {
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    if (userId) {
      console.log(req.body);
      const { _id, method } = req.body;
      // console.log(_id )
      const orderDetails = await order.findOne({ userData: userId, _id: _id });
      console.log(orderDetails);
      let myWallet;
      if (method == "razorPay" || method == "myWallet") {
        console.log("razorPay console");
        myWallet = await wallet.findOne({ userData: userId });
        console.log(myWallet, "mywallet");
        console.log(orderDetails.total);

        const newTransaction = {
          amount: orderDetails.total,
          type: "credit",
          orderData: new mongoose.Types.ObjectId(orderDetails._id),
        };

        if (myWallet) {
          myWallet = await wallet.findOneAndUpdate(
            { userData: userId },
            { $inc: { walletAmount: orderDetails.total },$push: { transactions: newTransaction }, },
            { new: true }
          );
        } else {
          

          myWallet = await wallet.create({
            userData: userId,
            walletAmount: orderDetails.total,
            transactions: newTransaction,
          });
        }
      }

      const cancel = await order.findOneAndUpdate(
        { _id: _id },
        { $set: { status: "canceled" } },
        { new: true }
      );
      if(cancel.status == "canceled" ){
         console.log(cancel,'canceled');


         const mapQuantity = cancel.products.map(async (pro) => {
          console.log(pro, "before updation");
          if (Array.isArray(pro)) {
            // Assuming 'pro' is an array of objects
            const updatePromises = pro.map(async (item) => {
              const decrimentProductQuantity = await product.findOneAndUpdate(
                { _id: item._id },
                { $inc: { quantity: item.quantity } },
                { new: true }
              );
              console.log(decrimentProductQuantity, 'quantity decrement is here');
            });
            await Promise.all(updatePromises); // Wait for all updates to complete
          } else {
            // Assuming 'pro' is a single object
            const decrimentProductQuantity = await product.findOneAndUpdate(
              { _id: pro._id },
              { $inc: { quantity: pro.quantity } },
              { new: true }
            );
            console.log(decrimentProductQuantity, 'quantity decrement is here');
          }
        });
        

      }
      console.log("haaaaaaaaaaaai");
      // console.log(cancel,'canceled')
      res.json({ succuss: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const returnProduct = async (req, res) => {
  try {
    const { _id, method, returnReason } = req.body;
    console.log(_id, method, returnReason);
    const orderDetails = await order.findOneAndUpdate(
      { _id: _id },
      { $set: { status: "return request", returnReason: returnReason } },
      { new: true }
    );
    console.log(orderDetails, "orderDetails");
    if (!orderDetails) {
      throw Error("your order is not find");
    }
    res.json({succuss : true})
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  userOrderHistoryPage,
  userOrderDetails,
  cancelOrder,
  returnProduct,
};
