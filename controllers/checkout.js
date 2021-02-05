export default {
  checkoutLogin(req, res) {
    res.render("checkout/checkout_login", {layout: "checkout"});
  },

  checkoutAddress(req, res) {
    res.render("checkout/checkout_address", {layout: "checkout"});
  },

  async postCheckoutAddress(req, res) {
    console.log("hey bro");
    // check if billing equals shipping
    // create an order id
    // add billing and shipping information to the order object
    await req.app.locals.capability.Order.generateNewOrder(req.app.locals.capability, req.session, req.body); // async
    res.send("success");
  },
}

