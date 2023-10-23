const sessionUtils = require("./../utils/sessionUtils");
const userUtils = require("./../utils/userUtils");

const processLoginRequest = (req, res) => {
  const { email, password } = req.body;

  userUtils
    .getUserIdFromCredentials(email, password)
    .then((userSearchResult) => {
      if (!userSearchResult.success) {
        console.log(
          "Failed to find user under the email '" +
            email +
            "' and provided password"
        );
        res.status(400).send({
          error: "No user was found matching the provided credentials",
        });
      } else {
        let userId = userSearchResult.userId;
        let sourceIP =
          req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        console.log(
          "Found user " +
            userSearchResult.userId +
            " from the email '" +
            email +
            "' and provided password, request from '" +
            sourceIP +
            "'"
        );

        sessionUtils
          .createNewSession(userId, sourceIP)
          .then((sessionCreationResult) => {
            console.log(JSON.stringify(sessionCreationResult));
            if (sessionCreationResult.success) {
              res.status(200).send({
                user_id: sessionCreationResult.session.user_id,
                session_id: sessionCreationResult.session.id,

                access_token: sessionCreationResult.session.access_token,
                access_token_created_at:
                  sessionCreationResult.session.access_token_created_at,
                access_token_expires_at:
                  sessionCreationResult.session.access_token_expires_at,

                refresh_token: sessionCreationResult.session.refresh_token,
                refresh_token_created_at:
                  sessionCreationResult.session.refresh_token_created_at,
                refresh_token_expires_at:
                  sessionCreationResult.session.refresh_token_expires_at,
              });
            } else {
              res.status(500).send({
                error: "Had internal server issue creating new session",
              });
            }
          });
      }
    });
};

module.exports = processLoginRequest;
