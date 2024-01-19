const jwt = require('jsonwebtoken');

const adminAuthenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/adminLogin'); 
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            res.redirect('/adminLogin')
        }

        req.user = user;
        next();
    });
};

module.exports = adminAuthenticateToken;
