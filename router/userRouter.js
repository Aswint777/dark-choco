const express = require('express')
const authenticateToken= require('../middleware/middleware')

const { productListPage } = require('../controller/userController/productListController')
const { productPage } = require('../controller/userController/productController')

const router = express.Router()

router.get('/productListPage',authenticateToken,productListPage)

router.get('/productPage/:id',authenticateToken,productPage)
// router.get('/productPage',productPage)






module.exports= router