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
const forgot  = require("./helperFunction/forgotPassword");
const restPassword = require('../model/forgotPasswordModel')

// const bcrypt = require("bcrypt");
// const { isEmail } = require("validator");





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
        if(otp != otpVarify.otp){
            throw Error('invalid otp')
        }else if (otp == otpVarify.otp){
            console.log(otp,otpVarify.otp)
            const user = await User.create({ firstName:otpVarify.firstName, secondName:otpVarify.secondName, email:otpVarify.email, password:otpVarify.password });
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
            res.cookie("loginToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.json({success:true});
        }
    }catch(error){
        // res.status(400).json({ error: error.message });
        res.json({success:false , error:error.message});
    
    }
} 

const resendOtp = async(req,res) => {
    console.log("resend otp called");
    const {email} = req.body
    console.log(email,'jassssssssssssssss')
    const resend = await Otp.findOne({ email });
    await Otp.deleteOne({email})
   
    console.log(resend)
    await otpController.main(resend.email,resend.firstName,resend.secondName,resend.password)
    res.json({success : true})
}


// forgot password otp page 

const forgotPassword = (req,res)=>{
    try{
        
        console.log('here it is ')
        res.render('userViews/forgotPassword')
    }catch(err){
        console.log(err,"rrrr")
    }
}
    
const forgotPasswordPost = async (req,res)=>{
    console.log('post forgot')
    const {email} = req.body
    try{
        const data = await User.find({email:email})

        const check = await restPassword.findOneAndDelete({email:email})
        console.log(check,'uuuaaaaa')

        console.log(data,'aaaaaaaaaaaaaaaaaaa')
        if(data.length == 0){
            throw Error('enter a Valid email')

        }else{
            await forgot(email)
        
            res.json({email})
        }
    }catch(error){
        res.status(400).json({ error: error.message });
    }
 
}

// forgot password otp varifying page

const forgotVarifyOtp = (req,res) =>{
    const {email}= req.params
    res.render('userViews/forgotVarifyOtp',{email})
}

const forgotVarifyOtpPost = async(req,res) =>{
    const {email,otp} = req.body
    try{

        const forgot = await restPassword.findOne({email:email})
        if (forgot.otp != otp){
            throw Error('otp is not matched')
        // let data    
        }else if (forgot.otp == otp){
            const  data = await User.findOne({email:email})
            res.json({data})
        }
    }catch(error){
        res.json({success:false , error:error.message});
    }
}

//set new password

const setNewPassword = (req,res) =>{
    const {email}= req.params
    console.log(email)
    res.render('userViews/setNewPassword',{email})
}

const setNewPasswordPost = async (req,res)=>{
    const {email,password} = req.body
    console.log(email,password)

    const salt = await bcrypt.genSalt();
    const NewPassword = await bcrypt.hash(password, salt);
    const data = await User.findOneAndUpdate({email:email},{$set:{password:NewPassword}})
    res.json({data})   
}

const resendForgotOtp = async(req,res) => {
    console.log("resend otp called");
    const {email} = req.body
    const resend = await restPassword.findOne({ email });
    await restPassword.deleteOne({email})
   
    console.log(resend)
    await forgot(email)
    console.log('Resend working')
    res.json({success : true})
}

module.exports = {
    otpPagePost,
    resendOtp,
    forgotPassword,
    forgotPasswordPost,
    forgotVarifyOtp,
    forgotVarifyOtpPost,
    setNewPassword,
    setNewPasswordPost,
    resendForgotOtp
}