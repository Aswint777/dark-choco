const product = require('../../model/productModel')
const offerProduct = require('../../model/productOffer')
const { default: mongoose, Error } = require("mongoose");
const referral = require('../../model/referralOffer')

const offer = async(req,res)=>{
  const referralOffer = await referral.findOne()
  console.log(referralOffer,'referral offer');
  res.render('adminViews/offer',{referralOffer})
}

const productOffer = async (req,res)=>{
    const productList = await product.find()
    const offerProductList = await offerProduct.find()
    res.render('adminViews/productOffer',{productList,offerProductList})
}

const createProductOffer = async(req,res)=>{
    try {
        console.log(req.body);
        const { productId, offerRate, startDate, expiryDate } = req.body;
        const productDetails = await product.findOne({ _id: productId });
        if (!productDetails) {
          throw new Error("The product is not Exist");
        }
        const duplicate = await offerProduct.findOne({ productId: productId });
        if (duplicate) {
          throw new Error("this Product Offer Exist ");
        }
        const newOffer = await offerProduct.create({
          productId,
          offerRate,
          startDate,
          expiryDate,
          productName: productDetails.stock,
        });
        const productUpdate = await product.findOne({ stock: newOffer.productName });
        if(productUpdate.categoryOfferRate && productUpdate.categoryOfferRate > offerRate){
          
            await product.findOneAndUpdate(
              { _id: productId },
              { $set: { productOfferRate: offerRate } }
            );

        }else{
            const productOfferRate = offerRate;
            const originalPrice = productUpdate.amount;
            const productOfferPrice =
            originalPrice - originalPrice * (productOfferRate / 100);
          // Update product with the calculated categoryOfferPrice
          await product.findOneAndUpdate(
            { _id: productUpdate._id },
            {
              $set: {
                offerPrice:productOfferPrice,
                productOfferRate: productOfferRate,
              },
            },
            { new: true }
          );
        } 
        massage = "Created Category Offer";
        res.json({ success: true, massage });
      } catch (error) {
        console.log(error);
      }
}

const deleteProductOffer = async(req,res)=>{
    try {
        const { _id } = req.body;
        const offerDetails = await offerProduct.findOne({ _id: _id });
        const productUpdate = await product.find({
          stock: offerDetails.productName
        });
        if(productUpdate.categoryOfferRate){
            await product.findOneAndUpdate(
                { _id: pro._id },
                { $unset: { productOfferRate: "" } },
                { new: true }
              );
              const categoryOfferRate = productUpdate.productOfferRate;
              const originalPrice = productUpdate.amount;
              const offerPrice =
                originalPrice - originalPrice * (categoryOfferRate / 100);
              console.log(offerPrice, "OfferPrice");
              // Update product with the calculated categoryOfferPrice
              await product.findOneAndUpdate(
                { _id: pro._id },
                {
                  $set: {
                    offerPrice: offerPrice,
                  },
                },
                { new: true }
              );
        }else{
           const update= await product.findOneAndUpdate(
                { stock: productUpdate.productName },
                { $unset: { offerPrice: "", productOfferRate: "" } },
                { new: true }
            );
            console.log(update,'update');
            
        }
        await offerProduct.findOneAndDelete({ _id: _id });
        res.json({ success: true });
      } catch (error) {
        console.log(error);
      }
}
const editProductOffer = async(req,res)=>{
    try {
        console.log(req.body);
        const { id, productId, offerRate, startDate, expiryDate } = req.body;
        const productDetails = await product.findOne({
          _id: new mongoose.Types.ObjectId(productId),
        });
        if (!productDetails) {
          throw Error("The category is not Exist");
        }
        const newOffer = await offerProduct.findOneAndUpdate(
          { _id: id },
          {
            productId,
            offerRate,
            startDate,
            expiryDate,
            productName: productDetails.stock,
          }
        );
        if(productDetails.categoryOfferRate && productDetails.categoryOfferRate > offerRate){
          
            await product.findOneAndUpdate(
              { _id: productId },
              { $set: { productOfferRate: offerRate } }
            );

        }else{
            const productOfferRate = offerRate;
            const originalPrice = productUpdate.amount;
            const productOfferPrice =
            originalPrice - originalPrice * (productOfferRate / 100);
          // Update product with the calculated categoryOfferPrice
          await product.findOneAndUpdate(
            { _id: productUpdate._id },
            {
              $set: {
                offerPrice:productOfferPrice,
                productOfferRate: productOfferRate,
              },
            },
            { new: true }
          );
        } 
        massage = "Category Offer Updated";
        res.json({ success: true, massage });
      } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
      }
}

const createReferralOffer = async(req,res)=>{
  createReferralOffer = await referral.create({offerAmount:200})
}

const updateReferralOffer = async(req,res)=>{
  try {
    const {referralAmount} = req.body
    const updatedReferral = await referral.findOneAndUpdate({}, { $set: { offerAmount: referralAmount } }, { new: true });
    if(updatedReferral){
      res.json({success : true})
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
    offer,
    productOffer,
    createProductOffer,
    deleteProductOffer,
    editProductOffer,
    createReferralOffer,
    updateReferralOffer
}