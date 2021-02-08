const DB = "mongo";
const USER_DB = "costumer";
const PRODUCTS_DB = "product";
const PRODUCT_DB_KEY = "productID";
const ORDER_DB = "order";


export default class Admin {

  constructor() {
    this.Product = new Product();
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

  updateProduct() {
    
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


