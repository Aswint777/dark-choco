const order = require("../../model/orderModel");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const wallet = require("../../model/walletModel");
const user = require("../../model/userModel");

const getAdminOrderManagement = async (req, res) => {
  try {
    const statusesToFind = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "canceled",
      "rejected",
    ];

    const orderList = await order.find({ status: { $in: statusesToFind } });
    console.log(orderList);
    console.log(orderList.status, "status");
    const totalSum = await order.aggregate([
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$total" },
        },
      },
    ]);
    const sum = totalSum[0].totalSum;
    console.log(sum, "totalSum");

    const sumOfCod = await order.aggregate([
      {
        $match: { paymentMode: "cod" }, // Filter documents where paymentMode is "cod"
      },
      {
        $group: {
          _id: null, // Group all documents into a single group
          totalSum: { $sum: "$total" }, // Calculate the sum of the "total" field
        },
      },
    ]);
    const codsum = sumOfCod[0].sumOfCod;
    res.render("adminViews/adminOrderManagement", { orderList, sum, codsum });
  } catch (error) {
    console.log(error);
  }
};

const adminOrderDetails = async (req, res) => {
  const { _id } = req.query;
  console.log(_id);
  const details = await order.findOne({ _id: _id });
  console.log(details);
  res.render("adminViews/adminOrderDetails", { details });
};

const updateStatus = async (req, res) => {
  try {
    // const token = req.cookies.loginToken;
    // const data = jwt.verify(token, process.env.SECRET_KEY);
    // const { userId } = data;

    console.log(req.body, "update status ");
    const { _id, status } = req.body;
    const statusUpdate = await order.findOneAndUpdate(
      { _id: _id },
      { $set: { status: status } },
      { new: true }
    );
    console.log(status, "llklklkkk");
    res.json({ status, success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const returnProductList = async (req, res) => {
  try {
    const statusesToFind = [
      "return request",
      "return approved",
      "return rejected",
      "pickup completed",
      "returned",
    ];

    let query = req.query;
    console.log(query, "yeeeeeeeeeeeeeeeeees");

    var i = 0;
    const page = parseInt(req.query.page) || 1;
    const count = await order.find({ status: { $in: statusesToFind } }).count();
    const pageSize = 3;
    const totalOrder = Math.ceil(count / pageSize);
    const skip = (page - 1) * pageSize;
    let returnList;
    if (req.query.date) {
      console.log(req.query);
      const latest = await order
        .find({ status: { $in: statusesToFind } })
        .sort({
          date: Number(req.query.date),
        }); //{} {another:true,chocolate:true}

      console.log(latest);
      res.json({ latest });
    } else if (req.query.searchQuery) {
      console.log(
        req.query.searchQuery,
        "lllllllllllllllllllllllllllllllllllllllll"
      );
      returnList = await order.find({
        status: { $regex: req.query.searchQuery, $options: "i" },
      });
      const query = req.query.searchQuery;
      res.render("adminViews/returnProductList", {
        returnList,
        query,
        totalOrder,
        pageSize,
        page: page,
      });
    } else {
      returnList = await order
        .find({ status: { $in: statusesToFind } })
        .skip(skip)
        .limit(pageSize);
      console.log(returnList);
      res.render("adminViews/returnProductList", {
        returnList,
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

const returnProductStatus = async (req, res) => {
  try {
    console.log("haaai");
    const { _id, status } = req.body;
    console.log(_id, status);
    const statusUpdate = await order.findOneAndUpdate(
      { _id: _id },
      { $set: { status: status } },
      { new: true }
    );
    console.log(statusUpdate, "status update");
    let myWallet;
    if (statusUpdate.status == "returned") {
      myWallet = await wallet.findOne({ userData: statusUpdate.userId });
      console.log(myWallet, "mywallet");
      console.log(statusUpdate.total);
      if (myWallet) {
        myWallet = await wallet.findOneAndUpdate(
          { userData: statusUpdate.userId },
          { $inc: { walletAmount: statusUpdate.total } },
          { new: true }
        );
      } else {
        const newTransaction = {
          amount: statusUpdate.total,
          type: "credit",
          orderData: new mongoose.Types.ObjectId(statusUpdate._id),
        };

        myWallet = await wallet.create({
          userData: statusUpdate.userId,
          walletAmount: statusUpdate.total,
          transactions: newTransaction,
        });
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

const returnListFilter = async (req, res) => {
  try {
    let query = req.query;
    console.log(query, "yeeeeeeeeeeeeeeeeees");

    var i = 0;
    const page = parseInt(req.query.page) || 1;
    const count = await order.find().count();
    const pageSize = 3;
    const totalOrder = Math.ceil(count / pageSize);
    const skip = (page - 1) * pageSize;
    // const user = await Category.find().skip(skip).limit(pageSize)

    // if (Object.keys(query).length === 0){
    //     const category = await Category.find({},{categoryDescription:0})
    //     res.render('adminViews/categoryList',{category,query:''})
    // }
    if (req.query.date) {
      console.log(req.query);
      const latest = await order.find().sort({ date: Number(req.query.date) }); 

      console.log(latest);
      res.json({ latest });
    } else if (req.query.searchQuery) {
      try {
        console.log(
          req.query.searchQuery,
          "lllllllllllllllllllllllllllllllllllllllll"
        );
        const category = await order.find({
          category: { $regex: req.query.searchQuery, $options: "i" },
        });
        const query = req.query.searchQuery;
        res.render("adminViews/categoryList", {
          category,
          query,
          totalOrder,
          pageSize,
          page: page,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      const category = await Category.find({}, { categoryDescription: 0 })
        .skip(skip)
        .limit(pageSize);
      res.render("adminViews/categoryList", {
        category,
        query: "",
        totalOrder,
        pageSize,
        page: page,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAdminOrderManagement,
  adminOrderDetails,
  updateStatus,
  returnProductList,
  returnProductStatus,
  // returnListFilter
};
