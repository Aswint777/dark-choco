const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    couponName: {
        type : String,
        required : true,
        unique : true ,
    },
    code: {
        type: String,
        required : true,
    },
    value: {
        type: Number,
        // required: true,
    },
    description : {
        type : String,

    },
    minimumPurchaseAmount : {
        type : Number,

    },
    maximumUses : {
        type : Number
    },
    createDate : {
        type : Date,
        default : new Date()
    },
    expiryDate : {
        type : Date
    }
      
})

const coupon = mongoose.model('coupon',couponSchema)
module.exports = coupon