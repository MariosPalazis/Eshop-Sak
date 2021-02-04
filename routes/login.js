import express from "express";
import Handlers from "../controllers/login.js";
const Router = express.Router();


Router.get("/register", Handlers.renderRegister);
Router.post("/register", Handlers.register, Handlers.successfullRegistration);
Router.get("/login", Handlers.login);
Router.post("/login/local", Handlers.loginLocal, Handlers.postLogin, Handlers.localSuccess, Handlers.localFailure);
Router.get("/login/facebook", Handlers.loginFacebook);
Router.get("/login/facebook/callback", Handlers.loginFacebookCallback, Handlers.postLogin, Handlers.socialsSuccess, Handlers.socialsFailure);
Router.get("/login/google", Handlers.loginGoogle);
Router.get("/login/google/callback", Handlers.loginGoogleCallback, Handlers.postLogin, Handlers.socialsSuccess, Handlers.socialsFailure);
Router.get("/logout", Handlers.logout);


export default Router;
