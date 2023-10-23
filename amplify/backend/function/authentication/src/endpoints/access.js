const sessionUtils = require("./../utils/sessionUtils");

const processAccessRequest = (req, res) => {
  const { session_id, access_token } = req.body;

  sessionUtils
    .getSessionStatus(session_id, access_token)
    .then((sessionResult) => {
      res
        .status(sessionResult.statusCode)
        .send({ message: sessionResult.message });
    });
};

module.exports = processAccessRequest;
