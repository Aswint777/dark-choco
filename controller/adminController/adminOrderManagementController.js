const order = require('../../model/orderModel')
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const wallet = require('../../model/walletModel')
const user = require('../../model/userModel')


const getAdminOrderManagement = async(req,res)=>{
    try {
        const statusesToFind = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "canceled",
            "rejected",  
        ];
          
        const orderList = await order.find({ status: { $in: statusesToFind } })
        console.log(orderList)
        console.log(orderList.status, 'status')
        res.render('adminViews/adminOrderManagement',{orderList})
    } catch (error) {
        console.log(error)
    }
   
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

const returnProductList = async (req,res)=>{
    try {
        const statusesToFind = [
            "return request",
            "return approved",
            "return rejected",
            "pickup completed",
            "returned"
          ];
          
        const returnList = await order.find({ status: { $in: statusesToFind } })
        console.log(returnList);
        res.render('adminViews/returnProductList',{returnList})
    } catch (error) {
        console.log(error)
    }
}

const returnProductStatus = async (req,res)=>{
    try {
        console.log('haaai');
        const {_id,status} = req.body
        console.log(_id,status)
        const statusUpdate = await order.findOneAndUpdate({_id:_id},{$set:{status:status}},{new:true})
        console.log(statusUpdate,'status update');
        let myWallet
        if (statusUpdate.status == 'returned'){
            myWallet = await wallet.findOne({ userData:statusUpdate.userId });
            console.log(myWallet, "mywallet");
            console.log(statusUpdate.total);
            if (myWallet) {
              myWallet = await wallet.findOneAndUpdate(
                { userData:statusUpdate.userId },
                { $inc: { walletAmount: statusUpdate.total } },
                { new: true }
              );
            } else {
              const newTransaction = {
                amount: statusUpdate.total,
                type: "credit",
                orderData: new mongoose.Types.ObjectId(statusUpdate._id),
              };
    
              myWallet = await wallet.create({
                userData: statusUpdate.userId,
                walletAmount: statusUpdate.total,
                transactions: newTransaction,
              });
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAdminOrderManagement,
    adminOrderDetails,
    updateStatus,
    returnProductList,
    returnProductStatus
}