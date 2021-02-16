import express from "express";
import Handlers from "../controllers/shoppingCart.js";
const Router = express.Router();


Router.get("/", Handlers.shoppingCart);
Router.post("/add", Handlers.addProduct);
Router.post("/reduce", Handlers.reduceProduct);
Router.post("/remove", Handlers.removeProduct);

export default Router;
