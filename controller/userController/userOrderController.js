const order = require("../../model/orderModel")
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const wallet = require("../../model/walletModel");




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
    // console.log(_id)
    const details = await order.findOne({_id : _id})
    // console.log(details)
    res.render('userViews/userOrderDetailsPage',{details})
}

const cancelOrder = async (req,res)=>{
    try{
        const token = req.cookies.loginToken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const { userId } = data; 
        if(userId){
            console.log(req.body)
            const { _id,method } = req.body 
            // console.log(_id )
            const orderDetails = await order.findOne({userData:userId,_id:_id})
            console.log(orderDetails)
           let myWallet 
            if(method == 'razorPay' || method == 'myWallet'){
                console.log('razorPay console')
                myWallet = await wallet.findOne({userData:userId})
                console.log(myWallet,'mywallet')
                console.log(orderDetails.total)
                if(myWallet){
                    myWallet = await wallet.findOneAndUpdate({userData:userId}, { $inc: { walletAmount: orderDetails.total } },{new:true})

                }else{
                    const  newTransaction = {
                        amount : orderDetails.total,
                        type : 'credit',
                        orderData :new mongoose.Types.ObjectId(orderDetails._id),

                    }

                    myWallet = await wallet.create({userData:userId,walletAmount:orderDetails.total,transactions:newTransaction})
                }
                
            }
            
            const cancel = await order.findOneAndUpdate({_id : _id } ,{$set:{status:"canceled"}},{new: true})
            console.log('haaaaaaaaaaaai');
            // console.log(cancel,'canceled')
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