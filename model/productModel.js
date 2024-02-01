const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { array } = require("../middleware/multer");


const productSchema = new mongoose.Schema({
    stock: {
        type:String ,
        required:true,
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
        required : true,

      },
      image2 : {
        type : String,
        required : true,

      },
      image3 : {
        type : String,
        required : true,

      },
      category :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"category",
        required : true,
      },
      status : {
        type : Boolean,
        default : true
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
    required : true,
    min: 0,
  },
  amount:{
    type:Number,
    required : true,
    min: 1,
    
  },
  markup : {
    type:Number,
    required : true,
    min: 1,
  }
  // image4 :[
  //   {
  //     type:String
  //   }
  // ]
  
    
});

const product = mongoose.model("product", productSchema);
module.exports = product