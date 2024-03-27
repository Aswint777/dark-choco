const User = require("../model/userModel");
const Admin = require("../model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { main } = require("./helperFunction/otp");
require("dotenv").config();
const otp = require('../model/otpModel')
const product = require('../model/productModel')


// handle errors
handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //duplicate errors
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret code", {
    expiresIn: maxAge,
  });
};
// get for home
const home = async (req, res) => {
  const productList = await product.find({status:true}).populate('category').sort({date:-1}).limit(4)
  console.log(productList)
  res.render("userViews/home", { userAuth: true ,productList});
};

// get for userLogin
const userLogin = (req, res) => {
  res.render("userViews/userLogin");
};

// get for user SignIn
const userSignIn = (req, res) => {
  res.render("userViews/userSignIn");
};

// post for loginPost
const userLoginPost = async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // const user = await User.login(email, password);
    if(!user){
      throw Error("Enter the valid email")
    }
    else if (user.status === false) {
      throw Error("Your account is blocked")
    }else{
      const auth = await bcrypt.compare(password, user.password);
      if (!auth) {
        throw Error("Check Your Password")
      }else{
        console.log("password checked");
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        res.cookie("loginToken", token, {
          httpOnly: true,
        });
        res.json({success:true})
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    // res.json({success:false , error:error.message});
  }
};

// post for new user
const newUser = async function (req, res) {
  const { firstName, secondName, email, password } = req.body;

  try {
    const data = await otp.findOne({email:email})
    if(password.length < 6 ){
      throw Error('password is not strong')
    }else if (data){
      await otp.deleteOne({email:email})
    }

    await main(email,firstName,secondName,password)
    res.json({ success : true  });
  } catch (error) {
    // const errors = handleErrors(errors)
    console.log(error, "error in singIn");
    // res.status(400).send("error, user not created ");
    res.json({success:false , error:error.message});
  }
  console.log("reached");
};

// fet for otp page
const getOtp = (req, res) => {
  const {email} = req.query;
  res.render("userViews/otp",{ email});
};

// get for admin login
const adminLogin = (req, res) => {
  res.render("adminViews/adminLogin");
};

// post for adminLogin
const adminLoginPost = async (req, res) => {
  console.log("admin page ");
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const admin = await Admin.findOne({ email:email });
    // await new Admin({
    //   email:'aswinspot007@gmail.com',
    //   password:'Aswin@123'
    // }).save()
    if (admin) {
      const auth = await bcrypt.compare(password, admin.password);
      if (auth) {
        console.log("password checked");
        const token = jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY);
        
        res.cookie("adminLoginToken", token, {
          httpOnly: true,
        });
        res.json({ admin: admin });
      }
    }
  } catch (error) {
    console.log(`adming login post err ${error}`);
    res.status(400).json({ error: error.message });
  }
};

//user log Out
const userLogOut = (req, res) => {
  console.log("logout");
  res.clearCookie('loginToken')
  res.redirect("/");
};
const adminLogOut = (req, res) => {
  console.log("logout");
  res.clearCookie('adminLoginToken')
  res.redirect("/");
};

//about page 
const about = (req,res)=>{
  res.render('userViews/about', { userAuth: true })
}

// 404 page 

const get404Page = (req,res)=>{
  res.render('partial/404Page')
} 

module.exports = {
  home,
  userLogin,
  userSignIn,
  newUser,
  userLoginPost,
  getOtp,
  adminLogin,
  adminLoginPost,
  userLogOut,
  adminLogOut,
  about,
  get404Page
};
