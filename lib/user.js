// a user logs in
// a user logs out
// a user has a state that needs to be mounted
// a user has changed its state etc.

const DB = "mongo";
const USER_DB = "costumer";

class User {
  constructor() {
    this.DbCollectionName = USER_DB;
    this.Db = DB;
  }


  // capability = req.app.locals.capability
  // session = req.session
  login(capability, session) {
  console.log(Chalk.blue.bold("<<<---- ENTERING PRELOGIN FUNCTION ---->>>"));
    switch (session.state.login.message) {
    case "success":
      capability.Communicate.loginResult(capability, { message: "success" }, session.state);
      capability.User.postLogin(capability, session);
      break;
    case "dbError":
      capability.Communicate.loginResult(capability, { message: "dbError" }, session.state);
      break;
    case "password":
      capability.Communicate.loginResult(capability, { message: "password" }, session.state);
      break;
    case "email":
      capability.Communicate.loginResult(capability, { message: "email" }, session.state);
      break;
    case "passport":
      capability.Communicate.loginResult(capability, { message: "passport" }, session.state);
      break;
    case "google":
      capability.Communicate.loginResult(capability, { message: "google" }, session.state);
      break;
    case "facebook":
      capability.Communicate.loginResult(capability, { message: "facebook" }, session.state);
      break;
    default:
      break;
    }
    console.log(Chalk.blue.bold("<<<---- EXITING PRELOGIN FUNCTION ----->>>"));
    return true;
  }

  // capability = req.app.locals.capability
  // session = req.session
  postLogin(capability, session) {

    // must change the session to a 'user'
    capability.makeSessionOwner(session, "user");

  }

}
