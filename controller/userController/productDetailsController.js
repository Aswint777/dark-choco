const product = require('../../model/productModel')
const jwt = require("jsonwebtoken");
const cart = require ('../../model/cartModel')
const user = require('../../model/userModel');
const { default: mongoose } = require('mongoose');


const productPage = async (req,res)=>{
    // res.render('userViews/productPage')
    try{

        console.log('product page here -------------------- ')
        const {id} = req.params
      
        const data = await product.findOne({_id:id}).populate('category')
        
        res.render('userViews/productPage',{data,userAuth:true})
    }catch(error){
        console.log(error.message)
    }
}


const addToCart =async (req,res)=>{
    try{
        const token = req.cookies.loginToken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const {userId}= data 
        console.log(userId,'jjjjjjjj')

        let addCart
        const checkCart = await cart.findOne({userData:userId})
        console.log(checkCart)
        const {_id} = req.body
        if (checkCart){

            addCart = await cart.findOneAndUpdate(
                {userData:new mongoose.Types.ObjectId(userId), "products.product_id": { $ne: _id } },
                { $addToSet: {products:{ product_id: _id,quantity:1 }} },
                { new: true })
        }else{
           
            addCart = await cart.create(
                { products:[
                    { product_id:_id , quantity:1 }
                ],userData:userId})
            
            console.log(addCart)
        }
        res.json({_id})
    }catch(error){
        console.log(error)
    }
   

}








module.exports = {
    productPage,
    addToCart
}