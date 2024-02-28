const wishList = require("../../model/wishListModel");
const jwt = require("jsonwebtoken");
const product = require("../../model/productModel");
const user = require("../../model/userModel");

const getWishList = async (req, res) => {
    try{
        const token = req.cookies.loginToken;
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const { userId } = data;
        const list = await wishList
        .findOne({ userData: userId })
        .populate("products.product_id");
        console.log(list)
        res.render("userViews/wishList",{list});
    }catch(error){
        console.log(error)
    }
};

const addToWishList = async (req, res) => {
    console.log('hlooppppppppppppppppppppppppp')
  const token = req.cookies.loginToken;
  const data = jwt.verify(token, process.env.SECRET_KEY);
  const { userId } = data;
  const userDetails = await wishList.findOne({ userData: userId });

  console.log(req.body);
  const { _id } = req.body;
  console.log(_id);
  let addWishList
  if (userDetails) {
    addWishList = await wishList.findOneAndUpdate(
      {
        userData: new mongoose.Types.ObjectId(userId),
        "products.product_id": { $ne: _id },
      },
      { $addToSet: { products: { product_id: _id } } },
      { new: true }
    );
  } else {
    addWishList = await wishList.create({
      products: [{ product_id: _id }],
      userData: userId,
    });
  }
  console.log(addWishList,"added to wishList")
};

module.exports = {
  getWishList,
  addToWishList
};
