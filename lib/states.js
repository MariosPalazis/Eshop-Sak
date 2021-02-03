import Chalk from "chalk";
import EventEmitter from "events";
import * as bcrypt from "./pass_encrypt.js";
import * as customErrors from "./errors.js";
const stateChange = new EventEmitter();


// IMPORTING MY OWN MODULES STARTS HERE //
// ------------------------- //
import Validation from "./validation.js";
import Database from "./db_abstractions.js";

// IMPORTING MY OWN MODULES STOPS HERE //
// ----------------------------------- //

// DECLARATION OF CONSTANT VARIABLES //
// -------------------------------- //
const DB = "mongo";
const USER_DB = "costumer";
const PRODUCTS_DB = "product";
const PRODUCT_DB_KEY = "productID";
// END DECLARATION OF CONSTANT VARIABLES //
// ------------------------------------ //

stateChange.on("globalStateChange", (res, newState) => {
  res.locals.state = newState;
  console.log(Chalk.red.bold("<<<------ GLOBAL STATE CHANGED ------->>>"));
  console.log(Chalk.blue.bold("NEW GLOBAL STATE: "));
  console.log(res.locals.state);
})

stateChange.on("addFlashMessage", (session, flashMessage) => {

  if (!session.flashes) {
    session.flashes = [];
    session.flashes.push(flashMessage);
  } else {
    session.flashes.push(flashMessage);
  }
  console.log(Chalk.red.bold(`<<<----- FLASH MESSAGE ${flashMessage.type} ADDED TO GLOBAL STATE ------>>>`));
})

stateChange.on("removeFlashMessage", (res, index) => {
  delete res.locals.flash;
  console.log(Chalk.red.bold("<<<-------- FLASH MESSAGE DELETED FROM GLOBAL STATE"));
})

stateChange.on("localStateChange", (msg) => {
  if (msg) {
    console.log(Chalk.red.bold(msg));
    console.log(Chalk.red.bold("<<<------- LOCAL STATE CHANGED -------->>>"));
  } else {
    console.log(Chalk.red.bold("<<<------- LOCAL STATE CHANGED -------->>>"));
  }
})


stateChange.on("sessionOwnerChange",(sessionOwner) => {
  console.log(Chalk.cyan.bold(`SESSION OWNER CHANGED TO ${sessionOwner}`));
})

class Session {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.Validate = new Validation(); // imported from /lib/validation.js
    this.Database = new Database(); // imported from /lib/db_abstractions.js
    this.User = new User(); // not imported, defined here
    this.Anonymous = new Anonymous(); // not imported, defined here
    this.Communicate = new Communicate(); // not imported, defined here
    this.state = undefined;
    this.stateEvent = stateChange; // defined here, at the topmost scope
    this.sessionOwner = "Anonymous";
  }
  updateState(res) {
    let localUser = "";
    if (this.sessionOwner !== "Anonymous") localUser = "User";
    else localUser = "Anonymous";

    if (this[localUser].hasState()) {
      console.log(Chalk.red.bold(`>>>LOADING ${this.sessionOwner}'s LOCAL STATE TO GLOBAL STATE<<<`));
      this.state = this[localUser].state;
    } else {
      console.log(Chalk.red.bold(`FAILED TO LOAD ${this.sessionOwner}'s LOCAL STATE TO GLOBAL STATE`));
      this.state = undefined;
    }
    this.stateEvent.emit("globalStateChange", res, this.state);
  }
  loginData(data) {
    console.log("hello");
  //  this.login = data;
  }
}

class User {
  constructor() {
    //this.ShoppingCart = new ShoppingCart(this);
    this.DbCollectionName = USER_DB;
    this.Db = DB;
  }
  seedUser() {
    if (this.state.email) {
      console.log("email exists", this.state.email);
    }

    if (this.state.authId) {
      console.log("authorization id exists", this.state.authId);
    }
  }
  async getUser(session) {
    console.log(Chalk.magenta.bold(`FETCHING ${this.Id} FROM DATABASE`));
    try {
      const data = await session.Database.fetchDocumentDb(this.Db, this.IdType, this.Id, this.DbCollectionName);
      if (!data) {
        console.log(Chalk.magenta.bold(`FECHING ${this.Id} FROM DATABASE FAILED`));
        return false;
      } else {
        console.log(Chalk.magenta.bold(`${this.Id} FETCHED FROM DATABASE`));
        this.state = data;
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
  hasState() {
    if (!this.state || (Object.keys(this.state).length === 0 &&
                        this.state.constructor === Object)) {
      console.log(Chalk.blue.bold(`USER DOES NOT HAVE A LOCAL STATE`));
      return false;
    } else {
      console.log(Chalk.blue.bold(`${this.state.firstName} DOES HAVE A LOCAL STATE`));
      return true;
    }
  }
  switchDataFormat(session) {
    console.log(Chalk.yellow.bold("<<<------ INITIATING DATA FORMAT SWITCH PROCCESS ------>>>"));
    if (! this.hasState()) {
      console.log(Chalk.blue.bold("USER DOES NOT HAVE A STATE, THEREFORE CANNOT SWITCH DATA FORMAT"));
      return false;
    }

    try {
      // Shopping Cart
      if (typeof this.state.shoppingCart == "string") this.ShoppingCart.toArray();
      else this.ShoppingCart.toString();

      // Addresses


      // Credit Cards

      console.log(Chalk.red.bold(">>>DATA FORMAT SWITCH<<<"));
      session.stateEvent.emit("localStateChange");
    } catch (err) {
      console.log(Chalk.red.bold(">>>PROBLEM SWITCHING DATA FORMAT<<<"));
      throw err;
    }
    console.log(Chalk.yellow.bold("<<<------- FINISHED DATA FORMAT SWITCH PROCCESS ------>>>"));
  }
  preLogin(session) {
    console.log(session);
    res.send("success");
    // console.log("pre login from session object called");
    // switch (session.login.login.message) {
    // case "success":
    //   console.log("success login");
    //   session.Communicate.postLogin(session, {message: "Login successfull", status: true});
    //   session.User.postLogin(res, session);
    //   break;
    // case "dbError":
    //   console.log(session.login.message);
    //   break;
    // case "password":

    //   console.log(session.login.message);
    //   break;
    // case "email":

    //   console.log(session.login.message);
    //   break;
    // case "passport":

    //   console.log(session.login.message);
    //   break;
    // case "google":

    //   console.log(session.login.message);
    //   break;
    // case "facebook":

    //   console.log(session.login.message);
    //   break;
    // default:
    //   break;
    // }
  }
  postLogin(res, session) {
    // the req parameter contains the user's state as that is drawn from the database
    // by passport 
    // remove any left over state from the Anonymous User
    // Ask the user if the Anonymou's user shoppingCart if any wants to be transfered to him
    // Do not wait for an answer, change the owner of the session
    // emit an event that the session owner has changed
    // switch state
    console.log(Chalk.yellow.bold("<<<------- INITAITING POST LOGIN PROCCESS -------->>>"));
    //this.seedUser();
    // if (session.getState()) session.removeState(res);
    // session.Client.askShoppingcart(res, session);
    // this.switchDataFormat(session);
    // session.switchState(res, this.state.firstName);
    res.send("success");
    console.log(Chalk.yellow.bold("<<<------- POST LOGIN PROCCESS FINISHED -------->>>"));
  }

  async stateToDb(session, newData) {
  }
}
class Anonymous {
  constructor() {
    //this.ShoppingCart = new ShoppingCart(this);
  }

  hasState() {
    if (!this.state || (Object.keys(this.state).length === 0 &&
                        this.state.constructor === Object)) {
      console.log(Chalk.blue.bold("ANONYMOUS DOES NOT HAVE A LOCAL STATE"));
      return false;
    } else {
      console.log(Chalk.blue.bold("ANONYMOUS DOES HAVE A LOCAL STATE"));
      return true;
    }
  }
}

class Communicate {
  constructor() {
    this.FlashMessage = new FlashMessage();
  }
  postLogin(session, data) {
    console.log(Chalk.blue.bold("INFORM USER ON THE RESULTS OF HIS ATTEMPT TO LOGIN"));
    session.stateEvent.emit("addFlashMessage", session, this.FlashMessage.postLogin(data.message, data.status));
  }
}

class FlashMessage {
  postLogin(message, status) {
    return {
      type: "postLogin",
      message: message,
      status: status,
    }
  }
}

class ShoppingCart {
  constructor(owner) {
    this.owner = owner;
    this.DbCollectionName = PRODUCTS_DB;
    this.DbKey = PRODUCT_DB_KEY;
    this.Db = DB;
  }
  has() {
    if (this.owner.state && this.owner.state.shoppingCart) {
      console.log(Chalk.blue.bold(`${this.owner.state.firstName} HAS A SHOPPING CART`));
      return true;
    } else {
      console.log(Chalk.blue.bold(`${this.owner.state.firstName} DOES NOT HAVE A SHOPPING CART`));
      return false;
    }
  }
  toArray() {
    try {
      this.owner.state.shoppingCart = JSON.parse(this.owner.state.shoppingCart);
    } catch (err) {
      throw err;
    }
  }
  toString() {
    try {
      this.owner.state.shoppingCart = JSON.stringify(this.owner.state.shoppingCart);
    } catch (err) {
      throw (err);
    }
  }
  async addProduct(session, res, productId) {
    console.log(Chalk.yellow.bold("<<<-------- INITIATING ADD PRODUCT PROCESS --------->>>"))
    if (!this.owner.state) {
      this.owner.state = {};
      this.owner.state.shoppingCart = [];
    } else if (!this.owner.state.shoppingCart) {
      this.owner.state.shoppingCart = [];
    }

    let index = this.searchCart(productId);
    let product;

    try {
      if (index != -1) {
        ++this.owner.state.shoppingCart[index].amount;
        console.log(Chalk.blue.bold("PRODUCT EXISTS, ITERATING THE AMOUNT"));
      } else {
        if (! (product = await this.getProduct(session, productId))) throw new Error("product could not be found");
        console.log(Chalk.blue.bold("PUSHING PRODUCT TO SHOPPING CART ARRAY"));
        this.owner.state.shoppingCart.push({
          product,
          amount: 1
        });
      }
    } catch (err) {
      throw err;
    }

    session.stateEvent.emit("localStateChange");
    console.log(Chalk.yellow.bold("<<<--------- ADD PRODUCT PROCCESS FINISHED -------->>>"));
    console.log(Chalk.blue.bold("NEW LOCAL STATE: "));
    console.log(this.owner.state);
    session.updateState(res);
  }
  async getProduct(session, productId) {
    console.log(Chalk.blue.bold("FETCHING PRODUCT FROM DATABASE"));
    return session.Database.fetchDocumentDb(this.Db, this.DbKey, productId, this.DbCollectionName);
  }
  searchCart(productId) {
    return this.owner.state.shoppingCart.findIndex(element =>
      element.product.productID == productId
    );
  }
}

export default (app) => {
  return {
    initializeState(req, res, next) {
      console.log(req.session);
      if (req.session.mystate) {
        next();
      } else {
        console.log(Chalk.red.bold("{{{{   INITIALIZATION OF SESSION   }}}}"));
        req.session.mystate = new Session(req.session.id);
        next();
      }
    }
  }
}
