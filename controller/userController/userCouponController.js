const coupon = require("../../model/couponModel");
const cart = require("../../model/cartModel");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { trim } = require("validator");
const user = require("../../model/userModel");


const couponPage = async (req, res) => {
  const newCoupon = await coupon.find();
  res.render("userViews/coupon", { newCoupon });
};

const applyCoupon = async (req, res) => {
  try {
    console.log("apply coupon");
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const { total, couponCode } = req.body;
    console.log(couponCode)
    const couponData = await coupon.findOne({ code: couponCode });
    console.log(couponData);
    
    if (!couponData) {
      throw Error("check the coupon Code");
    }
    if(total < couponData.minimumPurchaseAmount){
        throw Error('Coupon is not Active, Purchase more')
    }

    const currentCoupons = await user.findOne({ _id: userId, allCoupon: couponData._id });

    console.log(currentCoupons,'current Coupon')
    if (currentCoupons) {
      throw Error("already used the Coupon");
    }
    const existCoupon = await user. findOne({_id : userId})
    if(!existCoupon.allCoupon){
        await user.findByIdAndUpdate({_id:userId}, { $set: { allCoupon: [couponData._id] } });
    }else{
        await user.findByIdAndUpdate({_id:userId}, { $addToSet: { allCoupon: couponData._id } });
    }
    const offerCart = await cart.findOneAndUpdate({userData:userId},{$set:{couponOffer:couponData.value,couponId: couponData._id}})
    console.log('success')
    console.log(offerCart);
    res.json({success : true})
  } catch (error) {
    // console.log(error);
    res.status(400).json({ error: error.message });

  }
};

const cancelCoupon = async(req,res)=>{
  try {
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const { couponId } = req.body;
    console.log(couponId);
    const currentCoupon = await coupon.findOne({_id :  new mongoose.Types.ObjectId(couponId)})
    const updateUserData = await user.findOneAndUpdate({ _id: userId },
      { $pull: { allCoupon: couponId } })
      await cart.findOneAndUpdate({ userData: userId },{$unset:{couponId :'',couponOffer : ''}})
       res.json({success: true})
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  couponPage,
  applyCoupon,
  cancelCoupon
};
