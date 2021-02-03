const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3000;
import credentials from "./.credentials.development.js";

export default {
  env: env,
  port: port,
  credentials: credentials
};
