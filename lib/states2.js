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
import Bcrypt from "./pass_encrypt.js";
import Admin from "./admin.js";
import * as customErrors from "./errors.js";
import Uuid from "./uuid.js";
import ShoppingCart from "./shopping_cart.js";




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
})


stateChange.on("localStateChange", (state, msg) => {
  if (msg) {
    console.log(Chalk.red.bold(msg));
  }
  console.log(Chalk.red.bold("<<<------- LOCAL STATE CHANGED -------->>>"));
  console.log(Chalk.blue.bold("NEW LOCAL STATE: "));
})



class Capability {
  constructor() {
    this.Validate = new Validation();
    this.Database = new Database();
    this.User = new User();
    this.Anonymous = new Anonymous();
    this.ShoppingCart = new ShoppingCart();
    this.Communicate = new Communicate();
    this.Admin = new Admin();
    this.Order = new Order();
    this.Uuid = new Uuid(DB, ORDER_DB);
    this.Bcrypt = new Bcrypt();
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
        session.state.user = state.user || "";
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

  changeSessionOwner(session, newOwner) {
    session.state.sessionOwner = newOwner;
    console.log(Chalk.yellow.bold(`<<<--- SESSION OWNER CHANGED TO ${newOwner} --->>>`));
  }

  // session = req.session
  // sessionOwner = "string";
  seedState(session, sessionOwner) {
    if (!session.state) {
      console.log(Chalk.blue.bold("CREATION OF STATE IN REQ.SESSION"));
      session.state = {};
    }
    session.state.sessionOwner = sessionOwner;

    if (!session.state.anonymous) {
      session.state.anonymous = { shoppingCart: [], };
      console.log(Chalk.blue.bold("SEEDING ANONYMOUS CONTAINER AND ANONYMOUS SHOPPING CART"));
    } else if (!session.state.anonymous.shoppingCart) {
      session.state.anonymous.shoppingCart = [];
      console.log(Chalk.blue.bold("SEEDING ANONYMOUS SHOPPING CART"));
    }

    if (!session.state.user) {
      session.state.user = { shoppingCart: [], };
      console.log(Chalk.blue.bold("SEEDING USER CONTAINER AND USER SHOPPING CART"));
    } else if (!session.state.user.shoppingCart) {
      session.state.user.shoppingCart = [];
      console.log(Chalk.blue.bold("SEEDING USER SHOPPING CART"));
    }

    if (!session.state.stateCart) {
      session.state.stateCart = {};
      console.log(Chalk.blue.bold("SEEDING STATECART"));
    }
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
    // initialize the State if there is none
    capability.constructSessionState(session);

    // VALIDATIONS
    if (! await this.validateNewUser(capability, session, newUser)) return false;

    // HASHING PASSWORD
    console.log(Chalk.blue.bold("HASHING THE PASSWORD"));
    newUser.password = await capability.Bcrypt.hashPassword(newUser.password);

    // PREPARATION OF THE NEW USERS RECORD FIELDS
    // the newUser object form as it is received at this point in time, after the password has been hashed:
    // newUser = {
    // fullName: "string" (fullname)
    // email: "string" (fullname) (index)
    // password: "string" (hash)
    //}
    // However if a user selects to register with a social, different fields will be provided
    // need to fill the signUpMethod
    newUser.signUpMethod = "local";

    // CREATION OF A USER RECORD IN THE DATABASE
    try {
      console.log(Chalk.blue.bold("ATTEMPTING TO CREATE A NEW USER RECORD IN THE DATABASE"));
      if (! await capability.Database.createDocumentDb(this.Db, newUser, this.DbCollectionName)) throw new Error("Db error");
      console.log(Chalk.blue.bold("ATTEMPT TO CREATE A NEW USER RECORD SUCCESSFULL"));
    } catch (err) {
      console.log(err);
      console.log(Chalk.red.bold("ATTEMPT TO CREATE A NEW USER RECORD FAILED"));
      capability.Communicate.registrationResult({message: "dbError"}, session.state);
      return false;
    }

    
    // if the procedure fullfills all neccessary steps declare successfull attempt at registering a new User
    // and initiate the login proccess
    // However before doing that, the newUser.password must be changed back to its original form because
    // this is what the login proccess expects
    newUser.password = newUser["confirm-password"];
    return true;
  }

  async validateNewUser(capability, session, newUser) {
    console.log(Chalk.blue.bold("VALIDATING CLIENTS INPUT"));
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
      } else if (await this.getUser(capability, newUser.email, "email", session)) {
        // email is already in use
        capability.Communicate.registrationResult({message: "duplicate"}, session.state);
      } else {
        console.log(Chalk.blue.bold("USER INPUT IS VALID AND NO SUCH USER EMAIL EXISTS"));
        return true;
      }
    } catch (err) {
      console.log(err);
      console.log(Chalk.red.bold("DATABASE ERROR WHILE VALIDATING CLIENT INPUT"));
      capability.Communicate.registrationResult({message: "dbError"}, session.state);
    }


    console.log(Chalk.blue.bold("EITHER USER INPUT IS INCORRECT OR A USER WITH SUCH AN EMAIL ALREADY EXISTS"));
    return false;
  }


  // state = req.session
  login(res, session) {
    console.log(Chalk.blue.bold("<<<---- ENTERING PRELOGIN FUNCTION ---->>>"));
    switch (session.state.login.message) {
    case "success":
      res.locals.capability.Communicate.loginResult(res.locals.capability, { message: "success" }, session.state);
      res.locals.capability.User.postLogin(res.locals.capability, session);
      break;
    case "dbError":
      res.locals.capability.Communicate.loginResult(res.locals.capability, { message: "dbError" }, session.state);
      break;
    case "password":
      res.locals.capability.Communicate.loginResult(res.locals.capability, { message: "password" }, session.state);
      break;
    case "email":
      res.locals.capability.Communicate.loginResult(res.locals.capability, { message: "email" }, session.state);
      break;
    case "passport":
      res.locals.capability.Communicate.loginResult(res.locals.capability, { message: "passport" }, session.state);
      break;
    case "google":
      res.locals.capability.Communicate.loginResult(res.locals.capability, { message: "google" }, session.state);
      break;
    case "facebook":
      res.locals.capability.Communicate.loginResult(res.locals.capability, { message: "facebook" }, session.state);
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
  postLogin(capability, session) {
    console.log(Chalk.blue.bold("ATTEMPTING TO START THE POST POSTLOGIN PROCCESS"));

    //if (capability.Anonymous.hasShoppingCart(session)) capability.Communicate.transferShoppingCart(session.state);

    // whatever the case change the session owner
    capability.changeSessionOwner(session, "user");

    // add the users shopping cart to the global state
    capability.ShoppingCart.transferLocalToState(session);

    // create a userName
    this.makeUserName(session.state.user);

    console.log(Chalk.blue.bold("POST POST LOGIN SUCCESSFULL"));
  }
  makeUserName(user) {
    console.log(user);
    let regexp = new RegExp(" ");

    if (user.fullName && user.fullName.length) {
      user.username = user.fullName.split(/\W| /)[0];
    } else if (user.email && user.email.length) {
      user.username = user.email.split(/\W| /)[0];
    } else {
      user.username = "account";
    }

    if (user.username.length < 2 || regexp.test(user.username)) {
      user.username = user.email.split(/\W| /)[0];
    }

    if (user.username.length < 2 || regexp.test(user.username)) {
      user.username = "account";
    }

    if (user.username.length > 10) user.username = user.username.substr(0, 10);
  }

  // session = req.session
  logout(session) {
    console.log(Chalk.yellow.bold("INITIATING LOGOUT PROCCESS"));
    delete session.state.user;
    delete session.state.anonymous;
    delete session.state.stateCart;
    if (session.urlOrigin) delete session.urlOrigin;
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

  // session = req.session
  hasShoppingCart(session) {
    if (!session.state.anonymous.shoppingCart|| !session.state.anonymous.shoppingCart.length) return false;
    else return true;
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
          '<p class="popup-message">Registration failed due to server error, try again!</p>' +
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



export default (app) => {
  return {
    initializeCapability(req, res, next) {
      if (app.locals.capability) {
        res.locals.capability = app.locals.capability;
        next();
      } else {
        console.log(Chalk.red.bold("{{{{   INITIALIZATION OF STATE  }}}}"));
        app.locals.capability = new Capability();
        app.locals.capability.seedState(req.session, "anonymous");
        next();
      }
    },
    async seedProducts(req, res, next) {
      // first time the server is run
      if (!app.locals.products) {
        // get the products from the database.
        // populate the app.locals.products
        try {
          app.locals.products = await app.locals.capability.Admin.Product.fetchProducts(app.locals.capability);
          if (!app.locals.products) throw new Erorr("the seed Products middleware failed to get the Products from the database");
          console.log("the seedProducts middleware succeddded in fetching the items from the database");
        } catch (err) {
          console.log(err);
        }
      } else if (req.session.state && req.session.state.products) {
        // this clause covers the case where a new product has been added,
        // by the admin and the app.locals.products state must be updated
        try {
          app.locals.products = await app.locals.capability.Admin.Product.fetchProducts(app.locals.capability);
          if (!app.locals.products) throw new Erorr("the seed Products middleware failed to fetch the new Products from the database");
          console.log("the seedproducts middleware succeedded in fetching the new Products from the database");
        } catch (err) {
          console.log(err);
        }
      }
      next();
    },
  }
}
