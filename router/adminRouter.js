const express = require('express')

const { customer, manageUser, SearchCustomer } = require('../controller/adminController/customerController')
const category = require('../model/categoryModel')
const { categoryList, addCategory, addCategoryPost, editCategory, manageCategory, editCategoryPost } = require('../controller/adminController/categoryListController')
const { addProduct } = require('../controller/adminController/productController')


const router = express.Router()

// customer page
router.get('/customer',customer)

router.post('/manageUser',manageUser)

router.get('/searchCustomer',SearchCustomer)

// category list
router.get('/categoryList',categoryList)
router.post('/manageCategory',manageCategory)


// add category
router.get('/addCategory',addCategory)
router.post('/addCategory',addCategoryPost)

// editCategory
router.get('/editCategory/:id',editCategory)
router.post('/editCategory/:id',editCategoryPost)

//add product
router.get('/addProduct',addProduct)


module.exports= router