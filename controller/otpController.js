const { config } = require("dotenv");
const nodemailer = require("nodemailer");
const userOtpVarification = require('../services/nodemailer')
const Otp = require('../model/otpModel')
const otpForm = require('../controller/helperFunction/otp')
const otpController = require('../controller/helperFunction/otp')
const User = require('../model/userModel')
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret code", {
    expiresIn: maxAge,
  });
};

const otpPagePost = async (req,res)=>{
    const {email,otp} = req.body
    // console.log(email,otp,)
    try{
        const otpVarify = await Otp.findOne({ email });
        console.log(otpVarify.otp,'back')
        console.log(otp,"good")
        if (otp == otpVarify.otp){
            console.log(otp,otpVarify.otp)
            const user = await User.create({ firstName:otpVarify.firstName, secondName:otpVarify.secondName, email:otpVarify.email, password:otpVarify.password });
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
            res.cookie("loginToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.json({success:true});
        }
    }catch(error){
        res.status(400).json({ error: error.message });
    }
} 

const resendOtp = async(req,res) => {
    console.log("resend otp called");
    const {email} = req.body
    const resend = await Otp.findOne({ email });
    await Otp.deleteOne({email})
   
    console.log(resend)
    await otpController.main(resend.email,resend.firstName,resend.secondName,resend.password)
    res.json({success : true})
}

module.exports = {
    otpPagePost,
    resendOtp
}