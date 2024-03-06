const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    walletAmount : {
        type : Number,
        default : 0
    },
   
    userData :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"userData",
        required : true,
        unique : true
    },
    transactions: [
        {
        //   transaction_id: {
        //     type: Number,
        //     // unique: true,
        //   },
          amount: {
            type: Number,
            // required: true,
          },
          type: {
            type: String,
            enum: ["credit", "debit"],
            // required: true,
          },
        //   description: {
        //     type: String,
        //     required: true,
        //   },
          orderData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'order',
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
})

const wallet = mongoose.model('wallet',walletSchema)
module.exports = wallet