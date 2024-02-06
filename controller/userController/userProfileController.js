const User = require('../../model/userModel')
const jwt = require("jsonwebtoken");

const userProfile = async (req,res)=>{
 
        const token = req.cookies.loginToken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const {userId}= data      
        const profile = await User.findOne({_id:userId})
        console.log(profile)
    res.render('userViews/userProfilePage',{profile})
}

const userProfilePost = async (req,res)=>{
    try{
        console.log('edited .....................')
        console.log(req.body)
        const {firstName,secondName,email,phoneNumber,address,pinNumber} = req.body
        const obj = {
            firstName:firstName,
            secondName:secondName,
            phoneNumber:phoneNumber,
            address:address,
            pinNumber:pinNumber
        }
        const data = await User.findOneAndUpdate({ email: email }, { $set: obj }, { upsert: true, new: true })
        console.log(data)
        res.json({'success':true})
        
    }catch(error){
        console.log(error)
    }
   
    
}


module.exports = {
    userProfile,
    userProfilePost
}