import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productID: {type: String, index: true},
  description: String,
  leatherType: [
    {
      material: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    },
  ],
  wheelDiameter: [
    {
      amount: {
        from: Number,
        to: Number,
      },
      unit: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    }
  ],
  thickness: [
    {
      amount: Number,
      unit: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    }
  ],
  length: [
    {
      amount: {
        from: Number,
        to: Number,
      },
      unit: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    },
  ],
  leatherColor: [
    {
      color: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    }
  ],
  threadColor: [
    {
      color: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    }
  ],
  spokes: [
    {
      description: String,
      amount: Number,
      unit: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    }
  ],
  colorOfSpokes: [
    {
      color: String,
      price: Number,
      priceUnit: String,
      stock: Number,
      enableStock: Boolean,
    }
  ],
})

const Product = mongoose.model("Product", productSchema);

export default Product;
