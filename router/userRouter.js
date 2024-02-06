const express = require('express')
const authenticateToken= require('../middleware/middleware')

const { productListPage } = require('../controller/userController/productListController')
const { productPage } = require('../controller/userController/productController')
const { userProfile, userProfilePost } = require('../controller/userController/userProfileController')

const router = express.Router()

router.get('/productListPage',authenticateToken,productListPage)

router.get('/productPage/:id',authenticateToken,productPage)
// router.get('/productPage',productPage)

// User profile Page 
router.get('/userProfilePage',authenticateToken,userProfile)

router.post('/userProfilePage',authenticateToken,userProfilePost)






module.exports= router