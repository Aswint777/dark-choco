const product = require("../../model/productModel");
const jwt = require("jsonwebtoken");
const cart = require("../../model/cartModel");
const user = require("../../model/userModel");
const { default: mongoose } = require("mongoose");
const wishlist = require('../../model/wishListModel')

const productPage = async (req, res) => {
  try {
    console.log('hloooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
    const token = req.cookies.loginToken;
    const datas = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = datas;
    console.log("product page here -------------------- ");
    const { id } = req.params;
    const data = await product.findOne({ _id: id }).populate("category");
    const productInUserWishlist = await wishlist.exists({ userData: userId, "products.product_id": id });
    console.log(productInUserWishlist,'productInUserWishlist')
    res.render("userViews/productPage", { data, userAuth: true ,productInUserWishlist });
  } catch (error) {
    console.log(error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    console.log(userId, "jjjjjjjj");
    const { _id } = req.body;
    const productPrice = await product.findOne({ _id: _id });
    console.log(productPrice, "iiiiiiiii");
    const price = productPrice.amount;
    console.log(price, "i got the price");

    let addCart;
    const checkCart = await cart.findOne({ userData: userId });
    console.log(checkCart);
    if (checkCart) {
      addCart = await cart.findOneAndUpdate(
        {
          userData: new mongoose.Types.ObjectId(userId),
          "products.product_id": { $ne: _id },
        },
        {
          $addToSet: {
            products: { product_id: _id, quantity: 1, oneProductTotal: price },
          },
        },
        { new: true }
      );
    } else {
      addCart = await cart.create({
        products: [{ product_id: _id, quantity: 1, oneProductTotal: price }],
        userData: userId,
      });
      console.log(addCart);
    }
    res.json({ _id });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  productPage,
  addToCart,
};
