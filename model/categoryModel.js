const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    category : {
        type : String,
        unique : true,
        required : true,
        trim : true
    },
    categoryDescription : {
        type : String,
        required :true
    },
    date : {
        type : Date,
        default : new Date()
    },
    status :{
        type:Boolean,
        default:true
    },
    offerRate :{
        type : Number,
    },
    count : {
        type : Number,
        default : 0
    }
})


const Category = mongoose.model('category',categorySchema)
module.exports = Category  