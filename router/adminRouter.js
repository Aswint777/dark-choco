const express = require('express')

const { customer, manageUser, SearchCustomer } = require('../controller/adminController/customerController')
const category = require('../model/categoryModel')
const { categoryList, addCategory, addCategoryPost, editCategory, manageCategory, editCategoryPost, categoryOffer, createCategoryOffer, deleteCategoryOffer } = require('../controller/adminController/categoryListController')
const { addProduct, adminProductList, manageProduct, addProductPost, editProduct, editProductPost } = require('../controller/adminController/productController')
const upload = require("../middleware/multer")
const adminLoginToken = require('../middleware/adminMiddleware')
const { getAdminOrderManagement, adminOrderDetails, updateStatus, returnProductList, returnProductStatus, returnListFilter } = require('../controller/adminController/adminOrderManagementController')
const { getAddCouponPage, addCoupon, couponList, editCoupon, editCouponPost } = require('../controller/adminController/couponController')
const { downloadExcel, downloadPDF, downloadExcelByDate, downloadPDFByDate } = require('../controller/adminController/download')


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
router.get('/adminOrderManagement',getAdminOrderManagement)

//Return product 

router.get('/returnProductList',returnProductList)

router.post('/returnProductStatus',returnProductStatus)

// router.get('/returnListFilter',returnListFilter)

// get order details page 

router.get('/adminOrderDetails',adminOrderDetails)

router .post ('/updateStatus',updateStatus)

// coupon management

router.get('/getAddCouponPage',getAddCouponPage)

router.post('/addCoupon',addCoupon)

router.get('/couponList',couponList)

router.get('/editCoupon/:id', editCoupon);

router.post('/editCouponPost',editCouponPost)

//  download 
router.get('/downloadExcel',downloadExcel)

router.post('/downloadExcelByDate',downloadExcelByDate)

router.get('/generatePDF',downloadPDF)

router.post('/downloadPDFByDate',downloadPDFByDate)


// Category offer 

router.get('/categoryOffer',categoryOffer)

router.post('/createCategoryOffer',createCategoryOffer)

router.post('/deleteCategoryOffer',deleteCategoryOffer)

module.exports= router