import passport from "passport";
import LocalPassport from "passport-local";
import FacebookPassport from "passport-facebook";
import Chalk from "chalk";
const LocalStrategy = LocalPassport.Strategy;
const FacebookStrategy = FacebookPassport.Strategy;




// IMPORTING MY OWN MODULES //
// ----------------------- //
import CustomErrors from "./errors.js";
import config from "../config/config.js";
import Costumer from "../models/costumer.js";
import Validation from "./validation.js";
const Validate = new Validation();
// IMPORTING MY OWN MODULES STOPS HERE
// ------------------------------ //




passport.deserializeUser((userId, done) => {
  console.log("deserializing");

  Costumer.findById(userId)
    .then(user => done(null, user))
    .catch(err => {
      done(err, null);
    })
});

passport.serializeUser((user, done) => {
  console.log("serializing ");
  done(null, user._id);
});



///////////////////////////////
// LOCAL STRATEGY DEFINITION //
///////////////////////////////
const localCallback = (username, password, done) => {
  console.log(Chalk.yellow.bold("<<<-------- PASSPORT TRYING TO AUTHENTICATE -------->>>"));
  Costumer.findOne({email: username}).lean()
    .then(async user => {
      if (!user) { // means a user with that email does not exist
        console.log(Chalk.yellow.bold("<<<------- PASSPORT DID NOT FOUND ANY USER WITH SUCH EMAIL ------->>>"));
        return done(null, false, CustomErrors.userNotFound());
      }
      if (! await Validate.isValidPass(password, user.password)) {
        console.log(Chalk.yellow.bold("<<<------- PASSPORT FAILED TO VALIDATE -------->>>"));
        return done(null, false, CustomErrors.validationError("Incorrect password"));
      } else {
        console.log(Chalk.yellow.bold("<<<------ PASSPORT SUCCESSFULLY AUTHENTICATED ------>>>"));
        return done(null, user);
      }
    })
    .catch(err => {
      return done(CustomErrors.dbError("Server error"));
    })
}
//////////////////////////////
// LOCAL STRATEGY ENDS HERE //
//////////////////////////////



//////////////////////////////////
// FACEBOOK STRATEGY DEFINITION //
//////////////////////////////////
const facebookOptions = {
  clientID: config.credentials.authProviders.facebook.appId,
  clientSecret: config.credentials.authProviders.facebook.appSecret,
  callbackURL: "/login/facebook/callback",
}

const facebookCallback = (accessToken, refreshToken, profile, done) => {
  console.log(Chalk.yellow.bold("<<<-------- PASSPORT TRYING TO AUTHENICATE USING FACEBOOK ------>>>"));
  const authId = "facebook:" + profile.id;
  Costumer.findOne({authId: authId}).lean()
    .then(async user => {
      if (user) {
        console.log(Chalk.yellow.bold("<<<------- PASSPORT SUCCESSFULLY AUTHENTICATED FACEBOOK USER ----->>>"));
        user._id = user._id.toString();
        return done(null, user);
      } else {
        console.log(Chalk.yellow.bold("<<<-------- PASSPORT TRYING TO CREATE A NEW USER USING FACEBOOK AUTHENTICATION ------->>>"));

        let newCostumer = new Costumer({
          email: "",
          authId: authId,
          firstName: profile.displayName,
          signUpMethod: "facebook",
        });

        newCostumer = await newCostumer.save();
        console.log(typeof newCostumer._id);
        if (newCostumer) {
          console.log(Chalk.yellow.bold("<<<------ PASSPORT CREATED USER USING FACEBOOK AUTHENTICATION ------->>>"));
          return done(null, newCostumer);
        } else {
          console.log(Chalk.yellow.bold("<<<------- PASSPORT FAILED TO CREATE USER USING FACEBOOK AUTHENTICATION ------>>>"));
          return done(err, null);
        }
      }
    })
    .catch(err => {
      return done(err);
    })
}
/////////////////////////////////
// FACEBOOK STRATEGY ENDS HERE //
/////////////////////////////////



const localStrategy = new LocalStrategy({usernameField: "email", passwordField: "password"}, localCallback);
const fbStrategy = new FacebookStrategy(facebookOptions, facebookCallback);

passport.use(localStrategy);
passport.use(fbStrategy);

export default passport;
