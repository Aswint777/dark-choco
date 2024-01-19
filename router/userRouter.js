const express = require('express')

const { productListPage } = require('../controller/userController/productListController')
const { productPage } = require('../controller/userController/productController')

const router = express.Router()

router.get('/productListPage',productListPage)

router.get('/productPage',productPage)





module.exports= router