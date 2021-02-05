// IMPORTING NPM MODULES
import Chalk from "chalk";

// IMPORTING OWN MODULES
import passport from "../lib/passport.js";
import CustomErrors from "../lib/errors.js";

export default {
  renderRegister(req, res) {
    // if there is no query string it means the register page
    // was accessed through the navigation bar, not from any of the
    // other routes such as through the login component, either at:
    // /login or /checkout/login
    req.session.urlOrigin = req.query.urlOrigin || "/register";
    res.render("register", {layout: "none"});
  },

  async register(req, res, next) {
    console.log(Chalk.yellow.bold("<<<------ INITIATING REGISTRATION PROCCESS ----->>>"));

    if (await req.app.locals.capability.User.register(req.app.locals.capability, req.session, req.body)) {
      console.log(Chalk.yellow.bold("<<<----- REGISTRATION PROCCESS SUCCESSFULL ----->>>"));
      next();
    } else {
      console.log(Chalk.yellow.bold("<<<----- REGISTRATION PROCCESS FAILED ----->>>"));
      res.send("/register");
    }
  },

  login(req, res) {
    res.render("login", {layout: "none"});
  },

  logout(req, res) {
    req.app.locals.capability.User.logout(req.session);
    res.redirect(303, "/");
  },

  loginLocal(req, res, next) {
    console.log(Chalk.yellow.bold("<<<---- INITIATING LOCAL LOGIN PROCCESS ---->>>"));


    // it is the query string parameter req.query.urlOrigin that
    // provides the logic for where a successfull or unsuccessfull login
    // will land. But because the register process also sets that property
    // i am making sure that the loginLocal function has not been called
    // by the register function. If it has then the req.session.urlOrigin will
    // already be set.
    if (!req.session.urlOrigin) req.session.urlOrigin = req.query.urlOrigin;

    passport.authenticate("local", (err, user, info) => {
      let loginPayload = {};
      if (err) {
        if (err instanceof CustomErrors.DbError) {
          loginPayload = {
            login: {
              loggedIn: false,
              method: "local",
              message: "dbError",
            },
            user: null,
          };
        }
      } else if (!user) {
        if (info instanceof CustomErrors.UserNotFound) {
          loginPayload = {
            login: {
              loggedIn: false,
              method: "local",
              message: "email",
            },
            user: null,
          };
        } else if (info instanceof CustomErrors.ValidationError) {
          loginPayload = {
            login: {
              loggedIn: false,
              method: "local",
              message: "password",
            },
            user: null,
          };
        }
    } else {
        req.logIn(user, (err) => {
          if (err) {
            loginPayload = {
              login: {
                loggedIn: false,
                method: "local",
                message: "passport",
              },
              user: user,
            };
          } else {
            loginPayload = {
              login: {
                loggedIn: true,
                method: "local",
                message: "success",
              },
              user: user,
            };
          }
        })
      }
      res.locals.capability.constructSessionState(req.session, loginPayload);
      next();
    })(req, res, next);
  },

  loginFacebook(req, res, next) {
    console.log(Chalk.yellow.bold("<<<----- INITIATING FACEBOOK LOGIN PROCCESS ---->>>"));
    req.app.locals.urlOrigin = req.session.urlOrigin || req.query.urlOrigin;
    passport.authenticate("facebook")(req, res, next);
  },
  loginFacebookCallback(req, res, next) {
    passport.authenticate("facebook", (err, user, info) => {
      let loginPayload = {};
      if (err) {
        loginPayload = {
          login: {
            loggedIn: false,
            method: "social",
            message: "dbError",
          },
          user: null,
        };
      } else if (!user) {
        loginPayload = {
          login: {
            loggedIn: false,
            method: "social",
            message: "facebook",
          },
          user: null,
        };
      } else {
        req.logIn(user, (err) => {
          if (err) {
            loginPayload = {
              login: {
                loggedIn: false,
                method: "social",
                message: "passport",
              },
              user: user,
            };
          } else {
            loginPayload = {
              login: {
                loggedIn: true,
                method: "social",
                message: "success",
              },
              user: user,
            };
          }
        })
      }
      res.locals.capability.constructSessionState(req.session, loginPayload);
      next();
    })(req, res, next);
  },

  loginGoogle(req, res, next) {
    console.log(Chalk.yellow.bold("<<<---- INITIATING GOOGLE LOGIN PROCCESS ---->>>"));
    req.app.locals.urlOrigin = req.query.urlOrigin;
    passport.authenticate("google")(req, res, next);
  },
  loginGoogleCallback(req, res, next) {
    passport.authenticate("google", (err, user, info) => {
      let loginPayload = {};
      if (err) {
        loginPayload = {
          login: {
            loggedIn: false,
            url: req.app.locals.urlOrigin,
            method: "social",
            message: "dbError",
          },
          user: null,
        };
      } else if (!user) {
        loginPayload = {
          login: {
            loggedIn: false,
            url: req.app.locals.urlOrigin,
            method: "social",
            message: "google",
          },
          user: null,
        };
      } else {
        req.logIn(user, (err) => {
          if (err) {
            loginPayload = {
              login: {
                loggedIn: false,
                url: req.app.locals.urlOrigin,
                method: "social",
                message: "passport",
              },
              user: user,
            };
          } else {
            loginPayload = {
              login: {
                loggedIn: true,
                url: req.app.locals.urlOrigin,
                method: "social",
                message: "success",
              },
              user: user,
            };
          }
        })
      }
      res.locals.capability.constructSessionState(req.session, loginPayload);
    })(req, res, next);
  },

  postLogin(req, res, next) {
    console.log(Chalk.cyan.bold("<<<---- INITIATING POST LOGIN PROCCESS ---->>>"));
    res.locals.capability.User.login(res, req.session);
    next();
  },

  localSuccess(req, res, next) {
    console.log(Chalk.cyan.bold("<<<---- TERMINATING POST LOGIN PROCCESS ---->>>"));
    if (!req.session.state.login.loggedIn) {
      next();
    } else {
      console.log(Chalk.red.bold("<<<---- SUCCESSFULL LOGIN ---->>>"));
      console.log(Chalk.yellow.bold("<<<--- TERMINATING LOCAL LOGIN PROCCESS ---->>>"));
      switch (req.session.urlOrigin) {
      case "/checkout": // will be changed to /checkout/login eventuall
        delete req.session.urlOrigin;
        res.send("/checkout/address");
        break;
      default:
        delete req.session.urlOrigin;
        res.send("/");
        break;
      }
    }
  },

  localFailure(req, res) {
    console.log(Chalk.red.bold("<<<---- FAILED LOGIN ---->>>"));
    console.log(Chalk.yellow.bold("<<<---- TERMINATING LOCAL LOGIN PROCCESS ---->>>"));
    switch (req.session.urlOrigin) {
    case "/checkout": // will be changed to /checkout/login eventually
      delete req.session.urlOrigin;
      res.send("/checkout/login");
      break;
    default:
      delete req.session.urlOrigin;
      res.send("/login");
      break;
    }
  },

  socialsSuccess(req, res, next) {
    console.log(Chalk.cyan.bold("<<<---- TERMINATING POST LOGIN PROCESS ----->>>"));
    if (!req.session.state.login.loggedIn) {
      next();
    } else {
      console.log(Chalk.red.bold("<<<---- SUCCESSFULL LOGIN ---->>>"));
      console.log(Chalk.yellow.bold("<<<---- TERMINATING SOCIAL LOGIN PROCCESS ---->>>"));
      switch (req.app.locals.urlOrigin) {
      case "/checkout": // will be changed to checkout/login eventually
        delete req.app.locals.urlOrigin;
        res.redirect(303, "/checkout/address");
        break;
      default:
        delete req.app.locals.urlOrigin;
        res.redirect(303, "/");
        break;
      }
    }
  },

  socialsFailure(req, res) {
    console.log(Chalk.red.bold("<<<---- FAILED LOGIN ---->>>"));
    console.log(Chalk.yellow.bold("<<<---- TERMINATINGC SOCIAL LOGIN PROCCESS ---->>>"));
    switch (req.app.locals.urlOrigin) {
    case "/checkout": // will be changed to checkout/login eventually
      delete req.app.locals.urlOrigin;
      if (req.session.urlOrigin) delete req.session.urlOrigin;
      res.redirect(303, "/checkout/login");
      break;
    default:
      delete req.app.locals.urlOrigin;
      if (req.session.urlOrigin) delete req.session.urlOrigin;
      res.redirect(303, "/login");
      break;
    }
  }
}
