import { v4 } from "uuid";


export default class Uuid {
  constructor(Db, DbCollectionName) {
    this.Db = Db;
    this.DbCollectionName = DbCollectionName;
  }


  // keep generating uuid's until a unique is found
  simpleGenerateId() {
    return v4();
  }
  async generateUuid(capability) {
    let uuid = "";

    try {
      do {
        uuid = v4();
      } while (await !this.isUnique(capability, uuid, "orderId"));

    } catch (err) {
      throw err;
    }
    return uuid;
  }


  // if a record has not been found return true, if a record has been found return false
  async isUnique(capability, id, idType) {
    if (!await this.fetchOrder(capability, id, idType)) {
      return true;
    } else {
      return false;
    }
  }

  // fetch an Order record with the uuid value that was generated, if any
  async fetchOrder(capability, id, idType) {
    try {
      const data = await capability.Database.fetchDocumentDb(this.Db, idType, id, this.DbCollectionName);
      if(!data) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
}


