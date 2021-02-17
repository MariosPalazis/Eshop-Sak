import {createRequire} from "module";
import express from "express";
import expressHandlebars from "express-handlebars";
import {fileURLToPath} from "url";
import {dirname} from "path";
import bodyParser from "body-parser";
const require = createRequire(import.meta.url);
import redis from "redis";
import expressSession from "express-session";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// importing configuration variables
import config from "./config/config.js";

// Starting app
const app = express();

// Starting mongo connection
import db from "./lib/db.js";

// importing the errors module
import CustomErrors from "./lib/errors.js";


// DECLARING THIRD PARTY MIDDLEWARE //
// --------------------------------- //

// -Redis-client
const redisStore = require("./node_modules/connect-redis")(expressSession);
const redisClient = redis.createClient({
  port: config.credentials.redis.port,
  host: config.credentials.redis.url,
  password: config.credentials.redis.password,
});
redisClient.on("error", console.log);
redisClient.on("ready", () => { console.log("Redis connection established!")});

// -body-parser
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: false}));


// - express-session
app.use(expressSession({
  resave: false, //false
  saveUninitialized: false,
  secret: config.credentials.cookieSecret,
  rolling: false, //true
  cookie: {
    sameSite: "lax",
    maxAge: 100000,
  },
  store: new redisStore({
    client: redisClient
  })
}));


// - stripe
const stripe = require("stripe")("sk_test_51IG0iBIcyuDodgYRntE3pSNuA9TiD4CCKWqgZ2PT7YKUuHkGDUz85cjbCZmMk9G1fjSmBeSLyE1ez5ILlUrBPLHa00Zs8pLOKS");

// -handlebars
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", expressHandlebars({
  defaultLayout: "main",
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set("view engine", "handlebars");



// -passport (i have modified it slightly in order to accomodate a local strategy)
import passport from "./lib/passport.js";
app.use(passport.initialize());
app.use(passport.session());

// THIRD PARTY MIDDLEWARE STOPS HERE //
// --------------------------------- //


// CUSTOM MODULES STARTS HERE //
// ----------------------------- //
import myMiddleware from "./lib/middleware.js";
import capability from "./lib/states2.js";
let Capability = capability(app);


app.use(Capability.initializeCapability);
app.use(Capability.seedProducts);
app.use(myMiddleware.subRoutes);
app.use(myMiddleware.flashMessages);
app.use(myMiddleware.stateShoppingCart);
app.use(myMiddleware.isUsername);


// COSTUM MODULES ENDS HERE //
// --------------------------- //





// ROUTE MIDDLEWARE IMPORT AND DECLARATION STARTS HERE //
// ---------------------------------------------------- //
import checkoutRoutes from "./routes/checkout.js";
import loginRoutes from "./routes/login.js";
import productsRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import shoppingCartRoutes from "./routes/shopping_cart.js";

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.session.state);
  next();
})

app.get("/", (req, res) => {
  res.render("home");
})


app.use("/", loginRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/shoppingCart", shoppingCartRoutes);
app.use("/product", productsRoutes);
app.use("/admin", adminRoutes);
app.get("/pay", (req, res) => {
  res.render("checkout/payment.handlebars", {layout: null});
})
app.post("/create-payment-intent", async (req, res) => {

  const paymentIntent = await stripe.paymentIntents.create({
    amount: "300",
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  })
})


// ROUTE MIDDLEWARE IMPORTS AND DECLARATIONS END HERE //
// -------------------------------------------------- //


// ERROR HANDLING //
// -------------- //

app.use((err, req, res, next) => {
  console.log(err);
})
// ERROR HANDLING STOPS HERE //
// ------------------------ //

// Starting the server
app.listen(config.port, () => console.log(`Express started in` +
                                          `${config.env} mode at http://localhost:${config.port}` +
                                          `; precss Ctrl-C to terminate.`));




