const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const { isEmail } = require("validator");

const forgotSchema= new mongoose.Schema({
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
    date :{
        type : Date,
        default : new Date()
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: '5m',
    }  
})

// forgotSchema.pre("save", async function (next) {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   });

const restPassword = mongoose.model('forgot',forgotSchema)
module.exports = restPassword