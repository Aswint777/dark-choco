const order = require("../../model/orderModel");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const wallet = require("../../model/walletModel");
const product = require("../../model/productModel");
const { generateInvoice } = require("../helperFunction/easyInvoice");

const userOrderHistoryPage = async (req, res) => {
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    console.log(userId, "dhfbvdkjfn");
    //

    let query = req.query;
    console.log(query, "yeeeeeeeeeeeeeeeeees");

    var i = 0;
    const page = parseInt(req.query.page) || 1;
    const count = await order.countDocuments({ userData: userId });
    console.log("start", count, "count");
    const pageSize = 3;
    const totalOrder = Math.ceil(count / pageSize);
    const skip = (page - 1) * pageSize;
    let orderHistory;

    if (req.query.date) {
      console.log(req.query, "query");
      const latest = await order.find({ userData: userId }).sort({
        date: Number(req.query.date),
      }); //{} {another:true,chocolate:true}

      console.log(latest, "largest");
      res.json({ latest });
    } else if (req.query.searchQuery) {
      console.log(
        req.query.searchQuery,
        "lllllllllllllllllllllllllllllllllllllllll"
      );
      orderHistory = await order.find({
        userData: userId,
        status: { $regex: req.query.searchQuery, $options: "i" },
      });
      const query = req.query.searchQuery;
      res.render("adminViews/returnProductList", {
        orderHistory,
        query,
        totalOrder,
        pageSize,
        page: page,
      });
    } else {
      orderHistory = await order
        .find({ userData: userId })
        .skip(skip)
        .limit(pageSize);
      console.log(orderHistory);
      res.render("userViews/userOrderHistory", {
        orderHistory,
        query,
        totalOrder,
        pageSize,
        page: page,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const userOrderDetails = async (req, res) => {
  console.log("hai");
  const { _id } = req.query;
  console.log(_id);
  const details = await order.findOne({ _id: _id });
  console.log(details);
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
            {
              $inc: { walletAmount: orderDetails.total },
              $push: { transactions: newTransaction },
            },
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
      if (cancel.status == "canceled") {
        console.log(cancel, "canceled");

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
              console.log(
                decrimentProductQuantity,
                "quantity decrement is here"
              );
            });
            await Promise.all(updatePromises); // Wait for all updates to complete
          } else {
            // Assuming 'pro' is a single object
            const decrimentProductQuantity = await product.findOneAndUpdate(
              { _id: pro._id },
              { $inc: { quantity: pro.quantity } },
              { new: true }
            );
            console.log(decrimentProductQuantity, "quantity decrement is here");
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
    res.json({ succuss: true });
  } catch (error) {
    console.log(error);
  }
};

const downloadInvoice = async (req, res) => {
  try {
    console.log(req.body);
    const { _id } = req.body;
    const orderDetails = await order.findOne({ _id: _id });
    if (orderDetails.status !== "delivered") {
      throw Error("status is not delivered");
    }
    const invoicePath = await generateInvoice(orderDetails);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${_id}.pdf`
    );
    res.send(invoicePath);
    console.log(_id);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  userOrderHistoryPage,
  userOrderDetails,
  cancelOrder,
  returnProduct,
  downloadInvoice,
};
