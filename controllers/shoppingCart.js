export default {
  shoppingCart(req, res) {
    
  },

  addProduct(req, res) {
    // expected object:
    // let payload = {
    //   meta: {
    //     operation: "add",
    //     repeat: 1,
    //     productId: "200",
    //   },
    //   rows: {
    //     length: 0,
    //     thickness: 2,
    //     leatherColor: 1,
    //     threadColor: 1,
    //   }
    // };

    req.app.locals.capability.ShoppingCart.shoppingCartControlCenter(req.app.locals.capability, req.session, req.app.locals.products, payload);
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

}
