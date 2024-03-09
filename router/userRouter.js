const express = require('express')
const authenticateToken= require('../middleware/middleware')

const { productListPage, productFilter } = require('../controller/userController/productListController')
const { userProfile, userProfilePost } = require('../controller/userController/userProfileController')
const checkUserAuthenticationBeforeAction = require('../middleware/authCheckingforProductList')
const checkUserBeforeProductDetail = require('../middleware/authCheckingforProductDetail')
const { GetCart, cartUpdateQuantity, deleteCartProduct, proceedToCheckout } = require('../controller/userController/cartController')
const { productPage, addToCart } = require('../controller/userController/productDetailsController')
const { getCheckOutPage, placeOrder, razorPayHandler } = require('../controller/userController/checkOutController')
const { addAddressPost, editAddress, deleteAddress, addressOnlyPage } = require('../controller/userController/addressController')
const { getSuccessPage } = require('../controller/userController/orderSuccessController')
const { userOrderHistoryPage, userOrderDetails, cancelOrder } = require('../controller/userController/userOrderController')
const { getWishList, addToWishList, deleteWishListProduct } = require('../controller/userController/wishListController')
const { walletHistory } = require('../controller/userController/walletController')
const { couponPage, applyCoupon } = require('../controller/userController/userCouponController')


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

router.post('/deleteCartProduct',deleteCartProduct)

router.post('/proceedToCheckout',proceedToCheckout)

// check Out page

router.get('/checkOutPage',getCheckOutPage)

router.post ('/placeOrder',placeOrder)

// address modaal 

router.post('/addAddressPost',addAddressPost)

router.post('/editAddress',editAddress)

router.post('/deleteAddress',deleteAddress)

// order success page 

router.get('/getSuccessPage',getSuccessPage)

//user order History page
 
router.get('/userOrderHistory',userOrderHistoryPage)

// user order Details Page 

router.get( '/userOrderDetails',userOrderDetails)

router.post('/cancelOrder',cancelOrder)

router.post('/verify-payment',razorPayHandler)

//address page only

router.get('/addresspage',addressOnlyPage)

// wishList 
router.get('/getWishList',getWishList)

router.post('/addToWishList',addToWishList)

router.post('/deleteWishListProduct',deleteWishListProduct)


//wallet History page 

router.get('/walletHistory',walletHistory)
    
// coupon 

router.get('/couponPage',couponPage)

router.post('/applyCoupon',applyCoupon)


module.exports= router