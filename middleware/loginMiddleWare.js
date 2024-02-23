const jwt = require('jsonwebtoken');
const user = require('../model/userModel')

async function loginMiddleWare(req, res, next) {
    const token = req.cookies.loginToken;
    if (!token) {
        return next();
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const { userId } = data;
        if (userId) {
            return res.redirect('/');
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.redirect('/userLogin');
    }

    next();
}

module.exports = loginMiddleWare;
