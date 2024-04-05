const product = require("../../model/productModel");
const upload = require("../../middleware/multer");
const Category = require("../../model/categoryModel");

const addProduct = async (req, res) => {
  const category = await Category.find(
    { status: true },
    { categoryDescription: 0 }
  );

  // console.log(category);
  res.render("adminViews/addProduct", { category });
};

const addProductPost = async (req, res) => {
  console.log("entered to add product");
  console.log(req.body, "body data");

  const {
    productName,
    productDescription,
    Quantity,
    amount,
    Markup,
    category,
  } = req.body;
  console.log(category, "ca----");

  const image1 = req.files["image1"][0].filename; // Contains the uploaded file information for 'image1'
  const image2 = req.files["image2"][0].filename; // Contains the uploaded file information for 'image2'
  const image3 = req.files["image3"][0].filename; // Contains the uploaded file information for 'image3'
  console.log(req.files.filename);
  console.log(image2);
  console.log(image3);
  console.log(image1);

  try {
    const products = await product.create({
      stock: productName,
      productDescription: productDescription,
      quantity: parseInt(Quantity),
      amount: parseInt(amount),
      markup: parseInt(Markup),
      category: category,
      image1: image1,
      image2: image2,
      image3: image3,
      // image4: [image1, image2, image3],
    });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("error, category is not created ");
  }
};

//product list

const adminProductList = async (req, res) => {
  var i = 0;
  const page = parseInt(req.query.page) || 1;
  const count = await product.find().count();
  const pageSize = 3;
  const totalOrder = Math.ceil(count / pageSize);
  const skip = (page - 1) * pageSize;

  // console.log('admin product list page is here')

  const productList = await product
    .find()
    .populate("category")
    .skip(skip)
    .limit(pageSize);

  res.render("adminViews/adminProductList", {
    productList,
    totalOrder,
    pageSize,
    page: page,
  });
};

const manageProduct = async (req, res) => {
  const { _id } = req.body;
  const pro = await product.findOne({ _id: _id });

  let products;
  if (pro.status === true) {
    products = await product.updateOne(
      { _id: _id },
      { $set: { status: false } }
    );
  } else {
    products = await product.updateOne(
      { _id: _id },
      { $set: { status: true } }
    );
  }

  res.json(products);
};

const editProduct = async (req, res) => {
  const { id } = req.params;

  const pro = await product.findOne({ _id: id }).populate("category");
  const cat = await Category.find({});

  res.render("adminViews/editProduct", { pro, cat });
};

const editProductPost = async (req, res) => {
  try {
    console.log("editting now");
    console.log(req.body, "body");
    const {
      yourId,
      productName,
      productDescription,
      quantity,
      amount,
      Markup,
      category,
    } = req.body;
    const image1 = req.files["image1"]; // Contains the uploaded file information for 'image1'
    const image2 = req.files["image2"]; // Contains the uploaded file information for 'image2'
    const image3 = req.files["image3"]; // Contains the uploaded file information for 'image3'

    console.log(req.body, "body");
    const editProduct = await product.find({ _id: yourId });
    console.log(editProduct, "keyyyyyyyyyyyy");

    let obj = {
      stock: productName,
      productDescription: productDescription,
      quantity: quantity,
      amount: amount,
      markup: Markup,
      category: category,
    };

    if (image1) {
      obj.image1 = image1[0].filename;
    }
    if (image2) {
      obj.image2 = image2[0].filename;
    }
    if (image3) {
      obj.image3 = image3[0].filename;
    }
    const obj2 = { ...obj };
    console.log(yourId);
    console.log(obj, "obj2 is this");
    let data = await product.findOneAndUpdate(
      { _id: yourId },
      { $set: { ...obj2 } },
      { new: true }
    );
    console.log(data, "fllllllllllllll");
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addProduct,
  addProductPost,
  adminProductList,
  manageProduct,
  editProduct,
  editProductPost,
};
