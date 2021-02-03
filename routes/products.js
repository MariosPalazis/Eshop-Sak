// Route handlers declaration for all products page.

// This are dummy handlers.

// IMPORTING THIRD-PARTY MODULES
import express from "express";
const Router = express.Router();


// IMPORTING MY OWN MODULES

Router.get("/", (req, res) => {
  res.render("products/products_dummy");
})


Router.get("/add/:productId", async (req, res) => {
  console.log("add operation", req.params.productId);



  try {
    await req.app.locals.capability.ShoppingCart.addProduct(req.app.locals.capability, req.params.productId, req.session);

  } catch (err) {
    console.log(err);
  }

  console.log(req.session.state);
  res.send("su");
});

Router.get("/remove/:productId", (req, res) => {
  console.log(req.session);
  console.log("remove operation", req.params.productId);
  if (!req.session.state.anonymous.shoppingCart) {
    res.send("empty");
  } else {
    //req.app.locals.capability.ShoppingCart.removeProduct(req.app.locals.capability, req.params.productId, req.session);
    res.send("removed");
  }

})

export default Router;
