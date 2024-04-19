const express = require('express')
const authenticateToken= require('../middleware/middleware')
const userAuthToken = require('../middleware/usersideMidilware')
const { productListPage, productFilter } = require('../controller/userController/productListController')
const { userProfile, userProfilePost } = require('../controller/userController/userProfileController')
const checkUserAuthenticationBeforeAction = require('../middleware/authCheckingforProductList')
const checkUserBeforeProductDetail = require('../middleware/authCheckingforProductDetail')
const { GetCart, cartUpdateQuantity, deleteCartProduct, proceedToCheckout } = require('../controller/userController/cartController')
const { productPage, addToCart } = require('../controller/userController/productDetailsController')
const { getCheckOutPage, placeOrder, razorPayHandler } = require('../controller/userController/checkOutController')
const { addAddressPost, editAddress, deleteAddress, addressOnlyPage } = require('../controller/userController/addressController')
const { getSuccessPage } = require('../controller/userController/orderSuccessController')
const { userOrderHistoryPage, userOrderDetails, cancelOrder, returnProduct, downloadInvoice } = require('../controller/userController/userOrderController')
const { getWishList, addToWishList, deleteWishListProduct } = require('../controller/userController/wishListController')
const { walletHistory } = require('../controller/userController/walletController')
const { couponPage, applyCoupon, cancelCoupon } = require('../controller/userController/userCouponController')
const userTokenMiddleware = require('../middleware/usersideMidilware')


const router = express.Router()

// product list page
router.get('/productListPage',checkUserAuthenticationBeforeAction,productListPage)

//product details page
router.get('/productPage/:id',checkUserBeforeProductDetail,productPage)

router.post('/addToCart',userTokenMiddleware,addToCart)


// User profile Page 
router.get('/userProfilePage',authenticateToken,userProfile)

router.post('/userProfilePage',authenticateToken,userProfilePost)

router.post('/productFilter/category/:id',productFilter)

//cart
 
router.get('/cart',userAuthToken,GetCart)

router.post('/updateQuantity',cartUpdateQuantity)

router.post('/deleteCartProduct',deleteCartProduct)

router.post('/proceedToCheckout',proceedToCheckout)

// check Out page

router.get('/checkOutPage',userAuthToken,getCheckOutPage)

router.post ('/placeOrder',placeOrder)

// address modaal 

router.post('/addAddressPost',addAddressPost)

router.post('/editAddress',editAddress)

router.post('/deleteAddress',deleteAddress)

//address page only

router.get('/addressPage',userAuthToken,addressOnlyPage)

// order success page 

router.get('/getSuccessPage',userAuthToken,getSuccessPage)

//user order History page
  
router.get('/userOrderHistory',userAuthToken,userOrderHistoryPage)

// user order Details Page 

router.get( '/userOrderDetails',userAuthToken,userOrderDetails)

router.post('/cancelOrder',cancelOrder)

router.post('/verify-payment',razorPayHandler)

router.post('/returnProduct',returnProduct)

// download invoice 

router.post ('/downloadInvoice',downloadInvoice)

// wishList 
router.get('/getWishList',userAuthToken,getWishList)

router.post('/addToWishList',addToWishList)

router.post('/deleteWishListProduct',deleteWishListProduct)


//wallet History page 

router.get('/walletHistory',userAuthToken,walletHistory)
    
// coupon 

router.get('/couponPage',userAuthToken,couponPage)

router.post('/applyCoupon',applyCoupon)

router.post('/cancelCoupon',cancelCoupon)


module.exports= router