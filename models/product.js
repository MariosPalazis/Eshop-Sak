import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productID: {type: String, index: true},
  description: String,
  stock: Number,
  price: {
    amount: Number,
    unit: String,
  },
  shipping_price: {
    amount: Number,
    unit: String,
  },
  wheel_diameter: {
    amount: Number,
    unit: String,
  },
  thickness: {
    amount: Number,
    unit: String,
  },
  leather_color: String,
  thread_color: String,
  spokes: String,
  color_of_spokes: String,
})



const Product = mongoose.model("Product", productSchema);

export default Product;
