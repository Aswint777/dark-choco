const order = require("../../model/orderModel");
const user = require("../../model/userModel");
const category = require("../../model/categoryModel");
const product = require("../../model/productModel");

const adminDashboard = async (req, res) => {
  try {
    const totalSum = await order.aggregate([
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$total" },
        },
      },
    ]);
    const sum = totalSum[0].totalSum;
    const customer = await user.find().count();
    const totalCategory = await category.find().count();

    const result = await order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSum: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date in ascending order
    ]);
    console.log(result, "total");
    const categoryCount = await category.find(
      {},
      { _id: 0, category: 1, count: 1 }
    );
    const bestProduct = await product
      .find()
      .sort({ count: -1 })
      .limit(10)
      .populate("category");
      const bestCategory = await category
      .find()
      .sort({ count: -1 })
      .limit(10)

    const orderCount = await order.find().count();
    res.render("adminViews/adminDashboard", {
      sum,
      customer,
      totalCategory,
      result,
      categoryCount,
      bestProduct,
      orderCount,
      bestCategory
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  adminDashboard,
};
