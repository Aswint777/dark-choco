const order = require('../../model/orderModel')
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");


const getAdminOrderManagement = async(req,res)=>{
    const orderList = await order.find()
    console.log(orderList)
    console.log(orderList.status, 'status')
    res.render('adminViews/adminOrderManagement',{orderList})
}

const adminOrderDetails = async (req,res)=>{
    const {_id} = req.query
    console.log(_id)
    const details = await order.findOne({_id : _id})
    console.log(details)
    res.render('adminViews/adminOrderDetails',{details})
}

const updateStatus = async (req,res)=>{
    try{

        // const token = req.cookies.loginToken;
        // const data = jwt.verify(token, process.env.SECRET_KEY);
        // const { userId } = data;
        
        console.log(req.body,'update status ')
        const {_id,status} = req.body
        const statusUpdate = await order.findOneAndUpdate({_id:_id},{$set:{status:status}},{new:true})
        console.log(status,'llklklkkk')
        res.json({status})
    }catch(error){
        res.json({ success: false, error: error.message });
    }

}

module.exports = {
    getAdminOrderManagement,
    adminOrderDetails,
    updateStatus
}