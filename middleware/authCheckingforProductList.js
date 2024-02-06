const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const product = require('../model/productModel');
const Category = require('../model/categoryModel');


// Middleware function to verify JWT token
async function checkUserAuthenticationBeforeAction(req, res, next) {
    const token = req.cookies.loginToken
    const productList = await product.find({status:true}).populate('category')
    const categoryList = await Category.find()
    
    console.log(token,'   9898-. ,');
    
    if (!token) {
        res.render('userViews/productListPage',{productList,categoryList,userAuth:false})
        return 
        // res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
    
    
    jwt.verify(token, process.env.SECRET_KEY, async(err, user) => {
        if (err) {
            console.log(err)
            return res.render('userViews/productListPage',{productList,categoryList,userAuth:false})
            
        }
        console.log(user)
        const userData = await User.findById(user.userId)
        if(!userData.status){
            return res.render('userViews/productListPage',{productList,categoryList,userAuth:false})
        }
        console.log(userData)
        


        req.user = user;
        next();
    });
}

module.exports = checkUserAuthenticationBeforeAction;
