import Chalk from "chalk";
const PRODUCTS_DB = "product",
      PRODUCT_DB_KEY = "productID",
      DB = "mongo";

export default class ShoppingCart {
  constructor() {
    this.DbCollectionName = PRODUCTS_DB;
    this.DbKey = PRODUCT_DB_KEY;
    this.Db = DB;
  }
  // shoppingCart = req.session.state[req.session.state.sessionOwner].shoppingCart
  toArray(shoppingCart) {
    try {
      return JSON.parse(shoppingCart);
    } catch (err) {
      throw err;
    }
  }
  // shoppingCart = req.session.state[req.session.state.sessionOwner].shoppingCart
  toString(shoppingCart) {
    try {
      return JSON.stringify(shoppingCart);
    } catch (err) {
      throw err;
    }
  }
  // products = req.app.locals.products
  // productId = "string"
  getProduct(products, productId) {
    console.log(Chalk.blue.bold("GETTING NEW PRODUCT"));
    let newProduct = {};

    // locate the product
    let index = this.searchCart(products, productId);

    // if it exists add it to the object
    if (index !== -1) {
      newProduct = {
        product: products[index],
        amount: 1,
      };
    }
    return newProduct;
  }

  // shoppingCart = req.session.state[req.session.state.sessionOwner].shoppingCart
  // productId = "string"
  searchCart(shoppingCart, productId) {
    return shoppingCart.findIndex(element => element.product.productID === productId);
  }



  // capability = req.app.locals.
  // productId = "string"
  // session = req.session
  async addProduct(capability, productId, session) {
    console.log(Chalk.yellow.bold("<<<---- INITIATE ADD PRODUCT PROCCESS ---->>>"));

    // get the current session Owners shopping cart
    // TODO this statement needs removing
    let shoppingCart = session.state[session.state.sessionOwner].shoppingCart;

    try {
      // if productId already exists in shopping cart increment the amount
      let index = this.searchCart(shoppingCart, productId);
      if (index !== -1) { // product does exist
        ++shoppingCart[index].amount;
        console.log(Chalk.blue.bold("PRODUCT EXISTS, ITERATING THE AMOUNT"));
      } else { // product does not exist
        let product = {};
        // fetch it from db
        //if (! (product = await this.getProduct(capability, productId ))) throw new Error("product could not be found");
        // push it to the shoppingCart
        shoppingCart.push(this.getProduct(capability.products, productId));
        //shoppingCart.push({product, amount: 1,});
        console.log(Chalk.blue.bold("PUSHING PRODUCT TO SHOPPING CART ARRAY"));
      }
    } catch (err) {
      throw err;
    }

    this.updateStateCart(session, shoppingCart);
    console.log(session.state);
  }

  updateStateCart(session, newCart) {
    console.log(Chalk.cyan.bold("UPDATING STATE CART"));
    // totalAmount
    // totalCost = object, pouunds, euro, dollars

    let newAmount = 0, newCost = 0;

    for (const product of newCart) {
      newAmount += product.amount;
      //newCost += product.amount * product.product.price;
    }

    session.state.stateCart.totalAmount = newAmount;
    //session.state.stateCart.totalCost = newCost;
    session.state.stateCart.shoppingCart = newCart;
    console.log(session.state.stateCart.shoppingCart[0]);
  }

}
