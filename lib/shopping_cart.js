import Chalk from "chalk";

export default class ShoppingCart {
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

  // session = req.session
  seedStateCart(session) {
    session.state.stateCart = {
      meta: {
        totalAmount: 0,
        totalCost: 0,
      },
      shoppingCart: [],
    }
  }

  // state = req.session
  // dependent on req.session.state.sessionOwner
  transferLocalToState(session) {

    if (!session.state[session.state.sessionOwner].shoppingCart || !session.state[session.state.sessionOwner].shoppingCart.length) return;


    if (typeof session.state[session.state.sessionOwner].shoppingCart === "string") {
      session.state[session.state.sessionOwner].shoppingCart = this.toArray(session.state[session.state.sessionOwner].shoppingCart);
    }

    this.updateStateCart(session, session.state[session.state.sessionOwner].shoppingCart);

  }

  // capability = req.app.locals.capability
  // products = req.app.locals.products
  // session = req.session
  // payload = { meta: {operation: "add", repeat: 1, productId: "100"}, rows: {wheelDiameter: 1, ...}}
  shoppingCartControlCenter(capability, session, products, payload) {
    if (!session.state.stateCart.meta) this.seedStateCart(session);
    // get the operation
    switch (payload.meta.operation) {
    case "add":
      console.log(Chalk.yellow.bold("<<<--- ADDING PRODUCT TO SHOPPING CART --->>>"));
      console.log(session.state.stateCart);
      for (let i = 0; i < payload.meta.repeat; ++i) {
        this.addProduct(session, products, payload);
      }
      this.updateStateCart(session, session.state[session.state.sessionOwner].shoppingCart);
      console.log(session.state.stateCart);
      console.log(Chalk.yellow.bold("<<<--- PRODUCT ADDED TO SHOPPING CART ---->>>"));
      break;
    case "reduce":
      console.log(Chalk.yellow.bold("<<<--- REDUCING PRODUCT FROM THE SHOPPING CART --->>>"));
      console.log(session.state.stateCart);
      for (let i = 0; i < payload.meta.repeat; ++i) {
        this.reduceProduct(session, payload);
      }
      this.updateStateCart(session, session.state[session.state.sessionOwner].shoppingCart);
      console.log(session.state.stateCart);
      console.log(Chalk.yellow.bold("<<<--- PRODUCT REDUCED FROM THE SHOPPING CART ---->>>"));
      break;
    case "remove":
      console.log(session.state.stateCart);
      console.log(Chalk.yellow.bold("<<<--- REMOVING PRODUCT FROM THE SHOPPING CART ---->>>"));
      this.removeProduct(session, payload);
      this.updateStateCart(session, session.state[session.state.sessionOwner].shoppingCart);
      console.log(session.state.stateCart);
      console.log(Chalk.yellow.bold("<<<--- REMOVED PRODUCT FROM THE SHOPPING CART ---->>>"));
      break;
    }
  }
  removeProduct(session, removeThis) {
    let shoppingCart = session.state[session.state.sessionOwner].shoppingCart;

    let index = this.searchCart(shoppingCart, removeThis.rowsId);
    if (index < 0) return;

    shoppingCart.splice(index, 1);
  }

  reduceProduct(session, reduceThis) {
    let shoppingCart = session.state[session.state.sessionOwner].shoppingCart;

    let index = this.searchCart(shoppingCart, reduceThis.rowsId);
    if (index < 0) return;

    --shoppingCart[index].amount;
    shoppingCart[index].totalPrice -= shoppingCart[index].price;
    if (shoppingCart[index].amount === 0) shoppingCart.splice(index, 1);
  }

  // products = req.app.locals.products
  // session = req.session
  // addThis = { productId, wheelDiameter: 1, ... }
  addProduct(session, products, addThis) {
    const rowsId = this.constructRowsId(addThis.meta.productId, addThis.rows);
    let shoppingCart = session.state[session.state.sessionOwner].shoppingCart;
    let index = this.searchCart(shoppingCart, rowsId);
    if (index < 0) {
      shoppingCart.push(this.constructNewItem(products, addThis, rowsId));
    } else {
      ++shoppingCart[index].amount;
      shoppingCart[index].totalPrice = shoppingCart[index].price * shoppingCart[index].amount;
    }
  }

  // shoppingCart = array extracted from a users personal state
  // targetProductId = "string"
  searchCart(shoppingCart, targetProductId) {
    if (!shoppingCart.length) return -1;
    return shoppingCart.findIndex(product => product.rowsId === targetProductId);
  }
  searchProducts(products, targetProductId) {
    if (!products.length) return -1;
    return products.findIndex(product => product.productID === targetProductId);
  }
  constructRowsId(productId, rows) {
    let rowsId = productId;
    for (const property in rows) {
      rowsId += rows[property].toString();
    }
    return rowsId;
  }

  // session = req.session
  // newCart = req.session.state[sessionOwner].shopppingCart
  updateStateCart(session, newCart) {
    console.log(Chalk.cyan.bold("UPDATING STATE CART"));

    let newAmount = 0, newCost = 0;

    // traverse the shoppingCart array
    for (const product of newCart) {
      newAmount += product.amount;
      newCost += product.totalPrice;
    }

    session.state.stateCart.meta = {
      totalAmount: newAmount,
      totalCost: newCost,
    }
    session.state.stateCart.shoppingCart = newCart;
  }

  // products = req.app.locals.products
  // addThis = object, item from the client {productId, wheelDiameter, thickness, ... }
  // rowsId = "string"
  constructNewItem(products, addThis, rowsId) {
    let stack = [], newItem= {}, totalPrice = 0;

    let index = this.searchProducts(products, addThis.meta.productId);
    if (index < 0) return;

    delete addThis.productId;

    for (const property in addThis.rows) {
      newItem = products[index][property].splice(addThis[property], 1).pop();
      totalPrice += newItem.price;
      stack.push(newItem);
    }
    newItem = {
      productId: products[index].productID,
      rowsId: rowsId,
      description: products[index].description,
      amount: 1,
      price: totalPrice,
      totalPrice: totalPrice,
      rows: stack,
    }
    return newItem;
  }
}

