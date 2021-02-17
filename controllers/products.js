export default {
  wheelCover(req, res) {
    try {
      let index = req.app.locals.products.findIndex((element) => {
        return element.productID === "100";
      });
      if (index < 0) throw new Error("colud not find product with id 100, wheelCover controller for /product/wheelCover route");

      res.render("products/wheelCover", {layout: "main", product: req.app.locals.products[index]});
    } catch (err) {
      console.log(err);
    }
  },
  sprayhood(req, res) {
    try {
      let index = req.app.locals.products.findIndex((element) => {
        return element.productID === "200";
      });
      if (index < 0) throw new Error("colud not find product with id 200, wheelCover controller for /product/wheelCover route");

      res.render("products/sprayhood", {layout: "main", product: req.app.locals.products[index]});
    } catch (err) {
      console.log(err);
    }
  },
  custom(req, res) {
    try {
      let index = req.app.locals.products.findIndex((element) => {
        return element.productID === "300";
      });
      if (index < 0) throw new Error("colud not find product with id 300, wheelCover controller for /product/wheelCover route");

      res.render("products/custom", {layout: "main", product: req.app.locals.products[index]});
    } catch (err) {
      console.log(err);
    }
  },
}
