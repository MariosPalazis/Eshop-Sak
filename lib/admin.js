const DB = "mongo";
const USER_DB = "costumer";
const PRODUCTS_DB = "product";
const PRODUCT_DB_KEY = "productID";
const ORDER_DB = "order";


//import db from "./db.js";
//import Database from "./db_abstractions.js";

export default class Admin {

  constructor() {
    this.Product = new Product();
    //this.Database = new Database();
  }

  // capability = req.app.locals.capability
  // oldProducts = req.app.locals.products
  // updates = req.body
  async makeChangesToProduct(capability, oldProducts, updates) {
    // get the index of the product in the products array
    let index = oldProducts.findIndex((element) => {
      return element.productID === updates.productId;
    })

    // replace the old value with the updated
    for (const table of updates.tables) {
      for (const records in oldProducts[index]) {
        if (table.tableClass === records) {
          oldProducts[index][records] = table.rows;
        }
      }
    }

    let key = "productID";
    let value = updates.productId;
    try {
      await this.Product.updateProduct(capability, key, value, oldProducts[index])
    } catch (err) {
      console.log(err);
    }
  }
}

class Product {
  constructor() {
    this.DbCollectionName = PRODUCTS_DB;
    this.DbKey = PRODUCT_DB_KEY;
    this.Db = DB;
  }


  // capability = Admin Object
  // newProduct = OBJECT
  async addNewProduct(capability, newProduct) {


    let a = await capability.Database.createDocumentDb(this.Db, newProduct, this.DbCollectionName);
    console.log(a);
  }

  async updateProduct(capability, key, value, update) {
    try {
      let respose =  await capability.Database.updateDocumentDb(this.Db, key, value, update, this.DbCollectionName);
    } catch (err) {
      console.log(err);
    }
  }

  removeProduct() {
  }

  // capability = req.app.locals.capability or app.locals.capability, or res.locals.capability
  // table = the model or the collection in mongo
  async fetchProducts(capability) {
    try {
      const all = await capability.Database.fetchAllDocumentsDb(this.Db, this.DbCollectionName);
      if (!all) throw new Error(`Could not fetch all ${table} records`);
      return all;
    } catch (err) {
      console.log(err)
    }
  }

}
