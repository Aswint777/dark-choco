const product = require("../../model/productModel");
const cart = require("../../model/cartModel");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const GetCart = async (req, res) => {
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const cartData = await cart
      .findOne({ userData: userId })
      .populate("products.product_id");
    console.log(cartData);
    const cartTotal = await cart.aggregate([
      { $match: { userData: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$products" },
      { $group: { _id: null, total: { $sum: "$products.oneProductTotal" } } },
    ]);
    console.log(cartTotal);
    const subTotal = cartTotal[0]?.total;
    const tax = (subTotal * 3) / 100;
    const total = subTotal + tax;
    if (cartData) {
      res.render("userViews/cart", {
        cartData,
        subTotal,
        tax,
        total,
        status: true,
      });
    } else {
      res.render("userViews/cart", {
        cartData,
        subTotal,
        tax,
        total,
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const cartUpdateQuantity = async (req, res) => {
  try {
    console.log("tttettttttttttt");
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const { quantity, id } = req.body;
    console.log(quantity, id);
    const currentProduct = await product.findOne(
      { _id: id },
      { amount: 1, _id: 0, quantity: 1 }
    );
    let price;
    if (currentProduct.quantity < quantity) {
      throw Error(`only ${currentProduct.quantity} is available`);
    }
    if (currentProduct) {
      price = currentProduct.amount;
      console.log(price);
    }
    console.log(currentProduct, "hiiiiiiiii");
    const oneProductTotal = price * quantity;
    console.log(oneProductTotal);
    const updatedCart = await cart.findOneAndUpdate(
      {
        userData: new mongoose.Types.ObjectId(userId),
        "products.product_id": new mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          "products.$.quantity": quantity,
          "products.$.oneProductTotal": oneProductTotal,
        },
      },
      { new: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const deleteCartProduct = async (req, res) => {
  try {
    console.log(req.body, "kuuu");
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const { id } = req.body;
    const result = await cart.updateOne(
      { userData: userId },
      { $pull: { products: { _id: new mongoose.Types.ObjectId(id.trim()) } } }
    );
    console.log(result, "result");
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const proceedToCheckout = async (req, res) => {
  try {
    console.log(req.body, "dfkjdknfj");
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const { cartId } = req.body;
    const proceed = await cart.findOne({ userData: userId, _id: cartId });
    console.log(proceed);
    console.log(proceed.products.length, "kookkkkkkk");
    if (proceed.products.length < 1) {
      throw Error("cart is empty");
    }
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

module.exports = {
  GetCart,
  cartUpdateQuantity,
  deleteCartProduct,
  proceedToCheckout,
};
