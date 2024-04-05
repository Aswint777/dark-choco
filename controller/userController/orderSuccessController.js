const order = require("../../model/orderModel");

const getSuccessPage = async (req, res) => {
  //   try {
  // const token = req.cookies.loginToken;
  // const data = jwt.verify(token, process.env.SECRET_KEY);
  // const { userId } = data;
  console.log(req.query, "query");
  const { _id } = req.query;
  console.log(_id);
  const orderData = await order.findOne({ _id: _id });
  const total = orderData.total;
  console.log(total);
  res.render("userViews/orderSuccessPage", { total, _id });
  //   } catch (error) {}
};

module.exports = {
  getSuccessPage,
};
