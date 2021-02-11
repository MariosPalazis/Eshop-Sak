// Route handlers declaration for all products page.

// This are dummy handlers.

// IMPORTING THIRD-PARTY MODULES
import express from "express";
const Router = express.Router();


// IMPORTING MY OWN MODULES

// Router.get("/", (req, res) => {
//   res.render("products/products_dummy");
// })


// Router.get("/add/:productId", async (req, res) => {
//   console.log("add operation", req.params.productId);



//   try {
//     await req.app.locals.capability.ShoppingCart.addProduct(req.app.locals.capability, req.params.productId, req.session);

//   } catch (err) {
//     console.log(err);
//   }

//   console.log(req.session.state);
//   res.send("su");
// });

// Router.get("/remove/:productId", (req, res) => {
//   console.log(req.session);
//   console.log("remove operation", req.params.productId);
//   if (!req.session.state.anonymous.shoppingCart) {
//     res.send("empty");
//   } else {
//     //req.app.locals.capability.ShoppingCart.removeProduct(req.app.locals.capability, req.params.productId, req.session);
//     res.send("removed");
//   }

// })

Router.get("/wheelCover", (req, res) => {
  let index = req.app.locals.products.findIndex((element) => {
    return element.productID === "100";
  });

  // if it has not been found, which it should not happen, call the serverFailure middleware
  if (index === -1) {
    next();
  } else { // else render the wheelCover page, passing it the product
    console.log(req.app.locals.products[0]);
    res.render("products/wheelCover", {layout: "main", product: req.app.locals.products[index]});
  }
});

export default Router;
