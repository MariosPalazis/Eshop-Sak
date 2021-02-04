// argument order
// capability, data required by the function other than the ones found in req.session, finally req.session.userstate;
// capability, req, res, productId, userState




// IMPORTING NPM MODULES
import Chalk from "chalk";
import EventEmitter from "events";
const stateChange = new EventEmitter();

// IMPORTING OWN MODULES
import Validation from "./validation.js";
import Database from "./db_abstractions.js";
import * as bcrypt from "./pass_encrypt.js";
import * as customErrors from "./errors.js";
import Uuid from "./uuid.js";




// DECLARATION OF CONSTANT VARIABLES //
// -------------------------------- //
const DB = "mongo";
const USER_DB = "costumer";
const PRODUCTS_DB = "product";
const PRODUCT_DB_KEY = "productID";
const ORDER_DB = "order";
// END DECLARATION OF CONSTANT VARIABLES //
// ------------------------------------ //


// INFORMATION ON THE STATE OBJECT //
// ------------------------------- //

// The state object is always named as "state"
// and it is found under req.session, such that req.session.state == state
// the state functionality can be found under
// either app.locals.capability or req.app.locals.capability
//or even res.locals.capabily


stateChange.on("globalStateChange", (state, msg) => {
  if (msg) {
    console.log(Chalk.red.bold(msg));
  }
  console.log(Chalk.red.bold("<<<------ GLOBAL STATE CHANGED ------->>>"));
  console.log(Chalk.blue.bold("NEW GLOBAL STATE: "));
  console.log(state);
})


stateChange.on("localStateChange", (state, msg) => {
  if (msg) {
    console.log(Chalk.red.bold(msg));
  }
  console.log(Chalk.red.bold("<<<------- LOCAL STATE CHANGED -------->>>"));
  console.log(Chalk.blue.bold("NEW LOCAL STATE: "));
  console.log(state);
})



class Capability {
  constructor() {
    this.Validate = new Validation();
    this.Database = new Database();
    this.User = new User();
    this.Anonymous = new Anonymous();
    this.ShoppingCart = new ShoppingCart();
    this.Communicate = new Communicate();
    this.Order = new Order();
    this.Uuid = new Uuid(DB, ORDER_DB);
    this.stateEvent = stateChange;
  }

  // session = req.session
  // state = data
  constructSessionState(session, state = null) {
    console.log(Chalk.blue.bold("CREATION OF STATE IN REQ.SESSION"));
    if (!session.state) session.state = {};

    if (state) {
      console.log(Chalk.red.bold("CREATION OF A LOGIN STATE IN REQ.SESSION.STATE"));
      session.state.login = state.login;
      session.state.user = state.user;
    }

  }

  // session = req.session
  // sessionOwner = string specifying the session owner
  makeSessionOwner(session, sessionOwner) {
    if (!session.state) {
      console.log(Chalk.blue.bold("CREATION OF STATE IN REQ.SESSION"));
      session.state = {};
    }
    session.state.sessionOwner = sessionOwner;
    console.log(Chalk.blue.bold(`SESSION OWNER CHANGED TO ${sessionOwner}`));
  }
}


class User {
  constructor() {
    this.DbCollectionName = USER_DB;
    this.Db = DB;
  }

  // session = req.session
  // idType = a string, usually "email"
  // id = a string, usually "youExample@gmail.com"
  async getUser(capability, id, idType, session) {
    console.log(Chalk.magenta.bold(`FETCHING ${id} FROM DATABASE`));
    try {
      const data = await capability.Database.fetchDocumentDb(this.Db, idType, id, this.DbCollectionName);
      if (!data) {
        console.log(Chalk.magenta.bold(`FECHING ${id} FROM DATABASE FAILED`));
        return false;
      } else {
        console.log(Chalk.magenta.bold(`${id} FETCHED FROM DATABASE`));
        session.state.user = data;
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  hasState(state) {
    if (!state || (Object.keys(state).length === 0 &&
                   state.constructor === Object)) {
      console.log(Chalk.blue.bold("USER DOES NOT HAVE A LOCAL STATE"));
      return false;
    } else {
      console.log(Chalk.blue.bold(`${state.firstName} DOES HAVE A LOCAL STATE`));
      return true;
    }
  }


  // session = req.session
  // capability = req.app.locals.capability
  // newUser = req.body
  async register(capability, session, newUser) {

    // try and fetch a user from the database with that email
    // is that mail taken? is that maail registered in a social app account?
    // if yes, create flashMessage and enter email/password verification proccess

    // if the account is not registered with a social app
    // that means either the user has forgotten his password or
    // it is sipmly a duplicate.


    let id = newUser.email;
    let idType = "email";

    // initialize the State if there is none
    capability.constructSessionState(session);

    try {

      if (!capability.Validate.isValidEmail(newUser.email)) {
        console.log("EMAIL NOT CORRECT");
        // email format wrong
        capability.Communicate.registrationResult({message: "email"}, session.state);
      } else if (!capability.Validate.isValidPassFormat(newUser.password)) {
        console.log("PASSWORD NOT CORRECT");
        // password format wrong
        capability.Communicate.registrationResult({message: "password"}, session.state);
      } else if (newUser.password !== newUser["confirm-password"]) {
        // password and password confirmation field do not match
        capability.Communicate.registrationResult({message: "unequal"}, session.state);
      } else if (await this.getUser(capability, id, idType, session)) {
        // email is already in use
        capability.Communicate.registrationResult({message: "duplicate"}, session.state);
      } else {
        return true;
      }

    } catch (err) {
      capability.Communicate.registrationResult({message: "dbError"}, session.state);
    }

    return false;
  }

  // state = req
  login(res, state) {
    console.log(Chalk.blue.bold("<<<---- ENTERING PRELOGIN FUNCTION ---->>>"));
    const capability = res.locals.capability;
    switch (state.session.state.login.message) {
    case "success":
      capability.Communicate.loginResult(capability, { message: "success" }, state.session.state);
      capability.User.postLogin(capability, state.session);
      break;
    case "dbError":
      capability.Communicate.loginResult(capability, { message: "dbError" }, state.session.state);
      break;
    case "password":
      capability.Communicate.loginResult(capability, { message: "password" }, state.session.state);
      break;
    case "email":
      capability.Communicate.loginResult(capability, { message: "email" }, state.session.state);
      break;
    case "passport":
      capability.Communicate.loginResult(capability, { message: "passport" }, state.session.state);
      break;
    case "google":
      capability.Communicate.loginResult(capability, { message: "google" }, state.session.state);
      break;
    case "facebook":
      capability.Communicate.loginResult(capability, { message: "facebook" }, state.session.state);
      break;
    default:
      break;
    }
    console.log(Chalk.blue.bold("<<<---- EXITING PRELOGIN FUNCTION ----->>>"));

    return true;
  }

  // state = req.session
  // capability = req.app.locals.capability
  // LOGIC:
  // After a user has successfully logged in,
  // i ask if the user wants to add the shopping cart
  // left by the anonymous user if any.
  // then change the session owner
  // and transfer his shoppingh Cart globally
  postLogin(capability, state) {
    console.log(Chalk.blue.bold("ATTEMPTING TO START THE POST POSTLOGIN PROCCESS"));

    // communicate to user
    if (capability.Anonymous.hasState(state)) capability.Communicate.transferShoppingCart(state.state);

    // changing the session owner
    // transferring the users local state to the global state
    state.state.sessionOwner = "user";
    capability.ShoppingCart.transferLocalToState(state);

    console.log(Chalk.blue.bold("POST POST LOGIN SUCCESSFULL"));
  }

  // session = req.session
  logout(session) {
    console.log(Chalk.yellow.bold("INITIATING LOGOUT PROCCESS"));
    delete session.state.user;
    delete session.state.anonymous;
    delete session.state.stateCart;
    session.state.sessionOwner = "anonymous";
    console.log(Chalk.yellow.bold("FINISHING LOGOUT PROCCESS"));
  }
}

class Anonymous {

  // state = req.session
  hasState(state) {
    if (!state || !state.state || !state.state.anonymous) return false;
    else return true;

    if (!state || !state.state || !state.state.anonymous) {
      return false;
    } else if (Object.keys(state.state.anonymous).length === 0 && state.state.anonymous.constructor === Object) {
      return false;
    } else if (Object.keys(state.state.anonymous.shoppingCart).length === 0 && state.state.anonymous.shoppingCart.constructor === Object) {
      return false;
    } else {
      return true;
    }
  }
}

class Communicate {
  constructor() {
    this.FlashMessage = new FlashMessage();
  }
  // state = req.session.state
  // payload = { message: "string" } (provided by User.login());
  // capability = , i do not know whats need
  loginResult(capability, payload, state) {
    console.log(Chalk.blue.bold("ATTEMPTING TO CREATE LOGIN RESULT FLASH MESSAGE"));
    if (!state.flashMessages) state.flashMessages = [];
    state.flashMessages.push(this.FlashMessage.loginResult(payload));
    console.log(Chalk.blue.bold("FLASH MESSAGE CREATED"));
  }

  // state = req.session.state
  // payload = { message: "string" }
  registrationResult(payload, state) {
    console.log(Chalk.blue.bold("ATTEMPTING TO CREATE REGISTRATION RESULT FLASH MESSAGE"));
    if (!state.flashMessages) state.flashMessages = [];
    state.flashMessages.push(this.FlashMessage.registrationResult(payload));
    console.log(Chalk.blue.bold("FLASH MESSAGE CREATED"));
  }

  // state = req.session.state
  transferShoppingCart(state) {
    console.log(Chalk.blue.bold("ATTEMPTING TO CREATE TRANSFER SHOPPING CART FLASH MESSAGE"));
    if (!state.flashMessages) state.flashMessages = [];
    state.flashMessages.push(this.FlashMessage.transferShoppingCart());
    console.log(Chalk.blue.bold("FLASH MESSAGE CREATED"));
  }




  // state = req.session.state
  // payload = {}
  // LOGIC:
  // this function is used to update to the client
  // that a shopping cart item has either been removed or added
  // it does not only
  updateShoppingCart(capability, payload, state ) {
    console.log(Chalk.blue.bold("ATTEMPTING TO CREATE SHOPPING CART OPERATION RESULT FLASH MESSAGE"));
    if (!state.flashMessages) state.flashMessages = [];
    state.flashMessages.push(this.FlashMessage.loginResult(payload));
    console.log(Chalk.blue.bold("FLASH MESSAGE CREATED"));
  }
}

class FlashMessage {


  // used by User.register
  registrationResult(payload) {
    const standardContent = [
      '<aside class="popup-container">',
      '<p class="popup-logo"><img src="/assets/smalls/user.png" alt="popup-logo"></p>',
      '<p class="popup-close"><img src="/assets/smalls/close.svg" alt="close-window"></p>',
      '</aside>',
    ];

    let flashMessage = {};

    switch (payload.message) {
    case "email":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + '<p class="popup-logo"> <img src="/assets/smalls/user.png" alt="popup-logo"></p>' +
          '<p class="popup-message">Email format is invalid, try again!</p>' +
          standardContent[2] + standardContent[3],
      }

      return flashMessage;
      break;
    case "password":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + '<p class="popup-logo"> <img src="/assets/smalls/user.png" alt="popup-logo"></p>' +
          '<p class="popup-message">Password format is invalid, try again!</p>' +
          standardContent[2] + standardContent[3],
      }
      return flashMessage;
      break;
    case "unequal":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + '<p class="popup-logo"> <img src="/assets/smalls/user.png" alt="popup-logo"></p>' +
          '<p class="popup-message">Passwords do not match, try again!</p>' +
          standardContent[2] + standardContent[3],
      }
      return flashMessage;
      break;
    case "duplicate":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + '<p class="popup-logo"> <img src="/assets/smalls/user.png" alt="popup-logo"></p>' +
          '<p class="popup-message">Email already in use!</p>' +
          standardContent[2] + standardContent[3],
      }
      return flashMessage;
      break;
    case "dbError":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + '<p class="popup-logo"> <img src="/assets/smalls/user.png" alt="popup-logo"></p>' +
          standardContent[2] + standardContent[3],
      }
      return flashMessage;
      break;
    default:
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Login failed, due to server error, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    }
  }

  transferShoppingCart() {
    const standardContent = [
      '<aside class="popup-container" >',
      '</aside>'
    ];

    const flashMessage = {
      persistent: true,
      payload: standardContent[0] +
        `<p id="popup-message">Previous user left a shopping Cart!` +
        `Add it?</p>` +
        `<p id="yes"> yes</p>` +
        `<p id="no"> no</p>` +
        `<p id="check"> check</p>` +
        standardContent[1],
    };
    return flashMessage;
  }
  // payload = Object with one property -> {message: "payload"}
  loginResult(payload) {
    const standardContent = [
      '<aside class="popup-container" >',
      '<p class="popup-logo"><img src="/assets/smalls/user.png" alt="popup-logo"></p>',
      '<p class="popup-close"><img src="/assets/smalls/close.svg" alt="close-window"></p>',
      '</aside>',
    ];
    let flashMessage = {};
    switch (payload.message) {
    case "success":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + '<p class="popup-logo" ><img src="/assets/smalls/user_success.png" alt="popup-logo"></p>'  +
          `<p class="popup-message" >Successfully logged in</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    case "dbError":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Login failed, due to server error, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    case "password":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Incorrect password, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    case "email":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Incorrect email, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    case "passport":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Login failed, due to server error, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    case "google":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Login failed, due to Google's failure to authenticate you, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    case "facebook":
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Login failed, due to Facebook's failure to authenticate you, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    default:
      flashMessage = {
        persistent: false,
        payload: standardContent[0] + standardContent[1] +
          `<p class="popup-message">Login failed, due to server error, try again!</p>` +
          standardContent[2] + standardContent[3],
      };
      return flashMessage;
      break;
    }
  }
}

class Order {
  constructor() {
  }


  //state = req.session
  async generateNewOrder(capability, session, clientFormInput) {

    // user sends data
    // generate an order ID
    // generate a date
    // status = {processing, pending, sending, received}
    // create a global order object
    // add to it, the address
    // the shipping
    // and the shopping cart.

    let newOrder = {};

    try {
      newOrder = {
        orderId: await capability.Uuid.generateUuid(capability),
        //costumerId: session.state[session.state.sessionOwner]._id || session.state[session.state.sessionOwner].email,
        contactAddress: clientFormInput.email,
        paymentId: "", // not yet
        //amount: session.state.stateCart.totalCost, 
        status: "processing",
        paymentStatus: "pending",
        currency: "euro",
        date: new Date().toUTCString(),
        billing: {
          billingId: capability.Uuid.simpleGenerateId(),
          status: true,
          firstName: clientFormInput.billingFirstName || "",
          lastName: clientFormInput.billingLastName || "",
          addressLine1: clientFormInput.billingAddress1 || "",
          addressLine2: clientFormInput.billingAddress2 || "",
          city: clientFormInput.billingCity || "",
          country: clientFormInput.billingCountry || "",
          postCode: clientFormInput.billingPostCode || "",
        },
        shipping: {
          shippingId: capability.Uuid.simpleGenerateId(),
          status: true,
          firstName: clientFormInput.shippingFirstName || "",
          lastName: clientFormInput.shippingLastName || "",
          addressLine1: clientFormInput.shippingAddress1 || "",
          addressLine2: clientFormInput.shippingAddress2 || "",
          city: clientFormInput.shippingCity || "",
          country: clientFormInput.shippingCountry || "",
          postCode: clientFormInput.shippingPostCode || "",
          tel: clientFormInput.shippingTel || "",
        },
      //  shoppingCart: session.state.stateCart.shoppingCart,
      }
    } catch (err) {
      console.log(err);
    }
    this.updateStateOrder(session, newOrder);
  }

  // session = req.session
  // dependent on req.session.state.sessionOwner
  updateStateOrder(session, newOrder) {
    console.log(Chalk.cyan.bold("UPDATING STATE CART"));
    session.state.stateOrder = newOrder;
  }
}

class Address {
  constructor() {
    
  }
  

  // adds address where?
  addAddress() {
    
  }

  removeAddress() {
    
  }

  searchAddress() {
    
  }

  getAddress() {
    
  }

  updateStateAddress() {
    
  }

  transferLocalToState() {
    
  }
}

class ShoppingCart {
  constructor() {
    this.DbCollectionName = PRODUCTS_DB;
    this.DbKey = PRODUCT_DB_KEY;
    this.Db = DB;
  }

  has(state) {
    if (state && state.shoppingcCart) {
      console.log(Chalk.blue.bold(`${state.firstName || "anonymous"} HAS A SHOPPING CART`));
      return true;
    } else {
      console.log(Chalk.blue.bold(`${state.firstName || "anonymous"} DOES NOT HAVE A SHOPPING CART`));
      return false;
    }
  }
  toArray(shoppingCart) {
    try {
      return JSON.parse(shoppingCart);
    } catch (err) {
      throw err;
    }
  }
  toString(shoppingCart) {
    try {
      return JSON.stringify(shoppingCart);
    } catch (err) {
      throw err;
    }
  }
  // session = req.session
  seedShoppingCart(session) {
    // the case where there is no state and an anonymous user gets one for the first time
    console.log(session)
    if (!session.state) {
      session.state = {
        anonymous: {
          shoppingCart: [],
        },
        user: {
          shoppingCart: [],
        },
        stateCart: {},
      }
      console.log(Chalk.blue.bold("SEEDING ANONYMOUS AND USER SHOPPING CART"));
      // the case where there is a state but the anonymous user does not have one.
    } else if (!session.state.anonymous) {
      session.state.anonymous = {
        shoppingCart: [],
      }
      console.log(Chalk.blue.bold("SEEDING ANONYMOUS SHOPPING CART"));
      // the case where there is a state, there is an anonmyous user but he does not have a shopping Cart
    } else if (!session.state.anonymous.shoppingCart) {
      session.state.anonymous.shoppingCart = [];
      console.log(Chalk.blue.bold("SEEDING ANONYMOUS SHOPPING CART"));
    }



    // the case where there is a state but the 'user' user does not have one.
    if (!session.state.user) {
      session.state.user = {
        shoppingCart: [],
      }
      console.log(Chalk.blue.bold("SEEDING USER SHOPPING CART"));
      // the case where there is a state, the 'user' user does have one but he does not have a shopping Cart
    } else if (!session.state.user.shoppingCart) {
      session.state.user.shoppingCart = [];
      console.log(Chalk.blue.bold("SEEDING USER SHOPPING CART"));
    }

    if (!session.state.stateCart) {
      session.state.stateCart = {};
    }

  }

  // session = req.session
  // LOGIC:
  // If a user(either anonymous or named) does not have a shopping Cart instantiate one.
  // then search that shopping cart for instances of the product that he wants to add
  // if one matches increment the property of amount, otherwise fetch the product
  // from the database and push it to the shoppingCart. If anything goes wrong
  // create a flashMessage notifying the user, otherwise create another flashmessage
  // informing the user that the product has been adedd, and ask him if he wants to checkOut
  async addProduct(capability, productId, session) {
    console.log(Chalk.yellow.bold("<<<---- INITIATE ADD PRODUCT PROCCESS ---->>>"));
    this.seedShoppingCart(session);

    let shoppingCart = session.state[session.state.sessionOwner].shoppingCart;


    try {
      // if productId already exists in shoppingCart increment it.
      let index = this.searchCart(shoppingCart, productId);
      if (index != -1) {
        ++shoppingCart[index].amount;
        console.log(Chalk.blue.bold("PRODUCT EXISTS, ITERATING THE AMOUNT"));
      } else {
        let product = {};
        // if productId does not exist in shoppingCart fetch it from the database
        if (! (product = await this.getProduct(capability, productId ))) throw new Error("product could not be found");
        // push it to the shoppingCart
        shoppingCart.push({product, amount: 1,});
        console.log(Chalk.blue.bold("PUSHING PRODUCT TO SHOPPING CART ARRAY"));
      }
    } catch (err) {
      throw err;
    }

    this.updateStateCart(session, shoppingCart);

    console.log(Chalk.yellow.bold("<<<--------- ADD PRODUCT PROCCESS FINISHED -------->>>"));
  }

  // session = req.session
  removeProduct(capability, productId, session) {
    console.log(Chalk.yellow.bold("<<<---- INITIATE REMOVE PRODUCT PROCCESS --->>>"));


    this.updateStateCart(session, shoppingCart);
    console.log(Chalk.yellow.bold("<<<---- REMOVE PRODUCT PROCCESS FINISHED ---->>>"));
  }
  async getProduct(capability, productId) {
    console.log(Chalk.blue.bold("FETCHING PRODUCT FROM DATABASE"));
    return capability.Database.fetchDocumentDb(this.Db, this.DbKey, productId, this.DbCollectionName);
  }

  // shoppingCart = req.session.state[req.session.state.sessionOwner].shoppingCart
  searchCart(shoppingCart, productId) {
    return shoppingCart.findIndex(element => element.product.productID === productId);
  }



  // state = req.session
  // newCart = req.session.state[sessionOwner].shoppingCart (ARRAY)
  // LOGIC:
  // Function is called every time there has been a change in the sessionOwners  shoppingCart
  // Its role is to update the req.session.state.shoppingCart with the new sessionOwners shoppingCart
  // which would have been updated by either the function addProduct or removeProduct
  updateStateCart(session, newCart) {
    console.log(Chalk.cyan.bold("UPDATING STATE CART"));
    // totalAmount
    // totalCost = object, pouunds, euro, dollars

    let newAmount = 0, newCost = 0;

    for (const product of newCart) {
      newAmount += product.amount;
      newCost += product.amount * product.product.price;
    }

    session.state.stateCart.totalAmount = newAmount;
    session.state.stateCart.totalCost = newCost;
    session.state.stateCart.shoppingCart = newCart;
  }

  // state = req.session
  // dependent on req.session.state.sessionOwner
  transferLocalToState(session) {

    this.seedShoppingCart(session);

    if (!session.state[session.state.sessionOwner].shoppingCart) return;


    if (typeof session.state[session.state.sessionOwner].shoppingCart === "string") {
      session.state[session.state.sessionOwner].shoppingCart = this.toArray(session.state[session.state.sessionOwner].shoppingCart);
    }

    this.updateStateCart(session, session.state[session.state.sessionOwner].shoppingCart);

  }

}


export default (app) => {
  return {
    initializeCapability(req, res, next) {
      if (app.locals.capability) {
        res.locals.capability = app.locals.capability;
        next();
      } else {
        console.log(Chalk.red.bold("{{{{   INITIALIZATION OF STATE  }}}}"));
        app.locals.capability  = new Capability();
        app.locals.capability.makeSessionOwner(req.session, "anonymous");
        next();
      }
    }
  }
}
