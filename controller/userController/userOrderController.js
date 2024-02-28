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

const cancelOrder = async (req,res)=>{
    try{
        const token = req.cookies.loginToken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const { userId } = data; 
        if(userId){
            console.log(req.body)
            const { _id } = req.body 
            console.log(_id )
            const cancel = await order.findOneAndUpdate({_id : _id } ,{$set:{status:"canceled"}},{new: true})
            console.log(cancel,'canceled')
            res.json({succuss : true})
        }
        
    }catch(error){
        console.log(error)
    }
    
}

module.exports = {
    userOrderHistoryPage,
    userOrderDetails,
    cancelOrder
}