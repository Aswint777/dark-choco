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
    const sum = totalSum[0]?.totalSum;
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

const filterGraph = async(req,res)=>{
  try {
    const {filter} = req.body

    const now = new Date();
    let  customize 
    if (filter === 'lastDay') {  // Changed from 'lastDay' to 'lastWeek'
      console.log('Filter for last day');
        customize = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Calculate 7 days ago
    }else if (filter == 'lastWeek' ){
      customize = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate 7 days ago
    }else if (filter == 'lastMonth' ){
       customize = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Calculate 7 days ago
    }else if (filter == 'lastYear' ){
      customize = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Calculate 7 days ago
    }

      const result = await order.aggregate([
        {
          $match: {
            date: {
              $gte: customize, // Match orders with a date greater than or equal to 7 days ago
              $lt: now // Match orders before the current time
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalSum: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } }, // Sort by date in ascending order
      ]);
      res.json({result})
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  adminDashboard,
  filterGraph
};
