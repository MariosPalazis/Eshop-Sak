import express from "express";
import Handlers from "../controllers/checkout.js";
import myMiddleware from "../lib/middleware.js";
const Router = express.Router();

// /checkout/address
Router.get("/address", myMiddleware.isLoggedIn, Handlers.checkoutAddress);
Router.post("/address", myMiddleware.isLoggedIn, Handlers.postCheckoutAddress);


// only gets there after the middleware isLoggedIn authorizes you
Router.get("/login", Handlers.checkoutLogin);



export default Router;
