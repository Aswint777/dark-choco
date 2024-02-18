

const userOrderHistoryPage = async(req,res)=>{
    console.log('dhfbvdkjfn')
    res.render('userViews/userOrderHistory')
}


const userOrderDetails = async(req,res)=>{
    res.render('userViews/userOrderDetailsPage')
}

module.exports = {
    userOrderHistoryPage,
    userOrderDetails
}