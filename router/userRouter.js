const express = require('express')
const authenticateToken= require('../middleware/middleware')

const { productListPage, productFilter } = require('../controller/userController/productListController')
const { productPage } = require('../controller/userController/productController')
const { userProfile, userProfilePost } = require('../controller/userController/userProfileController')
const checkUserAuthenticationBeforeAction = require('../middleware/authCheckingforProductList')
const checkUserBeforeProductDetail = require('../middleware/authCheckingforProductDetail')


const router = express.Router()

router.get('/productListPage',checkUserAuthenticationBeforeAction,productListPage)

router.get('/productPage/:id',checkUserBeforeProductDetail,productPage)
// router.get('/productPage',productPage)

// User profile Page 
router.get('/userProfilePage',authenticateToken,userProfile)

router.post('/userProfilePage',authenticateToken,userProfilePost)

router.post('/productFilter/category/:id',productFilter)






module.exports= router