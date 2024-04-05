const Razorpay = require("razorpay");
require("dotenv").config();

module.exports = {
  createRazorPayOrder: (options) => {
    return new Promise((resolve, reject) => {
      const razorpay = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });
      const id = "" + options.receipt;
      const total = options.amount * 1000; //here -------------------------------------
      console.log(id, "mmmmmmmmmmmmmmm");
      console.log(total);

      const razorpayOrder = razorpay.orders.create({
        amount: total,
        currency: "INR",
        receipt: id,
      });
      resolve(razorpayOrder);
    });
  },
};
