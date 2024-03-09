const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products :[
        {
            quantity : {
                type : Number,
                min :1,
                
            },
            product_id :{
                type : mongoose.Schema.Types.ObjectId,
                ref:"product",
                required : true,
                
            },
            oneProductTotal:{
                type : Number,

            }
        }
    ],
    couponOffer : {
        type : Number
    },
    couponId : {
        type : ObjectId
    },
    userData :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"userData",
        required : true,
        unique : true
    },
})

const cart = mongoose.model('cart',cartSchema)
module.exports = cart