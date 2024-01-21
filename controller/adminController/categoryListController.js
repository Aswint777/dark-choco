const Category = require('../../model/categoryModel')

const categoryList = async (req,res) => {
    const category = await Category.find({},{categoryDescription:0})

    res.render('adminViews/categoryList',{category:category})
}

const manageCategory = async(req,res)=>{
    console.log('hello world')
    const {_id }=req.body
    console.log(_id)
    const cat = await Category.findOne({_id:_id})
    console.log(cat)
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
        console.log(categoryName)
        const category = await Category.create({ category:categoryName , categoryDescription : categoryDescription });

    }catch(err){
        console.log(err)
        res.status(400).send("error, category is not created ");
    }
 
}

const editCategory = async (req,res) =>{
    console.log('edit category ')
    const {id} = req.params
    
    const cat = await Category.findOne({_id: id})

  
    console.log(cat)
    // res.json({success: true})
    res.render('adminViews/editCategory',{cat})
}

const editCategoryPost = async(req,res)=>{
    const{ id} = req.params
    console.log(id)
    console.log('hai')
    console.log('edit post is here')
    const {categoryName,categoryDescription} = req.body
    console.log(categoryName,categoryDescription)
    const edit = await Category.updateOne({_id:id},{$set:{category:categoryName,categoryDescription}})
    console.log(categoryName,categoryDescription)
    res.redirect('/admin/categoryList')
    
}

module.exports = {
    categoryList,
    addCategory,
    addCategoryPost,
    editCategory,
    manageCategory,
    editCategoryPost
}