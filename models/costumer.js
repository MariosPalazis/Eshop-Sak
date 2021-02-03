import mongoose from "mongoose";
const costumerSchema = new mongoose.Schema({
  email: { type: String, index: true },
  authId: { type: String, index: true},
  password: {type: String},
  firstName: String,
  lastName: String,
  signUpMethod: String,
  validated: Boolean,
  mobile: Number,
  shipping: [
    {
      shippingId: {type: String, index: true},
      status: Boolean,
      firstName: {type: String},
      lastName: {type: String},
      address: {type: String},
      city: {type: String},
      country: {type: String},
      postCode: {type: String}
    }
  ],
  billing: [
    {
      billingId: {type: String, index: true},
      status: Boolean,
      firstName: {type: String},
      lastName: {type: String},
      address: {type: String},
      city: {type: String},
      country: {type: String},
      postCode: {type: String}
    }
  ],
  shoppingCart: String
});



const Costumer = mongoose.model("Costumer", costumerSchema);

export default Costumer
