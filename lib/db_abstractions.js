// IMPORTING MONGOOSE MODELS STARTS HERE//
// ------------------------------------ //
import Costumer from "../models/costumer.js";
import Product from "../models/product.js";
import Order from "../models/order.js";


// ----------------------------------- //
// IMPORTING MONGOSOE MODELS STOPS HERE //




class Mongoose {
  fetchDocumentDb(mongooseModel, key, value) {
    return mongooseModel.findOne({[key]: value}).lean();
  }
  createDocumentDb(mongooseModel, newDocument, schema = {}) {
    let newOrder = new mongooseModel(newDocument);
    return newOrder.save();
  }


  // returns a query document
  // a successfull update can be tested
  // by querying the property 'n' and 'nModified' of the return object
  updateDocumentDb(mongooseModel, key, value, newDocument) {
    return mongooseModel.updateOne({[key]: value}, newDocument).lean();
  }

  fetchAllDocumentsDb(mongooseModel) {
    return mongooseModel.find().lean();
  }
}


class Database {
  constructor() {
    this.Mongoose = new Mongoose();
    this.mongooseModels = {
      costumer: Costumer,
      product: Product,
      order: Order,
    }
  }

  // database = string, declaring the type of database used
  // key = string, the row cell type to try and locate the document from
  // value = string, the value of the row cell
  // table = string, the name of the collection or table that the document is being searched in
  fetchDocumentDb(database, key, value, table = "") {
    switch (database) {
    case "mongo":
      for (const property in this.mongooseModels) {
        if (property === table) {
          return this.Mongoose.fetchDocumentDb(this.mongooseModels[property], key, value).lean();
        }
      }
      throw new Error("No mongoose model could be found in the Database class, file: db_abstractions.js");
      break;
    default:
      throw new Error("Wrong database string provided, file: db_abstractions.js");
      break;
    }
  }

  // database = string, the name of the database being used
  // table = string, identifying the model in mongo
  fetchAllDocumentsDb(database, table) {
    switch (database) {
    case "mongo":
      for (const property in this.mongooseModels) {
        if (property === table) {
          return this.Mongoose.fetchAllDocumentsDb(this.mongooseModels[property], table);
        }
      }
      throw new Error("No mongoose model could be found in the database class, file: db_abstractions.js");
      break;
    default:
      throw new Error("Wrong database string provided, file: db_abstractions.js");
    }
  }

  // database = string such as "mongo"
  // newDocument = an object -> the new record to be created
  // table = string, identifying the model
  // schema = not needed
  createDocumentDb(database, newDocument, table = "", schema = {}) {
    switch (database) {
    case "mongo":
      for (const property in this.mongooseModels) {
        if (property === table) {
          return this.Mongoose.createDocumentDb(this.mongooseModels[property], newDocument, schema);
        }
      }
      throw new Error("No mongoose model could be found in the Database class, file: db_abstractions.js");
      break;
    default:
      throw new Error("Wrong database string provided, file: db_abstractions.js");
      break;
    }
  }

  // database = string such as "mongo"
  // key = the type of id, such as an email or data type of _id
  // value = the value of that id,
  // newDocument = what to update it with
  // table = string, identifying the model
  updateDocumentDb(database, key, value, newDocument, table = {}) {
    switch (database) {
    case "mongo":
      for (const property in this.mongooseModels) {
        if (property === table) {
          return this.Mongoose.updateDocumentDb(this.mongooseModels[property], key, value, newDocument);
        }
      }
      throw new Error("No mongoose model could be found in the Database class, file: db_abstractions.js");
      break;
    default:
      throw new Error("Wrong database string provided, file: db_abstractions.js");
      break;
    }
  }
}
export default Database;
