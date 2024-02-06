const express = require('express')
const authenticateToken = require('../middleware/middleware')

const {home,userLogin, userSignIn, newUser, userLoginPost, adminLogin, getOtp, adminLoginPost, userLogOut, adminLogOut, about} = require('../controller/publicRouteController')
const { otpPagePost, resendOtp, forgotPassword, forgotPasswordPost, forgotVarifyOtp, forgotVarifyOtpPost, setNewPassword, setNewPasswordPost, resendForgotOtp } = require('../controller/otpController')

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

// forgot password 
router.get ('/forgotPasswords',forgotPassword)

router.post ('/forgotPassword',forgotPasswordPost)

// forgot password varifying page 

router. get ('/forgotPasswordOtp/:email',forgotVarifyOtp)

router.post ('/forgotPasswordOtp',forgotVarifyOtpPost)

router.post ('/resendForgotOtp',resendForgotOtp)

// set new password 

router.get ('/setNewPassword/:email',setNewPassword)

router.post('/setNewPassword',setNewPasswordPost)

//about page 

router.get('/about',about)

module.exports = router