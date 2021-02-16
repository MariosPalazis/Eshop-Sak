// IMPORTING THIRD-PARTY MODULES
import express from "express";
import Handlers from "../controllers/products.js";
const Router = express.Router();

Router.get("/wheelCover", Handlers.wheelCover);
Router.get("/sprayhood", Handlers.sprayhood);
Router.get("/custom", Handlers.custom);

export default Router;
