const jwt = require('jsonwebtoken');
const admin = require('../model/adminModel')

async function adminLoginAuth (req, res, next) {
    const token = req.cookies.adminLoginToken;
    if (!token) {
        return next();
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const { adminId } = data;
        if (adminId) {
            return res.redirect('/admin/customer');
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.redirect('/adminLogin');
    }

    next();
}

module.exports = adminLoginAuth;
