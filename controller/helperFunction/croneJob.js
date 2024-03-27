const  cron = require('node-cron');
const offerCategory = require('../../model/categoryOfferModel')
const Category = require('../../model/categoryModel');
const product = require('../../model/productModel');

const categoryOffer = async(req,res)=>{
    try {
        const currentDate = new Date()
      const categoryOffer = await offerCategory.find({expiryDate:{$lt:currentDate}})
      if(categoryOffer.length > 0){
        for(const offer of categoryOffer){
            const expireCategory = await Category.findOne({ CategoryName: offer.categoryName });
            const categoryId = expireCategory._id
            const productUpdate = await product.find({category:categoryId})
            productUpdate.forEach(async (pro) => {
                await product.findOneAndUpdate(
                    { _id: pro._id },
                    { $unset: { categoryOfferPrice: "" } },
                    { new: true }
                );
            });
            await offerCategory.findOneAndDelete({_id : offer._id})
        }
      }
    } catch (error) {
       console.log(error) 
    }
}


cron.schedule('*/10 * * * *',async () => {
    try {
        console.log('running a task every 10 minutes');
        await categoryOffer()
        
    } catch (error) {
       console.log(error) 
    }
});

module.exports = categoryOffer