const product = require('../../model/productModel')


const productListPage = async (req,res)=>{
    const productList = await product.find({status:true}).populate('category')
    res.render('userViews/productListPage',{productList})
}








module.exports = {
    productListPage
}