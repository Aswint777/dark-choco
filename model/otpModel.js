const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({
    otp : {
        type : Number,
        required : true,
        trim : true,
        expiresAt: { type: Date, default: Date.now, expires: '5m' }
    },
    email : {
        type: String,
        required: [true, "please enter the email"],
        unique: true,
        trim: true,
        lowercase: true,
        // validate: [isEmail, "please enter a valid email"],
    },
    firstName: {
        type: String,
        required: [true, "first name is required"],
        trim: true,
    },
    secondName: {
        type: String,
        required: [true, "second name is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "please enter the password"],
        minLength: [6, "minimum password length is 6"],
    },
    date :{
        type : Date,
        default : new Date()
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: '5m',
    },
    status :{
        type:Boolean,
        default:true
    }


   
})


const otp = mongoose.model('otp',otpSchema)
module.exports = otp  