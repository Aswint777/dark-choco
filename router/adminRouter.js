const express = require('express')

const { customer, manageUser, SearchCustomer } = require('../controller/adminController/customerController')
const category = require('../model/categoryModel')
const { categoryList, addCategory, addCategoryPost, editCategory, manageCategory, editCategoryPost, categoryOffer, createCategoryOffer, deleteCategoryOffer, editCategoryOffer } = require('../controller/adminController/categoryListController')
const { addProduct, adminProductList, manageProduct, addProductPost, editProduct, editProductPost } = require('../controller/adminController/productController')
const upload = require("../middleware/multer")
const adminLoginToken = require('../middleware/adminMiddleware')
const { getAdminOrderManagement, adminOrderDetails, updateStatus, returnProductList, returnProductStatus, returnListFilter } = require('../controller/adminController/adminOrderManagementController')
const { getAddCouponPage, addCoupon, couponList, editCoupon, editCouponPost, deleteCoupon } = require('../controller/adminController/couponController')
const { downloadExcel, downloadPDF, downloadExcelByDate, downloadPDFByDate } = require('../controller/adminController/download')
const { adminDashboard, filterGraph } = require('../controller/adminController/adminDashboardController')
const { productOffer, createProductOffer, deleteProductOffer, editProductOffer, offer, createReferralOffer, updateReferralOffer } = require('../controller/adminController/offerController')
 

const router = express.Router()

// customer page
router.get('/customer',adminLoginToken, customer)

router.post('/manageUser',adminLoginToken,manageUser)

router.get('/searchCustomer',adminLoginToken,SearchCustomer)

// category list
router.get('/categoryList',adminLoginToken,categoryList)
router.post('/manageCategory',adminLoginToken,manageCategory)


// add category
router.get('/addCategory',adminLoginToken,addCategory)
router.post('/addCategory',adminLoginToken,addCategoryPost)

// editCategory
router.get('/editCategory/:id',adminLoginToken,editCategory)
router.post('/editCategory/:id',adminLoginToken,editCategoryPost)

//add product
router.get('/addProduct',adminLoginToken,addProduct)

router.post('/addProducts',adminLoginToken, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
  ]), addProductPost);
  
//product list page

router.get('/adminProductList',adminLoginToken,  adminProductList)

router.post ('/manageProduct',adminLoginToken,manageProduct)

//edit product 

router.get('/editProduct/:id',adminLoginToken,editProduct)
router.post('/editProduct' , upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]),editProductPost)


// get order management page
router.get('/adminOrderManagement',adminLoginToken,getAdminOrderManagement)

//Return product 

router.get('/returnProductList',adminLoginToken,returnProductList)

router.post('/returnProductStatus',returnProductStatus)

// router.get('/returnListFilter',returnListFilter)

// get order details page 

router.get('/adminOrderDetails',adminLoginToken,adminOrderDetails)

router .post ('/updateStatus',updateStatus)

// coupon management

router.get('/getAddCouponPage',adminLoginToken,getAddCouponPage)

router.post('/addCoupon',addCoupon)

router.get('/couponList',adminLoginToken,couponList)

router.get('/editCoupon/:id',adminLoginToken, editCoupon);

router.post('/editCouponPost',editCouponPost)

router.post('/deleteCoupon',deleteCoupon)

//  download 
router.get('/downloadExcel',adminLoginToken,downloadExcel)

router.post('/downloadExcelByDate',downloadExcelByDate)

router.get('/generatePDF',downloadPDF)

router.post('/downloadPDFByDate',downloadPDFByDate)


// Category offer 

router.get('/categoryOffer',adminLoginToken,categoryOffer)

router.post('/createCategoryOffer',createCategoryOffer)

router.post('/deleteCategoryOffer',deleteCategoryOffer)

router.post('/editCategoryOffer',editCategoryOffer)

// product Offer

router.get('/ProductOffer',adminLoginToken,productOffer)

router.post('/createProductOffer',createProductOffer)

router.post('/deleteProductOffer',deleteProductOffer)

router.post('/editProductOffer',editProductOffer)

//referral offer

router.post('/updateReferralOffer',updateReferralOffer)

// offer page 

router.get('/offer',adminLoginToken,offer)

// admin Dashboard

router.get('/adminDashboard',adminLoginToken,adminDashboard)
router.post('/adminDashboard',filterGraph)
module.exports= router