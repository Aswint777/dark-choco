const Category = require('../../model/categoryModel')

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

module.exports = {
    categoryList,
    addCategory,
    addCategoryPost,
    editCategory,
    manageCategory,
    editCategoryPost
}