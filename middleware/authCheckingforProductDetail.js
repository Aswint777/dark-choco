const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const product = require("../model/productModel");


// Middleware function to verify JWT token
async function checkUserBeforeProductDetail(req, res, next) {
  const token = req.cookies.loginToken;
  const { id } = req.params;
  console.log(id);
  const data = await product.findOne({ _id: id }).populate("category");

  console.log(token, "   9898-. ,");

  if (!token) {
    res.render('userViews/productPage',{data,userAuth:false})
    return;
    // res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) {
      console.log(err);
      return res.render('userViews/productPage',{data,userAuth:false})
    }
    console.log(user,'oioioi');
    const userData = await User.findById(user.userId);
    if (!userData.status) {
      return res.render('userViews/productPage',{data,userAuth:false})
    }
    console.log(userData);

    req.user = user;
    next();
  });
}

module.exports = checkUserBeforeProductDetail;
