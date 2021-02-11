import express from "express";
import ShoppingCart from "../lib/shopping_cart.js";
let myShop = new ShoppingCart;
const Router = express.Router();

Router.get("/", (req, res) => {
  console.log("this is th shopping Cart router");
  let capability = req.app.locals.capability;
  myShop.seedShoppingCart(req.session);
  console.log(req.session);
  res.redirect(303, "/");
})

Router.get("/wheelCover", async (req, res) => {
  await myShop.addProduct(req.app.locals, "100", req.session);
  res.redirect(303, "/");
})

Router.get("/sprayhood", (req, res) => {
  myShop.addProduct(req.app.locals, "200", req.session);
  console.log(req.session);
  res.redirect(303, "/");

})

export default Router;
