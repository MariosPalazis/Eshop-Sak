import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {type: String, index: true},
  costumerId: {type: String, index: true}, // email
  contactAddress: {type: String}, // email
  paymentId: {type: String, index: true}, // stripe
  amount: {type: Number},
  status: {type: String}, // active, proccessing, sending, received,
  paymentStatus: {type: String}, // pending, received, refunded, problem
  currency: {type: String},
  date: {type: String},
  billing: {
    billingId: {type: String, index: true},
    status: Boolean,
    firstName: {type: String},
    lastName: {type: String},
    address: {type: String},
    city: {type: String},
    country: {type: String},
    postCode: {type: String}
  },
  shipping: {
    shippingId: {type: String, index: true},
    status: Boolean,
    firstName: {type: String},
    lastName: {type: String},
    address: {type: String},
    city: {type: String},
    country: {type: String},
    postCode: {type: String},
    tel: {type: Number},
  },
  shoppingCart: String,
  comment: String,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
