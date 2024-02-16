const express = require('express')
const authenticateToken= require('../middleware/middleware')

const { productListPage, productFilter } = require('../controller/userController/productListController')
const { userProfile, userProfilePost } = require('../controller/userController/userProfileController')
const checkUserAuthenticationBeforeAction = require('../middleware/authCheckingforProductList')
const checkUserBeforeProductDetail = require('../middleware/authCheckingforProductDetail')
const { GetCart, cartUpdateQuantity } = require('../controller/userController/cartController')
const { productPage, addToCart } = require('../controller/userController/productDetailsController')
const { getCheckOutPage } = require('../controller/userController/checkOutController')
const { addAddressPost, editAddress, deleteAddress } = require('../controller/userController/addressController')


const router = express.Router()

// product list page
router.get('/productListPage',checkUserAuthenticationBeforeAction,productListPage)

//product details page
router.get('/productPage/:id',checkUserBeforeProductDetail,productPage)

router.post('/addToCart',addToCart)


// User profile Page 
router.get('/userProfilePage',authenticateToken,userProfile)

router.post('/userProfilePage',authenticateToken,userProfilePost)

router.post('/productFilter/category/:id',productFilter)

//cart

router.get('/cart',GetCart)
router.post('/updateQuantity',cartUpdateQuantity)

// check Out page

router.get('/checkOutPage',getCheckOutPage)

// address modaal 

router.post('/addAddressPost',addAddressPost)

router.post('/editAddress',editAddress)

router.post('/deleteAddress',deleteAddress)




module.exports= router