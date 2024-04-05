const coupon = require("../../model/couponModel");

const getAddCouponPage = async (req, res) => {
  res.render("adminViews/addCoupon");
};

const addCoupon = async (req, res) => {
  try {
    console.log(
      req.body,
      "...................................................."
    );
    const {
      couponName,
      code,
      description,
      value,
      minimumPurchaseAmount,
      maximumUses,
      expiryDate,
    } = req.body;
    console.log(
      couponName,
      code,
      description,
      value,
      minimumPurchaseAmount,
      maximumUses,
      expiryDate,
      "sdfhdjvbh"
    );
    const duplicateCode = await coupon.findOne({ code: code });
    const duplicateName = await coupon.findOne({ couponName: couponName });

    if (duplicateCode) {
      throw Error("Current Coupon code is already taken find another one ");
    }
    if (duplicateName) {
      throw Error("Current Coupon Name is already taken find another one ");
    }
    const newCoupon = await coupon.create({
      couponName,
      code,
      description,
      value,
      minimumPurchaseAmount,
      maximumUses,
      expiryDate,
    });
    console.log(newCoupon, "newwwwwwwwwwwwwwwwwwwwwwwwwwww");
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error.message });
  }
};

const couponList = async (req, res) => {
  const allCoupons = await coupon.find();
  console.log(allCoupons);
  res.render("adminViews/couponsList", { allCoupons });
};

const editCoupon = async (req, res) => {
  console.log("haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaai");
  const { id } = req.params;
  console.log(
    id,
    "...............................................................id"
  );
  const currentCoupon = await coupon.findOne({ _id: id });
  res.render("adminViews/editCoupon", { currentCoupon });
};

const editCouponPost = async (req, res) => {
  console.log("hloooooo");
  const {
    couponName,
    code,
    description,
    value,
    minimumPurchaseAmount,
    maximumUses,
    expiryDate,
    _id,
  } = req.body;
  const editCoupon = await coupon.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        couponName,
        code,
        description,
        value,
        minimumPurchaseAmount,
        maximumUses,
        expiryDate: expiryDate,
      },
    },
    { new: true }
  );
  console.log(editCoupon, "edited");
  res.json({ success: true });
};

const deleteCoupon = async (req, res) => {
  try {
    const { _id } = req.body;
    const currentCoupon = await coupon.findOneAndDelete({ _id: _id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAddCouponPage,
  addCoupon,
  couponList,
  editCoupon,
  editCouponPost,
  deleteCoupon,
};
