const jwt = require('jsonwebtoken');
const User = require('../model/userModel')

// Middleware function to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.cookies.loginToken

    console.log(token,'   9898-. ,');
    

    if (!token) {
        res.render('userViews/home',{userAuth:false})
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
