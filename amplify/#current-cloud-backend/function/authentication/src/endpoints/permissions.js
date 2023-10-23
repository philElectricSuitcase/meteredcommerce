const sessionUtils = require("./../utils/sessionUtils");
const permissionUtils = require("./../utils/permissionUtils");

const processPermissionsRequest = (req, res) => {
  const { user_id, session_id, access_token } = req.body;

  Promise.all([
    sessionUtils.getSessionStatus(session_id, access_token),
    permissionUtils.getUserPermissionSet(user_id),
  ])
    .then((sessionAndPermissions) => {
      let sessionStatus = sessionAndPermissions[0];
      let permissionSet = sessionAndPermissions[1];

      if (sessionStatus.statusCode === 200) {
        res.status(200).send(permissionSet);
      } else {
        res.status(401).send();
      }
    })
    .catch((err) => {
      console.error("Error processing permissions request: " + err);
      res.status(500).send();
    });
};

module.exports = processPermissionsRequest;
