const product = require('../../model/productModel')
const upload= require('../../middleware/multer')


const addProduct = (req,res)=>{
    res.render('adminViews/addProduct')
}

const addProductPost = async (req,res) =>{
    console.log('entered to add product')
    const {productName,categoryDescription,Quantity, amount,Markup,category} = req.body;
    console.log(productName)
    const image1 = req.file; // Contains the uploaded file information for 'image1'
    const image2 = req.files['image2'][0]; // Contains the uploaded file information for 'image2'
    const image3 = req.files['image3'][0]; // Contains the uploaded file information for 'image3'



}


module.exports = {
    addProduct,
    addProductPost
}