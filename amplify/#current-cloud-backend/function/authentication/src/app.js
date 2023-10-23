const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const endpoints = require("./endpoints/index");

// Create a new express app
const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
expressApp.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Hook up the authentication endpoints to the express app
endpoints(expressApp);

expressApp.listen(3000, function () {
  console.log("App started");
});

module.exports = expressApp;
