const processLoginRequest = require("./login");
const processAccessRequest = require("./access");
const processRefreshRequest = require("./refresh");
const processSetPasswordRequest = require("./setPassword");
const processResetPasswordRequest = require("./resetPassword");
const processPermissionsRequest = require("./permissions");

function endpoints(app) {
  app.post("/setPassword", processSetPasswordRequest);
  app.post("/resetPassword", processResetPasswordRequest);

  app.post("/login", processLoginRequest);

  app.post("/access", processAccessRequest);
  app.post("/refresh", processRefreshRequest);

  app.post("/permissions", processPermissionsRequest);
}

module.exports = endpoints;
