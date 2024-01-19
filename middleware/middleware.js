const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.cookies.loginToken

    console.log(token,'   9898-. ,');
    

    if (!token) {
        res.render('userViews/home',{userAuth:false})
        return 
        // res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('userViews/home',{userAuth:false})
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
