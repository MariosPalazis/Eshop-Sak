import Chalk from "chalk";

// IMPORTING OWN MODULES


export default {
  admin(req, res) {
    res.render("admin", {layout: "admin"});
  },
  wheelCover(req, res, next) {
    // get the product index
    let index = req.app.locals.products.findIndex((element) => {
      return element.productID === "200";
    });

    // if it has not been found, which it should not happen, call the serverFailure middleware
    if (index === -1) {
      next();
    } else { // else render the wheelCover page, passing it the product
      res.render("admin/products/wheelCover", {layout: "admin", product: req.app.locals.products[index]});
    }
  },
  sprayhood(req, res, next) {
    // get the product index
    let index = req.app.locals.products.findIndex((element) => {
      return element.productID === "200";
    });

    // if it has not been found, which it should not happen, call the serverFailure middleware
    if (index === -1) {
      next();
    } else {// else render the wheelCover page, passing it the product
      res.render("admin/products/sprayhood", {layout: "admin", product: req.app.locals.products[index]});
    }
  },
  custom(req, res, next) {
    // get the product index
    let index = req.app.locals.products.findIndex((element) => {
      return element.productID === "300";
    });

    // if it has not been found, which it should not happen, call the serverFailure middleware
    if (index === -1) {
      next();
    } else { // else render the wheelCover page, passing it the product
      res.render("admin/products/custom", {layout: "admin", product: req.app.locals.products[index]});
    }
  },
  serverFailure(req, res) {
    res.send("server failure");
  },
}
