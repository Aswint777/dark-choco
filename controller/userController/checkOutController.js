
const Address = require("../../model/addressModel");
const jwt = require("jsonwebtoken");

const getCheckOutPage = async (req,res)=>{
    try{
        const token = req.cookies.loginToken;
            const data = jwt.verify(token, process.env.SECRET_KEY);
            const { userId } = data;
            const addressList = await Address.find({userData:userId})
            console.log(addressList)
        res.render('userViews/checkOutPage',{addressList})
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCheckOutPage
}