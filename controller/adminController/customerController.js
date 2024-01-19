
const User = require("../../model/userModel");



const customer = async (req,res)=>{
    

    const user = await User.find({},{password:0})
    // console.log(user)

    res.render('adminViews/customer',{user:user})
}

const SearchCustomer = async (req, res) => {
    const searchQuery = req.query.search || '';
    
    // Assuming you have a 'name' field in your user model
    const user = await User.find({ name: { $regex: new RegExp(searchQuery, 'i') } }, { password: 0 });
  
    res.render('adminViews/customer', { user, searchQuery });
  }

const manageUser = async(req,res)=>{
    console.log('hello world')
    const {_id }=req.body
    console.log(_id)
    const customer = await User.findOne({_id:_id})
    console.log(customer)
    let user
    if(customer.status === true){
         user = await User.updateOne({_id:_id},{$set:{status:false}})
    }else{
         user = await User.updateOne({_id:_id},{$set:{status:true}})
    }

   res.json(user)   
}





module.exports = {
    customer,
    manageUser,
    SearchCustomer
} 