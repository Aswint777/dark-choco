const express = require('express')

const { customer, manageUser, SearchCustomer } = require('../controller/adminController/customerController')
const category = require('../model/categoryModel')
const { categoryList, addCategory, addCategoryPost, editCategory, manageCategory, editCategoryPost } = require('../controller/adminController/categoryListController')
const { addProduct, adminProductList, manageProduct, addProductPost, editProduct } = require('../controller/adminController/productController')
const upload = require("../middleware/multer")
const adminLoginToken = require('../middleware/adminMiddleware')


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
router.post('/editProduct')


module.exports= router