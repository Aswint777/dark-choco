const product = require('../../model/productModel')
const upload= require('../../middleware/multer')
const Category = require('../../model/categoryModel')


const addProduct = async (req,res)=>{
    const category = await Category.find({status:true},{categoryDescription:0})
    
    // console.log(category);
    res.render('adminViews/addProduct',{category})
}

const addProductPost = async (req,res) =>{
    console.log('entered to add product')
    console.log(req.body,'body data')

    const {productName,categoryDescription,Quantity, amount,Markup,category} = req.body;
    console.log(category,'ca----')
    const image1 = req.files['image1'][0].filename // Contains the uploaded file information for 'image1'
    const image2 = req.files['image2'][0].filename // Contains the uploaded file information for 'image2'
    const image3 = req.files['image3'][0].filename// Contains the uploaded file information for 'image3'
    console.log(image2)
    console.log(image3)
    console.log(image1)

    try{    
        const products = await product.create({ stock:productName,categoryDescription:categoryDescription,quantity:parseInt(Quantity),amount:parseInt(amount),markup:parseInt(Markup),category:category,image1:image1,image2:image2,image3:image3 });
        res.json({"success" : true})
        

    }catch(err){
        console.log(err)
        res.status(400).send("error, category is not created ");
    }
}



//product list 

const adminProductList = async (req,res)=>{
    // console.log('admin product list page is here')
    const productList = await product.find().populate('category')
    res.render('adminViews/adminProductList',{productList})
} 

const manageProduct = async (req,res)=>{
    const {_id }=req.body
    console.log(_id)
    const pro = await product.findOne({_id:_id})
    console.log(pro)
    let products
    if(pro.status === true){
         products = await product.updateOne({_id:_id},{$set:{status:false}})
    }else{
         products = await product.updateOne({_id:_id},{$set:{status:true}})
    }

   res.json(products)   
}


const editProduct = async (req,res)=>{
    
    const {id}= req.params
    console.log(id,"oooooooooooooooooooooooooooooooooo")
    const pro = await product.findOne({_id:id}).populate('category')
    const cat = await Category.find({})
    console.log(cat,'.................................................................................')
    console.log(pro)
    
    res.render('adminViews/editProduct',{pro,cat})

}

const editProductPost = async (req,res)=>{

}



module.exports = {
    addProduct,
    addProductPost,
    adminProductList,
    manageProduct,
    editProduct
}