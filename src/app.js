const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { authLimiter } = require("./middlewares/rateLimiter");
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const logRequest = require("./middlewares/logRequest");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const logger = require("./config/logger");
const app = express();
// const dir = "./public/uploads";
if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/auth", authLimiter);
}
app.use(express.static("public"));
app.use(logRequest);

// v1 api routes
app.use(routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  var html = buildHtml(req);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": html.length,
    Expires: new Date().toUTCString(),
  });
  res.end(html);
  logger.info("Api Not Found");
  next();
});

function buildHtml(req) {
  var header = "";
  var body = "";

  // concatenate header string
  // concatenate body string

  return `
    <!DOCTYPE html>
      <html><head>
      <title>AdeelBux Private Access</title>
    </head><body>
      <div style="
      position: absolute;
      left: 50%; 
      top: 50%; 
      -webkit-transform: translate(-50%, -50%); 
      transform: translate(-50%, -50%);
      padding:10rem;
      border-radius:10px;
      font-family:Sans-serif;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      ">
      <h1>Private Access</h1>
      </div>
      </body></html>
    `;
}

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
