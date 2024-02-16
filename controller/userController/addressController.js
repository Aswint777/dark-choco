

const Address = require("../../model/addressModel");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');

// getAddAddressModal = async (req,res)=>{
//   try{
//     const token = req.cookies.loginToken;
//     const data = jwt.verify(token, process.env.SECRET_KEY);
//     const { userId } = data;
//     const addressList = await address.find({userData:userId})
//     console.log(addressList)
//     res.render('componentViews/addressModaal')
//   }catch(error){
//     console.log(error)
//   }
// }

const addAddressPost = async (req, res) => {
  try {
    console.log("ldsksdfjdfs");
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    console.log(userId, "djdfvkdjfvjdfvdkfjvkd");
    // console.log(req.body)
    const {
      firstName,
      secondName,
      address,
      country,
      state,
      city,
      pinCode,
      email,
      phoneNumber,
    } = req.body;
    let createAddress;
    createAddress = await Address.findOne({ userData: userId });
    let userNewAddress = false;

    if (createAddress) {
      createAddress.addressData.forEach((addressEntry) => {
        console.log(addressEntry.address,'gggggggggg')
        if (addressEntry.address == address) {
          console.log("hallow world");
          throw Error("the address already exist");
        } else {
          userNewAddress = true;
        }
      });
      if (userNewAddress == true) {
        console.log("FJEOIFOIIWOK");
        const updatedAddress = await Address.findOneAndUpdate(
          { userData: userId }, // Query condition to find the address based on userId
          {
            $push: {
              // Using $push to add a new element to the addressData array
              addressData: {
                // New address data to be added to the array
                firstName: firstName,
                secondName: secondName,
                address: address,
                country: country,
                state: state,
                city: city,
                pinCode: pinCode,
                email: email,
                phoneNumber: phoneNumber,
              },
            },
          },
          { new: true } // Return the updated document
        );
        console.log(updatedAddress, "lllllllll");
      }
    } else {
      createAddress = await Address.create({
        userData: userId,
        addressData: [
          {
            firstName,
            secondName,
            address,
            country,
            state,
            city,
            pinCode,
            email,
            phoneNumber,
          },
        ],
      });
      console.log(createAddress,'kkkkk');
    }
    res.json({ success: true });
} catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const editAddress = async (req,res)=>{

    console.log(req.body,'entered')
    try{
      const token = req.cookies.loginToken;
      const data = jwt.verify(token, process.env.SECRET_KEY);
      const { userId } = data;
      const {firstName,secondName,address,country,state,city,pinCode,email,phoneNumber,address_id} = req.body
      console.log('ugiogjoisgj')
      // const existingAddress = await Address.findOneAndUpdate({userData:userId,address},{$set:{firstName,secondName,address,country,state,city,pinCode,email,phoneNumber}})
      const existingAddress = await Address.findOneAndUpdate(
        { userData: userId ,'addressData._id':new mongoose.Types.ObjectId(address_id.trim())},
        {
          $set: {
            "addressData.$[elem].firstName": firstName,
      "addressData.$[elem].secondName": secondName,
      "addressData.$[elem].address": address,
      "addressData.$[elem].country": country,
      "addressData.$[elem].state": state,
      "addressData.$[elem].city": city,
      "addressData.$[elem].pinCode": pinCode,
      "addressData.$[elem].email": email,
      "addressData.$[elem].phoneNumber": phoneNumber,

          },
        },
        {
          arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(address_id.trim()) }],
          new: true,
        }
      );
      
     console.log(existingAddress,'address updated')
    }catch(error){
      res.status(400).json({ error: error.message });
    }
}

const deleteAddress = async (req,res)=>{
  try{
    console.log('delete one')
    const token = req.cookies.loginToken;
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = data;
    const {id} = req.body 
    console.log(id,'ooooooooo')
    const result = await Address.updateOne(
      { userData: userId },
      { $pull: { addressData: { _id: new mongoose.Types.ObjectId(id.trim()) } } }
    );
    console.log(result,'hhhhhhhhhhhhhhhhhh')
  }catch(error){
    res.status(400).json({ error: error.message });

  }
}

module.exports = {
  addAddressPost,
  editAddress,
  deleteAddress

};
