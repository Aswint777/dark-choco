const User = require('../../model/userModel')
const jwt = require("jsonwebtoken");

const userProfile = async (req,res)=>{
 
        const token = req.cookies.loginToken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        console.log(data,'llllllllllllllllllllllllll')
        const {userId}= data
        console.log(userId,'ssssssssssssssssssss')
        const profile = await User.findOne({_id:userId})
        console.log(profile,"hlooo")


    res.render('userViews/userProfilePage',{profile})
}


module.exports = {
    userProfile
}