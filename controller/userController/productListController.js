const product = require("../../model/productModel");
const Category = require("../../model/categoryModel");

const productListPage = async (req, res) => {
  // let productList
  // if (req.query.category){
  //     const {category} = req.query

  //     console.log(category,'lollllll')
  //      productList = await product.find({category:category}).populate('category')
  //      console.log(productList,'gotttt')
  //      const categoryList = await Category.find()

  //      res.render('userViews/productListPage',{productList,categoryList})

  // }else{
  console.log("okkokkookokokokokok");
  const productList = await product.find({ status: true }).populate("category");
  const categoryList = await Category.find();
  res.render("userViews/productListPage", {
    productList,
    categoryList,
    userAuth: true,
  });
};

const productFilter = async (req, res) => {
  const category = req.params.id;
  productList = await product
    .find({ category: category, status: true })
    .populate("category");
  const categoryList = await Category.find();
  res.json({ productList });

  //  res.render('userViews/productListPage',{productList,categoryList})
};

module.exports = {
  productListPage,
  productFilter,
};
