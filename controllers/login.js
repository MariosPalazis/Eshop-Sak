// IMPORTING NPM MODULES
import Chalk from "chalk";

// IMPORTING OWN MODULES
import passport from "../lib/passport.js";
import CustomErrors from "../lib/errors.js";

export default {
  register(req, res) {
    res.render("register", {layout: "none"});
  },

  login(req, res) {
    res.render("login", {layout: "none"});
  },

  logout(req, res) {
    req.app.locals.capability.User.logout(req.session);
    res.redirect(303, "/");
  },

  test(req, res) {
    res.render("test");
  },

  loginLocal(req, res, next) {
    console.log(Chalk.yellow.bold("<<<---- INITIATING LOCAL LOGIN PROCCESS ---->>>"));
    passport.authenticate("local", (err, user, info) => {
      let loginPayload = {};
      if (err) {
        if (err instanceof CustomErrors.DbError) {
          loginPayload = {
            login: {
              loggedIn: false,
              url: req.originalUrl,
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
              url: req.originalUrl,
              method: "local",
              message: "email",
            },
            user: null,
          };
        } else if (info instanceof CustomErrors.ValidationError) {
          loginPayload = {
            login: {
              loggedIn: false,
              url: req.originalUrl,
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
                url: req.originalUrl,
                method: "local",
                message: "passport",
              },
              user: user,
            };
          } else {
            loginPayload = {
              login: {
                loggedIn: true,
                url: req.originalUrl,
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
    req.app.locals.urlOrigin = req.query.urlOrigin;
    passport.authenticate("facebook")(req, res, next);
  },
  loginFacebookCallback(req, res, next) {
    passport.authenticate("facebook", (err, user, info) => {
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
      delete req.app.locals.urlOrigin;
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
      delete req.app.locals.urlOrigin;
      res.locals.capability.constructSessionState(req.session, loginPayload);
      next();
    })(req, res, next);
  },

  postLogin(req, res, next) {
    console.log(Chalk.cyan.bold("<<<---- INITIATING POST LOGIN PROCCESS ---->>>"));
    res.locals.capability.User.login(res, req);
    console.log(req.session);
    next();
  },

  localSuccess(req, res, next) {
    console.log(Chalk.cyan.bold("<<<---- TERMINATING POST LOGIN PROCCESS ---->>>"));
    if (!req.session.state.login.loggedIn) {
      next();
    } else {
      console.log(Chalk.red.bold("<<<---- SUCCESSFULL LOGIN ---->>>"));
      console.log(Chalk.yellow.bold("<<<--- TERMINATING LOCAL LOGIN PROCCESS ---->>>"));
      switch (req.session.state.login.url) {
      case "/login/local":
        res.send("/");
        break;
      case "/checkout/login/local":
        res.send("/checkout/address");
        break;
      default:
        res.send("/");
        break;
      }
    }
  },

  localFailure(req, res) {
    console.log(Chalk.red.bold("<<<---- FAILED LOGIN ---->>>"));
    console.log(Chalk.yellow.bold("<<<---- TERMINATING LOCAL LOGIN PROCCESS ---->>>"));
    switch (req.session.state.login.url) {
    case "/login/local":
      res.send("/login");
      break;
    case "/checkout/login/local":
      res.send("/checkout/login");
      break;
    default:
      res.send("/login");
      break;
    }
  },

  socialsSuccess(req, res, next) {
    if (!req.session.state.login.loggedIn) {
      next();
    } else {
      console.log(Chalk.red.bold("<<<---- SUCCESSFULL LOGIN ---->>>"));
      console.log(Chalk.yellow.bold("<<<---- TERMINATING SOCIAL LOGIN PROCCESS ---->>>"));
      switch (req.session.state.login.url) {
      case "/login":
        res.redirect(303, "/");
        break;
      case "/checkout/login":
        res.redirect(303, "/checkout/address");
        break;
      default:
        res.redirect(303, "/");
        break;
      }
    }
  },
  socialsFailure(req, res) {
    console.log(Chalk.red.bold("<<<---- FAILED LOGIN ---->>>"));
    console.log(Chalk.yellow.bold("<<<---- TERMINATINGC SOCIAL LOGIN PROCCESS ---->>>"));
    switch (req.session.state.login.url) {
    case "/login":
      res.redirect(303, "/login");
      break;
    case "/checkout/login/":
      res.redirect(303, "/checkout/login");
      break;
    default:
      res.redirect(303, "/login");
      break;
    }
  }
}
