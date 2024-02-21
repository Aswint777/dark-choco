const Address = require("../../model/addressModel");
const jwt = require("jsonwebtoken");
const cart = require("../../model/cartModel");
const products = require("../../model/productModel");
const order = require("../../model/orderModel");
const { default: mongoose } = require("mongoose");
const user = require("../../model/userModel");

const getCheckOutPage = async (req, res) => {
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const addressList = await Address.find({ userData: userId });
    const { subTotal, tax, total, cartId } = req.query;
    const cartData = await cart
      .findOne({ _id: cartId })
      .populate("products.product_id");
    res.render("userViews/checkOutPage", {
      addressList,
      subTotal,
      tax,
      total,
      cartId,
      cartData,
    });
  } catch (error) {
    console.log(error);
  }
};

const placeOrder = async (req, res) => {
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;

    const cartData = await cart
      .findOne({ userData: userId })
      .populate("products.product_id", "-quantity");

    console.log(cartData, "dgjdfhjdkjds");
    const cartDetails = cartData.products;
    console.log(cartDetails, "cartDetails");
    let orderProductDetails = [];
    for (let i = 0; i < cartDetails.length; i++) {
      let productFinal = cartDetails[i].product_id.toObject();
      let destructuredProduct = Object.assign(
        {},
        { quantity: cartDetails[i].quantity },
        productFinal
      );
      // let a = {quantity:cartDetails[i].quantity,...productFinal}
      console.log(destructuredProduct, "happy");

      orderProductDetails.push(destructuredProduct);
      // console.log(cartDetails.length,'iii')
    }
    console.log(orderProductDetails.length);

    const userDetails = await user.findOne({ _id: userId });

    const { address, paymentMethod, subTotal, tax, total } = req.body;

    const addressData = await Address.findOne(
      {
        userData: userId,
        addressData: {
          $elemMatch: { _id: new mongoose.Types.ObjectId(address.trim()) },
        },
      },
      {
        "addressData.$": 1,
      }
    );

    // console.log(addressData.addressData[0],'qqqqqqqqqqqqqqqqqqqq')
    const orderAddress = addressData.addressData[0];

    const Quantity = await cart.aggregate([
      { $match: { userData: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$products" },
      { $group: { _id: null, total: { $sum: "$products.quantity" } } },
    ]);
    const totalQuantity = Quantity[0]?.total;
    // console.log(totalQuantity, 'totalQuantity');

    console.log(orderProductDetails, "kkkkkk");

    const orderData = await order.create({
      subTotal: subTotal,
      tax: tax,
      total: total,
      paymentMode: paymentMethod,
      quantity: totalQuantity,
      userData: new mongoose.Types.ObjectId(userId),
      address: orderAddress,
      userDetails: userDetails,
      products: orderProductDetails,
    });
    if (orderData){
      const deleteCart = await cart.findOneAndDelete({userData:userId})
    }
    console.log(orderData, "dfhgdjfhkdfjdfk");
    const id = orderData._id;
    console.log(id);
    res.json({ id: id });
  } catch (error) {
    console.log(`error in place order ${error}`);
  }
};

module.exports = {
  getCheckOutPage,
  placeOrder,
};
