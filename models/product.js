import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   productID: {type: String, index: true},
//   description: String,
//   stock: Number,
//   price: {
//     amount: Number,
//     unit: String,
//   },
//   shipping_price: {
//     amount: Number,
//     unit: String,
//   },
//   wheel_diameter: {
//     amount: Number,
//     unit: String,
//   },
//   thickness: {
//     amount: Number,
//     unit: String,
//   },
//   leather_color: String,
//   thread_color: String,
//   spokes: String,
//   color_of_spokes: String,
// })


const productSchema = new mongoose.Schema({
  productID: {type: String, index: true},
  description: String,
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
    }
  ],
  thickness: [
    {
      amount: Number,
      unit: String,
      price: Number,
      priceUnit: String,
      stock: Number,
    }
  ],
  leatherColor: [
    {
      color: String,
      price: Number,
      priceUnit: String,
      stock: Number,
    }
  ],
  threadColor: [
    {
      color: String,
      price: Number,
      priceUnit: String,
      stock: Number,
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
    }
  ],
  colorOfSpokes: [
    {
      color: String,
      price: Number,
      priceUnit: String,
      stock: Number,
    }
  ],
})

const Product = mongoose.model("Product", productSchema);

export default Product;
