import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productID: {type: String, index: true},
  stock: Number,
  price: Number,
  description: String,
  images: {
    active: [{
      mini: String,
      medium: String,
      large: String
    }],
    inactive: [String]
  },
  productDetails: {
    description: String,
    material: String,
    careInstructions: String
  }
})

const Product = mongoose.model("Product", productSchema);

export default Product;
