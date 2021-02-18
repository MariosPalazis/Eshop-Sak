export default {
  shoppingCart(req, res) {
    res.render("shopping_cart", {layout: "main"});
  },

  addProduct(req, res) {
    //expected object:
    // let payload = {
    //   meta: {
    //     operation: "add",
    //     repeat: 1,
    //     productId: "200",
    //   },
    //   rows: {
    //     leatherType: 0,
    //     length: 0,
    //     thickness: 2,
    //     leatherColor: 1,
    //     threadColor: 1,
    //   }
    // };
    req.app.locals.capability.ShoppingCart.shoppingCartControlCenter(req.app.locals.capability, req.session, req.app.locals.products, req.body);
    res.send("success");
  },

  reduceProduct(req, res) {
    // expected object:
    // let payload = {
    //   meta: {
    //     operation: "reduce",
    //     repeat: 1,
    //   },
    //   rowsId: "10011111",
    // }
    req.app.locals.capability.ShoppingCart.shoppingCartControlCenter(req.app.locals.capability, req.session, req.app.locals.products, payload);

  },

  removeProduct(req, res) {
    // expected object:
    // let payload = {
    //   meta: {
    //     operation: "remove",
    //   },
    //   rowsId: "1001111",
    // }
    req.app.locals.capability.ShoppingCart.shoppingCartControlCenter(req.app.locals.capability, req.session, req.app.locals.products, payload);
  },

  transferShoppingCart(req, res) {
    if (req.body.response === "yes") {
      req.app.locals.capability.ShoppingCart.mergeTwoCarts(req.app.locals.capability, req.session, req.app.locals.products, req.session.state.anonymous.shoppingCart);
    }

    req.session.state.flashMessages.pop();

    res.send("success");
  },
}
