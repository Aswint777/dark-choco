const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
    products :[
        {
           
            product_id :{
                type : mongoose.Schema.Types.ObjectId,
                ref:"product",
                // required : true,
                
            },
           
        }
    ],
   
    userData :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"userData",
        required : true,
        unique : true
    },
})

const wishList = mongoose.model('wishList',wishListSchema)
module.exports = wishList