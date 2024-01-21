const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const productSchema = new mongoose.Schema({
    stock: {
        type:Number ,
        required:true,
        trim: true,
      },
      rating: {
        type: String,
        required:true,
        trim: true,
      },
      review: {
        type: String,
        required:true,
        unique: true,
        trim: true,
      },
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
        type : String,
        required : true,
      },
      status : {
        type : Boolean,
        default : true
      },
      categoryDescription : {
        type : String,
        required :true
    },
    
});

const product = mongoose.model("product", productSchema);
module.exports = product