const coupon = require ('../../model/couponModel')

const getAddCouponPage = async(req,res)=>{
    res.render('adminViews/addCoupon')
}

const addCoupon = async(req,res)=>{
    try {
        
        console.log(req.body,'....................................................')
        const { couponName,code,description,value,minimumPurchaseAmount,maximumUses,expiryDate } = req.body
        console.log(couponName,code,description,value,minimumPurchaseAmount,maximumUses,expiryDate,'sdfhdjvbh')
        const newCoupon = await coupon.create({couponName,code,description,value,minimumPurchaseAmount,maximumUses,expiryDate})
        console.log(newCoupon,'newwwwwwwwwwwwwwwwwwwwwwwwwwww')


    } catch (error) {
        console.log(error)
    }    

}

const couponList = async (req,res)=>{
    const allCoupons = await coupon.find()
    console.log(allCoupons);
    res.render('adminViews/couponsList',{allCoupons})
}

const editCoupon = async(req,res)=>{
    console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaai')
    const { id} = req.params
    console.log(id,'...............................................................id')
    const currentCoupon = await coupon.findOne({_id:id})
    res.render('adminViews/editCoupon',{currentCoupon})
}

const editCouponPost = async (req,res)=>{
    console.log('hloooooo');
    const {couponName,code,description,value,minimumPurchaseAmount,maximumUses,expiryDate,_id} = req.body
    const editCoupon = await coupon.findOneAndUpdate({_id : _id},{$set:{couponName,code,description,value,minimumPurchaseAmount,maximumUses,expiryDate:expiryDate}},{new:true})
    console.log(editCoupon,'edited')
    res.json({success : true})
}



module.exports ={
    getAddCouponPage,
    addCoupon,
    couponList,
    editCoupon,
    editCouponPost
}