const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



const productSchema = new mongoose.Schema({
    stock: {
        type:String ,
        // required:true,
        trim: true,
      },
      // rating: {
      //   type: String,
      //   required:true,
      //   trim: true,
      // },
      // review: {
      //   type: String,
      //   required:true,
      //   unique: true,
      //   trim: true,
      // },
      image1 : {
        type : String,
        // required : true,

      },
      image2 : {
        type : String,
        // required : true,

      },
      image3 : {
        type : String,
        // required : true,

      },
      category :{
        type : String,
        // required : true,
      },
     
      productDescription : {
        type : String,
        required :true
    },
    date : {
      type : Date,
      default : new Date()
  },
  quantity :{
    type:Number,
    // required : true,
    min: 0,
  },
  amount:{
    type:Number,
    // required : true,
    min: 1,
    
  },
  markup : {
    type:Number,
    // required : true,
    min: 1,
  }
  // image4 :[
  //   {
  //     type:String
  //   }
  // ]
  
    
});



const addressSchema = new mongoose.Schema({

        firstName: {
            type: String,
            // required: [true, "please enter the firstName"],
            
        },
        secondName: {
            type: String,
            // required: [true, "please enter the secondName"],
        },
        address: {
            type: String,
            // required: true,
            unique: true,  
        },
        country: {
            type: String,
            // required: [true, "please enter the email"],
            unique: true,
            trim: true,
            
        },
        state: {
            type: String,
            // required: true,
            
        },
        city: {
            type: String,
            // required: true,
        },
        pinCode: {
            type: Number,
            // required: true,
        },
        email: {
            type: String,
            // required: true,       
        },
        phoneNumber: {
            type: Number,
            // required: true, 
            
        },
    userData :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"userData",
        // required : true,
        unique : true
    },
  });
  
  
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
    //   required: [true, "first name is required"],
      trim: true,
    },
    secondName: {
      type: String,
    //   required: [true, "second name is required"],
      trim: true,
    },
    email: {
      type: String,
    //   required: [true, "please enter the email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, "please enter a valid email"],
    },
   
    date :{
      type : Date,
      default : new Date()
    },
    status :{
      type:Boolean,
      default:true
    },
    phoneNumber :{
      type : Number,
      min : 10,
      max : 15
    },
    address :{
      type:String
    },
    pinNumber : {
      type : Number
    }
  });
  



const orderSchema = new mongoose.Schema({
    subTotal: {
        type: Number,
      },
      shipping: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        min: 0,
      },
      status: {
        type: String,
        required: true,
        enum: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "canceled",
          "return request",
          "return approved",
          "return rejected",
          "pickup completed",
          "returned",
        ],
        default: "pending",
      },
      products: [productSchema],
      paymentMode: {
        type: String,
        required: true,
        enum: ["cashOnDelivery", "razorPay", "myWallet"],
      },
      address :addressSchema,
      user:userSchema,
      userData :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"userData",
        required : true,
        unique : true
    },
});


const order = mongoose.model('order',cartSchema)
module.exports = order