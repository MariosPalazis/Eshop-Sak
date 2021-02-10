import express from "express";
import Handlers from "../controllers/admin.js";
const Router = express.Router();

Router.get("/", Handlers.admin);
Router.get("/products/wheelCover", Handlers.wheelCover, Handlers.serverFailure);
Router.post("/update/wheelCover", Handlers.updateWheelCover);
Router.get("/products/sprayhood", Handlers.sprayhood, Handlers.serverFailure);
Router.get("/products/custom", Handlers.custom, Handlers.serverFailure);


export default Router;
