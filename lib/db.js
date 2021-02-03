import mongoose from "mongoose";
import config from "../config/config.js";
import CustomErrors from "./errors.js";

const connectionString = config.credentials.mongo.connectionString;

// Make sure connection string is there
if (!connectionString) {
  throw new CustomErrors.configMissing("Mongodb connection string missing from .credentials file!");
}

// Declare mongoose Options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

// Establish connection
mongoose.connect(connectionString, mongooseOptions);

// Create db object on connection
const db = mongoose.connection;

// if there has been an error establishing the connection
db.on("error", err => {
  throw new CustomErrors.dbError("Could not establish connection to mongo");
});

// If connection successfull inform
db.once("open", () => console.log("MongoDB connection established!"));


export default db;
