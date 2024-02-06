const product = require('../../model/productModel')

const productPage = async (req,res)=>{
    // res.render('userViews/productPage')
    try{

        console.log('product page here -------------------- ')
        const {id} = req.params
        console.log(id)
        const data = await product.findOne({_id:id}).populate('category')
        console.log(data)
        
        res.render('userViews/productPage',{data,userAuth:true})
    }catch(error){
        console.log(error.message)
    }
}









module.exports = {
    productPage
}