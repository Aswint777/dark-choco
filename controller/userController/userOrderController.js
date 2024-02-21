const order = require("../../model/orderModel")
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");




const userOrderHistoryPage = async(req,res)=>{
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data; 
    console.log('dhfbvdkjfn')
    const orderHistory = await order.find({userData:userId})
    console.log(orderHistory)
    res.render('userViews/userOrderHistory',{orderHistory})
}


const userOrderDetails = async(req,res)=>{
    const {_id} = req.query
    console.log(_id)
    const details = await order.findOne({_id : _id})
    console.log(details)
    res.render('userViews/userOrderDetailsPage',{details})
}

module.exports = {
    userOrderHistoryPage,
    userOrderDetails
}