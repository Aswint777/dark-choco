const express = require('express')
const authenticateToken = require('../middleware/middleware')

const {home,userLogin, userSignIn, newUser, userLoginPost, adminLogin, getOtp, adminLoginPost, userLogOut, adminLogOut} = require('../controller/publicRouteController')
const { otpPagePost, resendOtp } = require('../controller/otpController')

const router = express.Router()

//home page 
router.get('/',authenticateToken,home)

//login page
router.get('/userLogin',userLogin)

router.post('/userLogin',userLoginPost)

//signUp page
router.get('/userSignIn',userSignIn)

router.post('/userSignIn',newUser)

//admin login page 
router.get('/adminLogin',adminLogin)

router.post('/adminLogin',adminLoginPost)

// otp page 
router.get('/otp',getOtp)

router.post('/otp',otpPagePost)

router.post('/resendOtp',resendOtp)

// logOut
router.get('/logOut',userLogOut)

router.get('/adminLogOut',adminLogOut)

module.exports = router