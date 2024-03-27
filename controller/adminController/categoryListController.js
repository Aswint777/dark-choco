const { Error } = require('mongoose')
const Category = require('../../model/categoryModel')
const offerCategory = require('../../model/categoryOfferModel')
const product = require('../../model/productModel')
const categoryList = async (req,res) => {
    let query = req.query
    console.log(query,'yeeeeeeeeeeeeeeeeees')

    var i = 0
    const page = parseInt(req.query.page) || 1; 
    const count = await Category.find().count();
    const pageSize = 3;
    const totalOrder = Math.ceil(count / pageSize);
    const skip = (page - 1) * pageSize;
    // const user = await Category.find().skip(skip).limit(pageSize)
    
    // if (Object.keys(query).length === 0){
    //     const category = await Category.find({},{categoryDescription:0})
    //     res.render('adminViews/categoryList',{category,query:''})
    // } 
    if (req.query.date) {
        console.log(req.query)
        const latest = await Category.find().sort({date:Number(req.query.date)}) //{} {another:true,chocolate:true}

        console.log(latest)
        res.json({latest})
    }else if(req.query.searchQuery){
        try{
            
            console.log(req.query.searchQuery,'lllllllllllllllllllllllllllllllllllllllll')
            const category= await Category.find({
                category: { $regex: req.query.searchQuery, $options: "i" }
            });
            const query = req.query.searchQuery
            res.render('adminViews/categoryList',{category,query,totalOrder,
                pageSize,
               page: page})
            
        }catch(error){
            console.log(error)
        }
    }else{
        const category = await Category.find({},{categoryDescription:0}).skip(skip).limit(pageSize)
        res.render('adminViews/categoryList',{category,query:'',totalOrder,
        pageSize,
       page: page})
    }

}

const manageCategory = async(req,res)=>{
    console.log('hello world')
    const {_id }=req.body
   
    const cat = await Category.findOne({_id:_id})
 
    let category
    if(cat.status === true){
         category = await Category.updateOne({_id:_id},{$set:{status:false}})
    }else{
         category = await Category.updateOne({_id:_id},{$set:{status:true}})
    }

   res.json(category)   
}





const addCategory = (req,res) =>{
    res.render('adminViews/addCategory')
}

const addCategoryPost = async function (req,res) {
    console.log('add category')
    const {categoryName,categoryDescription} = req.body
    try{
        const dupe= await Category.find({
            category: { $regex: categoryName, $options: "i" }
        });
        console.log(dupe,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
        
        if(dupe.length !== 0){

            throw Error('category already here')
        }else if(categoryName.length>20 ){
            console.log()
            throw Error('Category name is too long') 
              
        }
        else {
            const category = await Category.create({ category:categoryName , categoryDescription : categoryDescription });
             res.json({success:true})
            
        }
    }catch(error){
        console.log(error,'kkkk')
        res.json({success:false , error:error.message});
    }
}

const editCategory = async (req,res) =>{
    console.log('edit category ')
    const {id} = req.params
    console.log(id)
    
    const cat = await Category.findOne({_id: id})

  

    // res.json({success: true})
    res.render('adminViews/editCategory',{cat})
}

const editCategoryPost = async(req,res)=>{
    const{ id} = req.params
    console.log(id)
    console.log('hai')
    console.log('edit post is here')
    const {categoryName,categoryDescription} = req.body

    const edit = await Category.updateOne({_id:id},{$set:{category:categoryName,categoryDescription}})

    res.redirect('/admin/categoryList')
    
}

const categoryOffer = async(req,res)=>{
    try {
        const categoryList = await Category.find({})
        console.log(categoryList);
        const categoryOfferList = await offerCategory.find()
        res.render('adminViews/categoryOffer',{categoryList,categoryOfferList})
    } catch (error) {
        console.log(error)
    }
}

const createCategoryOffer = async(req,res)=>{
    try {
        console.log(req.body)
        const {categoryId,offerRate,startDate,expiryDate }= req.body
        const categoryDetails = await Category.findOne({_id : categoryId})
        if(!categoryDetails){
            throw Error('The category is not Exist')
        }
        const duplicate = await offerCategory.findOne({categoryId : categoryId})
        if(duplicate){
            throw Error('this category Offer Exist ')
        }
        const newOffer = await offerCategory.create({categoryId,offerRate,startDate,expiryDate,categoryName:categoryDetails.category})
        await Category.findOneAndUpdate({_id:categoryId },{$set:{offerRate:offerRate}})
        
        const productUpdate = await product.find({category:categoryId})
        if(productUpdate){

            productUpdate.forEach(async (pro) => {
                // Assuming you have the categoryOfferRate and originalPrice available
                const categoryOfferRate = offerRate
                const originalPrice = pro.amount;
                
                // Calculate categoryOfferPrice based on categoryOfferRate and originalPrice
                console.log(originalPrice,categoryOfferRate);
                const categoryOfferPrice = originalPrice - (originalPrice * (categoryOfferRate / 100));
                console.log(categoryOfferPrice,'categoryOfferPrice');
                // Update product with the calculated categoryOfferPrice
                await product.findOneAndUpdate(
                    { _id: pro._id },
                    { $set: { categoryOfferPrice: categoryOfferPrice,categoryOfferRate : categoryOfferRate } },
                    { new: true }
                );
            });
            console.log(productUpdate,'success the task')
        }

        res.json({success : true})
        
    } catch (error) {
        console.log(error)
    }
}

const deleteCategoryOffer = async(req,res)=>{
    try {
        const {_id}= req.body
        const offerDetails = await offerCategory.findOne({_id:_id})
        const productUpdate = await product.find({category:offerDetails.categoryId})
        productUpdate.forEach(async (pro) => {
            await product.findOneAndUpdate(
                { _id: pro._id },
                { $unset: { categoryOfferPrice: "",categoryOfferRate:"" } },
                { new: true }
            );
        });
        await Category.findOneAndUpdate(
            { _id:offerDetails.categoryId },
            { $unset: { offerRate: "" } },
            { new: true }
        );
        await offerCategory.findOneAndDelete({_id :_id})
        res.json({success : true})
    } catch (error) {
        console.log(error)
    }


}



module.exports = {
    categoryList,
    addCategory,
    addCategoryPost,
    editCategory,
    manageCategory,
    editCategoryPost,
    categoryOffer,
    createCategoryOffer,
    deleteCategoryOffer
}