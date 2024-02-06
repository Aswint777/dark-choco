const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const product = require('../model/productModel');

// Middleware function to verify JWT token
async function authenticateToken(req, res, next) {
    const token = req.cookies.loginToken

    console.log(token,'   9898-. ,');
    

    const productList = await product.find({status:true}).populate('category').sort({date:-1}).limit(4)
    if (!token) {
        res.render('userViews/home',{userAuth:false,productList})
        return 
        // res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
  

    jwt.verify(token, process.env.SECRET_KEY, async(err, user) => {
        if (err) {
            console.log(err)
            return res.render('userViews/home',{userAuth:false})
        }
        console.log(user)
        const userData = await User.findById(user.userId)
        if(!userData.status){
            return res.redirect('/userLogin')
        }
        console.log(userData)
        


        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
