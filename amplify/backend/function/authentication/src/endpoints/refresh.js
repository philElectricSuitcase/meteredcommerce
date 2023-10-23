const sessionUtils = require("./../utils/sessionUtils");

const processRefreshRequest = (req, res) => {
  const { session_id, refresh_token } = req.body;

  sessionUtils.getSession(session_id).then((sessionSearchResult) => {
    if (!sessionSearchResult.success) {
      console.log("Failed to find session " + session_id);
      res.status(403).send({
        message: "Invalid session provided",
      });
    } else {
      if (sessionSearchResult.session.refresh_token !== refresh_token) {
        console.log(
          "Session does not have the same access token as the one provided"
        );
        res.status(401).send({
          message: "Invalid session provided",
        });
      } else {
        console.log("Session was found with provided refresh token");

        if (
          sessionSearchResult.session.forced_expiration !== undefined &&
          sessionSearchResult.session.forced_expiration !== null &&
          sessionSearchResult.session.forced_expiration !== 0
        ) {
          console.log("Session has been forced to expire");
          res.status(401).send({
            message: "Session expired",
          });
        } else {
          if (
            sessionSearchResult.session.refresh_token_created_at ===
              undefined ||
            sessionSearchResult.session.refresh_token_created_at === null ||
            sessionSearchResult.session.refresh_token_expires_at ===
              undefined ||
            sessionSearchResult.session.refresh_token_expires_at === null ||
            sessionSearchResult.session.session_created_date === undefined ||
            sessionSearchResult.session.session_created_date === null ||
            sessionSearchResult.session.session_expires_at === undefined ||
            sessionSearchResult.session.session_expires_at === null
          ) {
            res.status(401).send({
              message: "Session is invalid",
            });
          } else {
            let currentUTCEpoch = new Date().getTime();

            let refreshTokenStartEpoch =
              sessionSearchResult.session.refresh_token_created_at.getTime();
            let refreshTokenEndEpoch =
              sessionSearchResult.session.refresh_token_expires_at.getTime();
            let sessionStartEpoch =
              sessionSearchResult.session.session_created_date.getTime();
            let sessionEndEpoch =
              sessionSearchResult.session.session_expires_at.getTime();

            if (
              currentUTCEpoch < sessionStartEpoch ||
              currentUTCEpoch > sessionEndEpoch
            ) {
              console.log("Entire session has expired");
              res.status(401).send({
                message: "Session expired",
              });
            } else {
              if (
                currentUTCEpoch < refreshTokenStartEpoch ||
                currentUTCEpoch > refreshTokenEndEpoch
              ) {
                console.log("Refresh token has expired");
                res.status(401).send({
                  message: "Refresh token has expired, please login again",
                });
              } else {
                console.log(
                  "Refresh token and session are still active, about to generate new refresh token"
                );

                sessionUtils
                  .refreshSession(session_id)
                  .then((sessionRefreshResult) => {
                    if (!sessionRefreshResult.success) {
                      console.error("Failed to update session tokens");
                      res.status(500).send({
                        message: "An internal server error has occurred",
                      });
                    } else {
                      console.log("Session tokens have been updated");
                      res.status(200).send({
                        user_id: sessionSearchResult.session.user_id,
                        session_id: sessionSearchResult.session.id,

                        access_token: sessionRefreshResult.session.access_token,
                        access_token_created_at:
                          sessionRefreshResult.session.access_token_created_at,
                        access_token_expires_at:
                          sessionRefreshResult.session.access_token_expires_at,

                        refresh_token:
                          sessionRefreshResult.session.refresh_token,
                        refresh_token_created_at:
                          sessionRefreshResult.session.refresh_token_created_at,
                        refresh_token_expires_at:
                          sessionRefreshResult.session.refresh_token_expires_at,
                      });
                    }
                  });
              }
            }
          }
        }
      }
    }
  });
};

module.exports = processRefreshRequest;
