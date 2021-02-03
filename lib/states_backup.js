import Chalk from "chalk";
import EventEmitter from "events";
import Costumer from "../models/costumer.js";
import Product from "../models/product.js";
import * as bcrypt from "../lib/pass_encrypt.js";
import * as customErrors from "../lib/errors.js";
const stateChange = new EventEmitter();
import myPassport from "../lib/auth.js";


// IMPORTING MY OWN MODULES STARTS HERE //
// ------------------------- //
import Validation from "./validation.js";

// IMPORTING MY OWN MODULES STOPS HERE //
// ----------------------------------- //
stateChange.on("globalStateChange", (res, newState) => {
  console.log(Chalk.red.bold("<<<------ GLOBAL STATE CHANGED ------->>>"));
  res.locals.state = newState;
})

stateChange.on("addFlashMessage", (res, flashMessage) => {
  if (!res.locals.flashes) {
    res.locals.flashes = [];
    res.locals.flashes.push(flashMessage);
  } else {
    res.locals.flashes.push(flashMessage);
  }
  console.log(Chalk.red.bold(`<<<----- FLASH MESSAGE ${flashMessage.name} ADDED TO GLOBAL STATE ------>>>`));
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
    this.Validate = new Validation();
    this.Communicate = new Communicate();
    this.Client = new Client();
    this.FlashMessages = new FlashMessages();
    this.User = new User();
    this.Anonymous = new Anonymous();
    this.state = undefined;
    this.stateEvent = stateChange;
    this.DbProduct = Product;
    this.DbCostumer = Costumer;
    this.sessionOwner = "Anonymous";
  }

  switchState(res, newSessionOwner) {
    this.sessionOwner = newSessionOwner;
    this.stateEvent.emit("sessionOwnerChange", newSessionOwner);
    this.updateState(res);
  }

  updateState(res) {
    let localUser = "";
    if (this.sessionOwner !== "Anonymous") localUser = "User";
    else localUser = "Anonymous";

    if (this[localUser].hasState()) {
      console.log(Chalk.red.bold(`>>>LOADING ${this.sessionOwner}'s LOCAL STATE TO GLOBAL STATE<<<`));
      this.state = this[localUser].state;
    } else {
      this.state = undefined;
    }
    this.stateEvent.emit("globalStateChange", res, this.state);
  }

  constructNewState(oldState, newState) {
  }
  moveState(res) {
    // state will be empty for a second
  }
  getState() {

    if (!this.state || (Object.keys(this.state).length === 0 &&
                        this.state.constructor === Object)) {
      console.log(Chalk.blue.bold(`${this.sessionOwner} DOES NOT HAVE GLOBAL STATE`));
      return false;
    } else {
      console.log(Chalk.blue.bold(`${this.sessionOwner} DOES HAVE A GLOBAL STATE`));
      return true;
    }
  }
  removeState(res) {
    console.log(Chalk.blue.bold(`${this.sessionOwner}'s GLOBAL STATE REMOVED`));
    this.updateState(res, this.state, {});
  }
}

class Anonymous {
  constructor() {
    this.ShoppingCart = new ShoppingCart(this);
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

class User {
  constructor() {
    this.ShoppingCart = new ShoppingCart(this);
  }
  seedUser(Id, IdType, password) {
    this.Id = Id;
    this.IdType = IdType;
    this.password = password || "";
  }

  async getUser(session, IdType, Id) { //asynchronous
    console.log(Chalk.magenta.bold(`FETCHING ${Id} FROM DATABASE`));
    try {
      const data = await fetchDocumentDb(session.DbCostumer, IdType, Id);
      if (!data) {
        return false;
      } else {
        console.log(Chalk.magenta.bold(`${Id} FETCHED FROM DATABASE`));
        this.state = data;
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  async login(session) {
    console.log(Chalk.yellow.bold("<<<----- INITIATING LOGIN PROCESS ------>>>"));

    // DONE validate Id
    // DONE Fetch the user from db
    // DONE Validate Password
    // DONE Anonymous user has a state -> remove it from the global state
    // TODO ask user if he wants the anonymous state to be added to his state
    // DONE User has a state -> add it to the global state
    try {
      if (! session.Validate.isValidId(this)) throw new customErrors.ValidationError("email not valid!!!");
      if (! await session.User.getUser(session, this.IdType, this.Id)) throw new customErrors.UserNotFound("User not in database");
      if (! session.Validate.isValidPass(this)) throw new customErrors.PasswordsNoMatch("passwords do not match");
      // if (session.getState()) session.removeState(res);
      // if (session.getState()) {
      //   session.removeState(res);
      // }
      // session.Client.askShoppingCart(res, session);
      // this.switchDataFormat(session);
      //  if (! session.User.ShoppingCart.removeFromDb(session)) throw new customErrors.dbError("Failed to remove shopping cart from database");
    } catch (err) {
      throw err;
    }


    // finally load the Users state to the Sessions state

    //session.sessionOwner = this.state.firstName; // Changing of session owner
    //session.stateEvent.emit("sessionOwnerChange", session.sessionOwner);
    //session.updateState(res);
    // session.switchState(res, this.state.firstName);
    console.log(Chalk.yellow.bold("<<<----- LOGIN PROCESS FINISHED ----->>>"))
    return this.state;
  }

  postLogin(res, session) {
    console.log(Chalk.yellow.bold("<<<------- INITAITING POST LOGIN PROCCESS -------->>>"));
    if (session.getState()) session.removeState(res);
    session.Client.askShoppingcart(res, session);
    this.switchDataFormat(session);
    session.sessionOwner = this.state.firstName;
    session.stateEvent.emit("sessionOwnerChange", session.sessionOwner);
    session.switchState(res, this.state.firstName);
    console.log(Chalk.yellow.bold("<<<------- POST LOGIN PROCCESS FINISHED -------->>>"));
  }

  async logout(res, session) {
    // DONE save state to database
    // DONE remove users state
    // DONE anonymous session reinstated
    console.log(Chalk.yellow.bold("<<<--------- INITIATING LOGOUT PROCCESS --------->>>"));


    try {
      this.switchDataFormat(session);
      if (! await this.stateToDb(session, this.state, "Costumer")) throw new Error("could not update document");
      session.switchState(res, "Anonymous");
    } catch (err) {
      throw err;
    }

    console.log(Chalk.yellow.bold("<<<--------- LOGOUT PROCCESS FINISHED ------->>>"))
  }

  async register(res, session, userData) {

    // TODO validate new users information
    // DONE create the document in the database;
    // TODO initiatite the login process -> it is the login process that asks
    // the user if he wants the anonymous shopping cart to be added.

    console.log(Chalk.yellow.bold("<<<------- INITIATING USER REGISTRATION PROCESS -------->>>"));
    try {
      if (!await this.createUser(session, {
        email: "myname@gmail.com",
        password: "sure bro",
        firstName: "hello madafaka",
        lastName: "iam yours"
      })) throw new Error("user failed to get cerated in db");
    } catch (err) {
      throw err;
    }

    console.log(Chalk.yellow.bold("<<<--------- USER REGISTRATION PROCCESS FINISHED -------->>>"));
    // seed the user
    this.seedUser("myname@gmail.com", "email", "sure bro");
    // initiate the login proccess
    this.login(res, session);
  }

  async createUser(session, newUser) {
    console.log(Chalk.magenta.bold(`TRYING TO CREATE ${newUser.email} USER DOCUMENT IN COSTUMER COLLECTION`));

    try {
      const response = await createDocumentDb(session.DbCostumer, newUser);
      if (response) {
        console.log(Chalk.magenta.bold(`${newUser.email} DOCUMENT CREATED`));
        return true;
      } else {
        console.log(Chalk.magenta.bold(`${newUser.email} DOCUMENT FAILED TO GET CREATED`));
        return false;
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

  async stateToDb(session, newData, collection) {
    console.log(Chalk.magenta.bold(`UPDATING ${this.Id} DOCUMENT IN ${collection} COLLECTION`))
    try {
      const response = await updateDocumentDb(session.DbCostumer, this.IdType, this.Id, newData);
      if (response.n && !response.nModified) {
        console.log(Chalk.magenta.bold(`${this.Id} WAS FOUND BUT NOT MODIFIED DUE TO CONGRUENT CONTENT`));
      } else if (response.n && response.nModified) {
        console.log(Chalk.magenta.bold(`${this.Id} WAS FOUND AND MODIFIED`));
      } else {
        console.log(Chalk.magenta.bold(`${this.Id} DOCUMENT FAILED TO GET UPDATED`));
        return false;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  switchDataFormat(session) {
    if (! this.hasState()) return;

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
  }


}

class ShoppingCart {
  constructor(owner) {
    this.owner = owner;
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

  async removeFromDb(session) {
    console.log(Chalk.blue.bold("REMOVING THE SHOPPING CART FROM THE DATABASE"));
    const updateField = { shoppingCart: ""};
    try {
      const data = await updateCostumer(session.DbCostumer, session.User.IdType, session.User.Id, updateField);
      if (data.ok) return true;
      else return false;
    } catch (err) {
      throw err;
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

  async addProduct(session, productId) {
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
        console.log(Chalk.blue.bold("PRODUCT EXISTS, ITERATINGH THE AMOUNT"))
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

    let msg = "<<<--------- ADD PRODUCT PROCESS FINISHED ---------->>>";
    session.stateEvent.emit("localStateChange", msg);
  }

  removeProduct(session, productId) {
    let index = this.searchCart(productId);
    if (index != -1) {
      this.owner.state.shoppingCart.pop(index);
    } else {
      throw new Error("no such product in shopping Cart");
    }
  }
  searchCart(productId) {
    return this.owner.state.shoppingCart.findIndex(element =>
      element.product.productID == productId
    );
  }
  async getProduct(session, productId) {
    console.log(Chalk.blue.bold("FETCHING PRODUCT FROM DATABASE"));
    return fetchDocumentDb(session.DbProduct, "productID", productId);
  }
}

class Communicate {
  
}

class Client {
  askShoppingCart(res, session) {
    console.log(Chalk.blue.bold("ASK USER IF ANONYMOUS SHOPPING CARD SHOULD BE APPENDED TO HIS"));
    session.stateEvent.emit("addFlashMessage", res, session.FlashMessages.transferShoppingCart());

  }
  askShoppingCartRouteHandler(req, res, next) {
    if (req.body.yes) {
      // add the shopping cart to the users
    } else {
      // do not add the shopping cart to the user
    }

  }
}

class FlashMessages {
  transferShoppingCart() {
    let flash = {
      id: "100",
      name: "[[TRANSFER SHOPPING CART]]",
      message: [
        "An anonymous shopping Cart exists",
        "Add it to my current shopping Cart?"
      ]
    };
    return flash;
  }
}

class Authorize {
  isValidId(user) {
    console.log(Chalk.blue.bold("VALIDATING EMAIL"));
    return validateId(user.IdType, user.Id);
  }
  isValidPass(user) {
    console.log(Chalk.blue.bold("VALIDATING PASSWORDS"));
    return bcrypt.matchPassword(user.password, user.state.password);
  }
}


// export default (app) => {
//   return {
//     initializeSession(req, res, next) {
//       console.log("getting called");
//       if (res.locals.session) next();


//       // <<<------ INITIALIZATION OF SESSION ------->>>> 
//       res.locals.session =  new Session(req.session.id);
//       let some = myPassport(app, res.locals.session, customErrors);
//       some.init();
//       res.locals.session.passport = some.passport;
//       console.log("yes its me");
//       next();
//     }
//   }
// }
export default async function initializeSession(req, res, next) {
  if (res.locals.session) next();


  // <<<------ INITIALIZATION OF SESSION ------->>>> 
  res.locals.session =  new Session(req.session.id);
  next();
}

function validateId(IDtype, ID) {
  const emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

  switch (IDtype) {
  case "email":
    if (emailPattern.test(ID)) return true;
    else return false;
    break;
  default:
    throw new Error("no IDtype provided to validateID function");
    break;
  }
}

function fetchDocumentDb(connectionType, IdType, Id) {
  return connectionType.findOne({[IdType]: Id}).lean();
}

function createDocumentDb(connectionType, document) {
  let newUser = new connectionType({
    email: document.email || "",
    password: document.password || "",
    firstName: document.firstName || "",
    lastName: document.lastName || "",
    authID: document.AuthID || "",
    signUpMethod: document.signUpMethod || "",
    validated: document.validated || false,
    mobile: document.mobile || 0,
  })

  return newUser.save();
}

function updateDocumentDb(connectionType, IdType, Id, newData) {
  return connectionType.updateOne({[IdType]: Id}, newData).lean();
}
