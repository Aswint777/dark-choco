
const Address = require("../../model/addressModel");
const jwt = require("jsonwebtoken");
const cart = require('../../model/cartModel')
const products = require('../../model/productModel')

const getCheckOutPage = async (req,res)=>{
    try{
        const token = req.cookies.loginToken;
            const data = jwt.verify(token, process.env.SECRET_KEY);
            const { userId } = data;
            const addressList = await Address.find({userData:userId})
            const {subTotal,tax,total,cartId} = req.query
            console.log(cartId)
            const cartData = await cart.findOne({_id:cartId}).populate("products.product_id");
            console.log(cartData.products,'kkkkkkkkkk')
        res.render('userViews/checkOutPage',{addressList,subTotal,tax,total,cartId,cartData})
    }catch(error){
        console.log(error)
    }
}

const placeOrder = async (req,res)=>{
    console.log('hereeeee')
    console.log(req.body)
    const {address,paymentMethod}= req.body 
    console.log(address,'dfhgdjfhkdfjdfk')
    res.json({success : true})
    
}

module.exports = {
    getCheckOutPage,
    placeOrder
}