const cryptoUtils = require("./cryptoUtils");
const Database = require("./../services/database");
const { getUTCDateTimeString } = require("./formatting.js");

const MAX_ACCESS_TOKEN_LENGTH_SECONDS = 30 * 60; // 30 minutes
const MAX_REFRESH_TOKEN_LENGTH_SECONDS = 8 * 60 * 60; // 8 hours
const MAX_SESSION_LENGTH_SECONDS = 24 * 60 * 60; // 1 day

const getOptimalSessionExpirationDate = (providedExpirationDate) => {
  // Try to expire between midnight and 1am before the expiration date provided
  let resultExpirationDate = new Date(providedExpirationDate);
  if (resultExpirationDate.getUTCHours() > 1) {
    resultExpirationDate = new Date(resultExpirationDate).setUTCHours(1);
    resultExpirationDate = new Date(resultExpirationDate).setUTCMinutes(0);
    resultExpirationDate = new Date(resultExpirationDate).setUTCSeconds(0);
  }
  return resultExpirationDate;
};

const createNewSession = async (userId, sourceIP) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      cryptoUtils.getNewAccessToken(),
      cryptoUtils.getNewRefreshToken(),
    ])
      .then((values) => {
        let accessToken = values[0];
        let refreshToken = values[1];

        // Create a structure containing all the required session information
        const newSessionCreatedDate = new Date();
        const newSessionExpirationDate = getOptimalSessionExpirationDate(
          new Date(newSessionCreatedDate).setUTCSeconds(
            newSessionCreatedDate.getUTCSeconds() + MAX_SESSION_LENGTH_SECONDS
          )
        );
        const accessTokenCreatedDate = new Date(newSessionCreatedDate);
        const accessTokenExpirationDate = new Date(
          accessTokenCreatedDate
        ).setUTCSeconds(
          accessTokenCreatedDate.getUTCSeconds() +
            MAX_ACCESS_TOKEN_LENGTH_SECONDS
        );
        const refreshTokenCreatedDate = new Date(newSessionCreatedDate);
        const refreshTokenExpirationDate = new Date(
          refreshTokenCreatedDate
        ).setUTCSeconds(
          refreshTokenCreatedDate.getUTCSeconds() +
            MAX_REFRESH_TOKEN_LENGTH_SECONDS
        );
        const newSession = {
          id: null,
          user_id: userId,
          source_ip_address: sourceIP,
          access_token: accessToken,
          access_token_created_at: getUTCDateTimeString(accessTokenCreatedDate),
          access_token_expires_at: getUTCDateTimeString(
            accessTokenExpirationDate
          ),
          refresh_token: refreshToken,
          refresh_token_created_at: getUTCDateTimeString(
            refreshTokenCreatedDate
          ),
          refresh_token_expires_at: getUTCDateTimeString(
            refreshTokenExpirationDate
          ),
          session_created_date: getUTCDateTimeString(newSessionCreatedDate),
          session_expires_at: getUTCDateTimeString(newSessionExpirationDate),
          session_last_accessed: getUTCDateTimeString(newSessionCreatedDate),
        };

        // Try and insert the new session into the database
        let databaseInstance = new Database();
        databaseInstance
          .connect()
          .then(() => databaseInstance.insertSession(newSession))
          .then((newSessionId) =>
            databaseInstance.closeConnection(newSessionId)
          )
          .then((newSessionId) => {
            newSession.id = newSessionId;

            resolve({
              success: true,
              session: newSession,
            });
          })
          .catch((err) => {
            console.error("Had an error inserting a session token: ", err);

            databaseInstance
              .closeConnection()
              .then(() => {
                console.log(
                  "Database connection has been closed successfully after error"
                );
                resolve({
                  success: false,
                  session: null,
                });
              })
              .catch((error) => {
                console.error(
                  "Failed to close database connection following error"
                );
                resolve({
                  success: false,
                  session: null,
                });
              });
          });
      })
      .catch((err) => {
        console.error(
          "Had issue generating either access token or refresh token: " + err
        );
        resolve({
          success: false,
          session: null,
        });
      });
  });
};

const getSession = async (sessionId) => {
  return new Promise((resolve, reject) => {
    let databaseInstance = new Database();
    databaseInstance
      .connect()
      .then(() => databaseInstance.getSession(sessionId))
      .then((session) => databaseInstance.closeConnection(session))
      .then((session) => {
        resolve({
          success: true,
          session: session,
        });
      })
      .catch((err) => {
        console.error("Had an error inserting a session token: ", err);

        databaseInstance
          .closeConnection()
          .then(() => {
            console.log(
              "Database connection has been closed successfully after error"
            );
            resolve({
              success: false,
              session: null,
            });
          })
          .catch((error) => {
            console.error(
              "Failed to close database connection following error"
            );
            resolve({
              success: false,
              session: null,
            });
          });
      });
  });
};

const updateSessionLastAccessed = async (sessionId) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    let lastAccessedDateString = getUTCDateTimeString(currentDate);

    // Try and update the session into the database
    let databaseInstance = new Database();
    databaseInstance
      .connect()
      .then(() =>
        databaseInstance.updateSessionLastAccessed(
          sessionId,
          lastAccessedDateString
        )
      )
      .then(() => databaseInstance.closeConnection())
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.error(
          "Had an error updating a session last accessed time: ",
          err
        );

        databaseInstance
          .closeConnection()
          .then(() => {
            console.log(
              "Database connection has been closed successfully after error"
            );
            resolve(false);
          })
          .catch((error) => {
            console.error(
              "Failed to close database connection following error"
            );
            resolve(false);
          });
      });
  });
};

const refreshSession = async (sessionId) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      cryptoUtils.getNewAccessToken(),
      cryptoUtils.getNewRefreshToken(),
    ])
      .then((values) => {
        let accessToken = values[0];
        let refreshToken = values[1];

        // Create a structure containing all the required session information
        const currentDate = new Date();
        const accessTokenCreatedDate = new Date(currentDate);
        const accessTokenExpirationDate = new Date(
          accessTokenCreatedDate
        ).setSeconds(
          accessTokenCreatedDate.getUTCSeconds() +
            MAX_ACCESS_TOKEN_LENGTH_SECONDS
        );
        const refreshTokenCreatedDate = new Date(currentDate);
        const refreshTokenExpirationDate = new Date(
          refreshTokenCreatedDate
        ).setSeconds(
          refreshTokenCreatedDate.getUTCSeconds() +
            MAX_REFRESH_TOKEN_LENGTH_SECONDS
        );

        let lastAccessedDateString = getUTCDateTimeString(currentDate);
        let accessTokenCreatedDateString = getUTCDateTimeString(
          accessTokenCreatedDate
        );
        let accessTokenExpiredAtString = getUTCDateTimeString(
          accessTokenExpirationDate
        );
        let refreshTokenCreatedDateString = getUTCDateTimeString(
          refreshTokenCreatedDate
        );
        let refreshTokenExpiredAtString = getUTCDateTimeString(
          refreshTokenExpirationDate
        );

        // Try and update the session into the database
        let databaseInstance = new Database();
        databaseInstance
          .connect()
          .then(() =>
            databaseInstance.updateSessionTokens(
              sessionId,
              accessToken,
              refreshToken,
              accessTokenCreatedDateString,
              accessTokenExpiredAtString,
              refreshTokenCreatedDateString,
              refreshTokenExpiredAtString,
              lastAccessedDateString
            )
          )
          .then(() => databaseInstance.closeConnection())
          .then(() => {
            resolve({
              success: true,
              session: {
                access_token: accessToken,
                access_token_created_at: accessTokenCreatedDateString,
                access_token_expires_at: accessTokenExpiredAtString,
                refresh_token: refreshToken,
                refresh_token_created_at: refreshTokenCreatedDateString,
                refresh_token_expires_at: refreshTokenExpiredAtString,
              },
            });
          })
          .catch((err) => {
            console.error("Had an error updating a session token: ", err);

            databaseInstance
              .closeConnection()
              .then(() => {
                console.log(
                  "Database connection has been closed successfully after error"
                );
                resolve({
                  success: false,
                  session: null,
                });
              })
              .catch((error) => {
                console.error(
                  "Failed to close database connection following error"
                );
                resolve({
                  success: false,
                  session: null,
                });
              });
          });
      })
      .catch((err) => {
        console.error(
          "Had issue generating either access token or refresh token: " + err
        );
        resolve({
          success: false,
          session: null,
        });
      });
  });
};

const getSessionStatus = async (sessionId, accessToken) => {
  return new Promise((resolve, reject) => {
    getSession(sessionId).then((sessionSearchResult) => {
      if (!sessionSearchResult.success) {
        console.log("Failed to find session " + sessionId);
        resolve({
          statusCode: 401,
          message: "Invalid session provided",
        });
      } else {
        if (sessionSearchResult.session.access_token !== accessToken) {
          console.log(
            "Session does not have the same access token as the one provided"
          );
          resolve({
            statusCode: 401,
            message: "Invalid session provided",
          });
        } else {
          console.log("Session was found with provided access token");

          if (
            sessionSearchResult.session.forced_expiration !== undefined &&
            sessionSearchResult.session.forced_expiration !== null &&
            sessionSearchResult.session.forced_expiration !== 0
          ) {
            console.log("Session has been forced to expire");
            resolve({
              statusCode: 401,
              message: "Session expired",
            });
          } else {
            if (
              sessionSearchResult.session.access_token_created_at ===
                undefined ||
              sessionSearchResult.session.access_token_created_at === null ||
              sessionSearchResult.session.access_token_expires_at ===
                undefined ||
              sessionSearchResult.session.access_token_expires_at === null ||
              sessionSearchResult.session.session_created_date === undefined ||
              sessionSearchResult.session.session_created_date === null ||
              sessionSearchResult.session.session_expires_at === undefined ||
              sessionSearchResult.session.session_expires_at === null
            ) {
              resolve({
                statusCode: 401,
                message: "Session is invalid",
              });
            } else {
              let currentUTCEpoch = new Date().getTime();

              let accessTokenStartEpoch =
                sessionSearchResult.session.access_token_created_at.getTime();
              let accessTokenEndEpoch =
                sessionSearchResult.session.access_token_expires_at.getTime();
              let sessionStartEpoch =
                sessionSearchResult.session.session_created_date.getTime();
              let sessionEndEpoch =
                sessionSearchResult.session.session_expires_at.getTime();

              if (
                currentUTCEpoch < sessionStartEpoch ||
                currentUTCEpoch > sessionEndEpoch
              ) {
                console.log("Entire session has expired");
                resolve({
                  statusCode: 401,
                  message: "Session expired",
                });
              } else {
                if (
                  currentUTCEpoch < accessTokenStartEpoch ||
                  currentUTCEpoch > accessTokenEndEpoch
                ) {
                  console.log("Access token has expired");
                  resolve({
                    statusCode: 403,
                    message: "Access token has expired, please refresh",
                  });
                } else {
                  updateSessionLastAccessed(sessionId).then(
                    (lastAccessedUpdateResult) => {
                      if (!lastAccessedUpdateResult) {
                        console.error("Failed to update last accessed date");
                        resolve({
                          statusCode: 500,
                          message: "An internal server error has occurred",
                        });
                      } else {
                        console.log(
                          "Session was valid and the last accessed time was updated"
                        );
                        resolve({
                          statusCode: 200,
                          message: "Session is valid",
                        });
                      }
                    }
                  );
                }
              }
            }
          }
        }
      }
    });
  });
};

module.exports = {
  createNewSession,
  getSession,
  refreshSession,
  updateSessionLastAccessed,
  getSessionStatus,
};
