import express from "express";
import Handlers from "../controllers/checkout.js";
const Router = express.Router();


Router.get("/", Handlers.checkoutLogin);
Router.get("/address", Handlers.checkoutAddress);
Router.post("/address", Handlers.postCheckoutAddress);


export default Router;
