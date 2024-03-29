const Address = require("../../model/addressModel");
const jwt = require("jsonwebtoken");
const cart = require("../../model/cartModel");
const products = require("../../model/productModel");
const order = require("../../model/orderModel");
const { default: mongoose, Error } = require("mongoose");
const user = require("../../model/userModel");
const product = require("../../model/productModel");
const Razorpay = require('razorpay');
const razorPay = require("../helperFunction/razorPay");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("console");
const wallet = require('../../model/walletModel');
const Category = require("../../model/categoryModel");




// var instance = new Razorpay({
//   key_id: 'rzp_test_9JEC6JyecFZzL8',
//   key_secret:'cfzVG1hJT34TiLqaITY9I4u4',
// });

// async function generateRazorPay (id,total){
//   console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj')
//   console.log(total,id,'razorPay total')
//   var options = {
//     amount: total,  
//     currency: "INR",
//     receipt: ""+id
//   };
//   instance.orders.create(options, function(err, order) {
//     console.log(order);
//   });

// }



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
      .populate("products.product_id","-quantity");

    // console.log(cartData, "dgjdfhjdkjds");
    // console.log(cartData.products.product_id,"populated the product")
    
   let mapQuantity= cartData.products.map(async(pro)=>{
      console.log(pro,"before updation")
      const decrimentProductQuantity = await product.findOneAndUpdate({_id: pro.product_id._id},{$inc:{quantity:-pro.quantity}},{new:true})
      console.log(decrimentProductQuantity,'quantity dicriment is here')
    })
    const cartDetails = cartData.products;
    // console.log(cartDetails, "cartDetails");
    let orderProductDetails = [];
    for (let i = 0; i < cartDetails.length; i++) {
      let productFinal = cartDetails[i].product_id.toObject();
      let destructuredProduct = Object.assign(
        {},
        { quantity: cartDetails[i].quantity },
        productFinal
      );
      
      orderProductDetails.push(destructuredProduct);
      // console.log(cartDetails.length,'iii')
    }
    // console.log(orderProductDetails.length);

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
    console.log(total,typeof(total),'total');         
    // if(paymentMethod == "cod" && total > 1000 ){
    //   console.log('cod cant reach')
    //   throw Error('Sorry, cash on delivery is not available for orders exceeding $1000. Please choose an alternative payment method during checkout.')
    // }

    if ( paymentMethod == "cod"){
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
    if(orderData){

      const id = orderData._id;
////////////////////////////////////////////////////////////////////////////////////////////////////
     const products = cartData.products;

      for (const cartProduct of products) {
        const productId = cartProduct.product_id;
        const productQuantity = cartProduct.quantity;

        await product.updateOne({ _id: productId }, { $inc: { count: productQuantity } });

        // Get the categories for the product
        const categoryProduct = await product.findById(productId);
        const productCategories = categoryProduct.category;

        // Iterate through each category of the product
            // Update count for the category
            await Category.updateOne({ _id: productCategories }, { $inc: { count: productQuantity } });
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
        await cart.findOneAndDelete({userData:userId})
        res.json({ success : true ,id: id });
    }

    //////// RazorPay /////////////////////////////////////////
    }else if( paymentMethod == "razorPay"){
      console.log('haaaaaaaaaaaaaaaaaaaaaai')
      // console.log('razer pay',id)
      // var instance = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_SECRET' })
      const options = {
        amount: total,  // amount in the smallest currency unit
        currency: "INR",
        receipt:  crypto.randomBytes(10).toString("hex"), 
      };
      console.log(options,'options')
     
     await razorPay
                   .createRazorPayOrder(options)
                   .then((createOrder)=>{
                    console.log(createOrder,'.......................................m');
                    res.json({online:true,createOrder,options})
                   })
                   .catch((err)=>{
                    console.error('Error creating Razorpay order:', err);
        res.status(500).json({ error: 'Error creating Razorpay order' });
                   })

      
    }else if( paymentMethod == "myWallet"){
      console.log('mlm');
      const myWallet = await wallet.findOne({userData:userId})
      if (myWallet){
        if (myWallet.walletAmount < total){
          throw Error("User doesn't have enough money")
        }else{
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
          if(orderData){
            const  newTransaction = {
              amount : orderData.total,
              type : 'debit',
              orderData :new mongoose.Types.ObjectId(orderData._id),
          }

          const updateWalletData = await wallet.updateOne(
            { userData: userId }, // Filter condition
            { 
              $push: { transactions: newTransaction }, // Push newTransaction into transactions array
              $inc: { walletAmount: -total } // Decrement walletAmount by total
            },
            { new: true } // Set {new: true} to return the updated document
          );
          

          const products = cartData.products;

      for (const cartProduct of products) {
        const productId = cartProduct.product_id;
        const productQuantity = cartProduct.quantity;

        await product.updateOne({ _id: productId }, { $inc: { count: productQuantity } });

        // Get the categories for the product
        const categoryProduct = await product.findById(productId);
        const productCategories = categoryProduct.category;

        // Iterate through each category of the product
            // Update count for the category
            await Category.updateOne({ _id: productCategories }, { $inc: { count: productQuantity } });
    }
            const id = orderData._id;
              const deleteCart = await cart.findOneAndDelete({userData:userId})
              res.json({ success : true ,id: id });
          }

        }
        console.log('wallet is here')
      }else{
        const createWallet = await wallet.create({userData: userId,})
        throw Error('your Wallet is empty')
      }
    }

    // console.log(id);
  } catch (error) {
    console.log(`error in place order ${error.message}`);
    res.json({success:false , error:error.message});

  }
};




const razorPayHandler = async(req,res)=>{
  try {
    console,log('handling started')
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;

    const cartData = await cart
      .findOne({ userData: userId })
      .populate("products.product_id","-quantity");

    // console.log(cartData, "dgjdfhjdkjds");
    // console.log(cartData.products.product_id,"populated the product")
    
   let mapQuantity= cartData.products.map(async(pro)=>{
      const decrimentProductQuantity = await product.findOneAndUpdate({_id: pro.product_id._id},{$inc:{quantity:-pro.quantity}},{new:true})
     
    })
    const cartDetails = cartData.products;
    let orderProductDetails = [];
    for (let i = 0; i < cartDetails.length; i++) {
      let productFinal = cartDetails[i].product_id.toObject();
      let destructuredProduct = Object.assign(
        {},
        { quantity: cartDetails[i].quantity },
        productFinal
      );
      
      orderProductDetails.push(destructuredProduct);
    }

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

    const orderAddress = addressData.addressData[0];

    const Quantity = await cart.aggregate([
      { $match: { userData: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$products" },
      { $group: { _id: null, total: { $sum: "$products.quantity" } } },
    ]);
    const totalQuantity = Quantity[0]?.total;

  
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
    if(orderData){

      const products = cartData.products;

      for (const cartProduct of products) {
        const productId = cartProduct.product_id;
        const productQuantity = cartProduct.quantity;

        await product.updateOne({ _id: productId }, { $inc: { count: productQuantity } });

        // Get the categories for the product
        const categoryProduct = await product.findById(productId);
        const productCategories = categoryProduct.category;

        // Iterate through each category of the product
            // Update count for the category
            await Category.updateOne({ _id: productCategories }, { $inc: { count: productQuantity } });
    }

      const _id = orderData._id;
        const deleteCart = await cart.findOneAndDelete({userData:userId})
        console.log('online payment success ...................................')
        res.json({ success : true ,_id: _id });
    }

    
    } catch (error) {
    console.log(`error in place order ${error}`);
  }

}





module.exports = {
  getCheckOutPage,
  placeOrder,
  razorPayHandler
};
