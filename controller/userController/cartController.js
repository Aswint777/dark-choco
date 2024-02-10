const product = require ('../../model/productModel')
const cart = require ('../../model/cartModel')
const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');



const GetCart = async (req,res)=>{
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const {userId}= data 
    const cartData = await cart.findOne({userData:userId}).populate('products.product_id')
    console.log(cartData)
    
    const cartTotal = await cart.aggregate([
        { $match: { userData: new mongoose.Types.ObjectId(userId) } }, // Match the cart for the given user
        { $unwind: "$products" }, // Deconstruct the products array
        {
            $lookup: {
                from: "products", // Name of the product collection
                localField: "products.product_id",
                foreignField: "_id",
                as: "productInfo"
            }
        },
        { $unwind: "$productInfo" }, // Deconstruct the productInfo array
        {
            $group: {
                _id: "$_id", // Group by cart _id
                userData: { $first: "$userData" }, // Preserve userData field
                products: { $push: "$products" }, // Preserve products array
                productInfo: { $push: "$productInfo" }, // Preserve productInfo array
                totalAmount: { $sum: "$productInfo.amount" }
            }
        }
    ])
    console.log(cartTotal[0].totalAmount,'qqqqqqqqqqqqqqqqqq')
    console.log(cartData.products.length,'qqqqqqqqqqqqqqqqqq')

    const subTotal = cartTotal[0].totalAmount
    const tax = subTotal * 3/100
    const total = subTotal+tax

    res.render('userViews/cart',{cartData,subTotal,tax,total})
}

const cartUpdateQuantity = async (req,res)=>{
    console.log('tttettttttttttt')
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const {userId}= data 
    const {quantity,id} = req.body
    // console.log(quantity,id)
    const updatedCart = await cart.findOneAndUpdate(
        { userData: new mongoose.Types.ObjectId(userId), 'products.product_id': new mongoose.Types.ObjectId(id) },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
    );

        console.log(updatedCart,'ldkdlkdfl')

    // const cartQuantity = await cart.findByIdAndUpdate({userData: new mongoose.Types.ObjectId(userId),{}})


}


module.exports = {
    GetCart,
    cartUpdateQuantity
}