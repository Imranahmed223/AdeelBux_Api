const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const fs = require("fs");
const https = require("https");
const http = require("http");
// var cert = fs.readFileSync("sslcert/cert.pem", "acsii");
// var ca = fs.readFileSync("sslcert/ca.pem", "acsii");
// var key = fs.readFileSync("sslcert/private.pem", "ascii");
// var credentials = { key: key, cert: cert, ca: ca };
var httpServer = http.createServer(app);
// var httpsServer = https.createServer(app);
let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  httpServer.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  // httpsServer.listen(config.httpsPort, "", () => {
  //   logger.info(`Listening to port ${config.port}`);
  // });
});
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
