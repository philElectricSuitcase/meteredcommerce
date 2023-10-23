// const AUTHENTICATION_API_HOSTNAME = "https://0z70q3msrd.execute-api.eu-west-2.amazonaws.com/default";

import axios from "axios";

const AUTHENTICATION_API_HOSTNAME =
  "https://x56x6mlw4i.execute-api.eu-west-2.amazonaws.com/dev";

let isRefreshingToken = false;

//
// Access Tokens
//

const invalidateStoredAccessToken = () =>
  localStorage.removeItem("access_token");
const getStoredAccessTokenObject = () => {
  let storedAccessTokenString = localStorage.getItem("access_token");

  if (storedAccessTokenString === undefined || storedAccessTokenString === null)
    return null;

  let storedAccessTokenObject = JSON.parse(storedAccessTokenString);
  if (
    storedAccessTokenObject === undefined ||
    storedAccessTokenObject === null
  ) {
    invalidateStoredAccessToken();
    return null;
  }

  return storedAccessTokenObject;
};
const setStoredAccessToken = (
  user_id: number,
  session_id: string,
  access_token: string,
  created_date: Date,
  expires_at: Date
) => {
  //const setStoredAccessToken = (user_id, session_id, access_token, created_date, expires_at) => {
  let accessTokenObject = {
    user_id: user_id,
    session_id: session_id,
    access_token: access_token,
    created_date: created_date,
    expires_at: expires_at,
  };
  let accessTokenObjectString = JSON.stringify(accessTokenObject);
  localStorage.setItem("access_token", accessTokenObjectString);
};

//
// Refresh Tokens
//

const invalidateStoredRefreshToken = () => {
  isRefreshingToken = false;
  localStorage.removeItem("refresh_token");
};
const getStoredRefreshTokenObject = () => {
  let refreshAccessTokenString = localStorage.getItem("refresh_token");

  if (
    refreshAccessTokenString === undefined ||
    refreshAccessTokenString === null
  )
    return null;

  let refreshAccessTokenObject = JSON.parse(refreshAccessTokenString);
  if (
    refreshAccessTokenObject === undefined ||
    refreshAccessTokenObject === null
  ) {
    invalidateStoredRefreshToken();
    return null;
  }

  return refreshAccessTokenObject;
};
// const setStoredRefreshToken = (user_id, session_id, refresh_token, created_date, expires_at) => {
const setStoredRefreshToken = (
  user_id: number,
  session_id: string,
  refresh_token: string,
  created_date: Date,
  expires_at: Date
) => {
  isRefreshingToken = false;

  let refreshTokenObject = {
    user_id: user_id,
    session_id: session_id,
    refresh_token: refresh_token,
    created_date: created_date,
    expires_at: expires_at,
  };
  let refreshTokenObjectString = JSON.stringify(refreshTokenObject);
  localStorage.setItem("refresh_token", refreshTokenObjectString);
};

//
// General
//

const invalidateStoredTokens = () => {
  invalidateStoredAccessToken();
  invalidateStoredRefreshToken();
};

//
// Authentication Interface
//

export const performRefreshRequest = async () => {
  return new Promise<void>((resolve, reject) => {
    if (isRefreshingToken) {
      window.setTimeout(() => {
        if (!isRefreshingToken) resolve();
      }, 100);
    } else {
      isRefreshingToken = true;

      let refreshTokenObject = getStoredRefreshTokenObject();
      if (refreshTokenObject === null) {
        isRefreshingToken = false;
        reject();
      } else {
        axios
          .post(AUTHENTICATION_API_HOSTNAME + "/refresh", {
            session_id: refreshTokenObject.session_id,
            refresh_token: refreshTokenObject.refresh_token,
          })
          .then((response) => {
            if (response.status === 200) {
              let refreshResponseObject = response.data;

              let userId = refreshResponseObject.user_id;
              let sessionId = refreshResponseObject.session_id;
              let accessToken = refreshResponseObject.access_token;
              let refreshToken = refreshResponseObject.refresh_token;
              let accessTokenCreatedDate =
                refreshResponseObject.access_token_created_at;
              let accessTokenExpiresAt =
                refreshResponseObject.access_token_expires_at;
              let refreshTokenCreatedDate =
                refreshResponseObject.refresh_token_created_at;
              let refreshTokenExpiresAt =
                refreshResponseObject.refresh_token_expires_at;

              setStoredAccessToken(
                userId,
                sessionId,
                accessToken,
                accessTokenCreatedDate,
                accessTokenExpiresAt
              );
              setStoredRefreshToken(
                userId,
                sessionId,
                refreshToken,
                refreshTokenCreatedDate,
                refreshTokenExpiresAt
              );

              isRefreshingToken = false;
              resolve();
            } else {
              isRefreshingToken = false;
              reject();
            }
          })
          .catch(() => {
            isRefreshingToken = false;
            reject();
          });
      }
    }
  });
};

export const performLoginRequest = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    invalidateStoredTokens();

    axios
      .post(AUTHENTICATION_API_HOSTNAME + "/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          let loginResponseObject = response.data;

          let userId = loginResponseObject.user_id;
          let sessionId = loginResponseObject.session_id;
          let accessToken = loginResponseObject.access_token;
          let refreshToken = loginResponseObject.refresh_token;
          let accessTokenCreatedDate =
            loginResponseObject.access_token_created_at;
          let accessTokenExpiresAt =
            loginResponseObject.access_token_expires_at;
          let refreshTokenCreatedDate =
            loginResponseObject.refresh_token_created_at;
          let refreshTokenExpiresAt =
            loginResponseObject.refresh_token_expires_at;

          setStoredAccessToken(
            userId,
            sessionId,
            accessToken,
            accessTokenCreatedDate,
            accessTokenExpiresAt
          );
          setStoredRefreshToken(
            userId,
            sessionId,
            refreshToken,
            refreshTokenCreatedDate,
            refreshTokenExpiresAt
          );

          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        reject(false);
      });
  });
};

export const performLogoutRequest = async () => {
  invalidateStoredTokens();
};

export const getAccessTokenObject = async (allowRefresh = true) => {
  return new Promise((resolve, reject) => {
    let storedAccessTokenObject = getStoredAccessTokenObject();

    if (storedAccessTokenObject === null) {
      reject();
    } else {
      // Check whether the access token is still active
      if (
        storedAccessTokenObject.created_date === undefined ||
        storedAccessTokenObject.expires_at === undefined
      ) {
        reject();
      } else {
        let currentDate = new Date();
        let currentDateEpoch =
          currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;
        let accessTokenStartDate = new Date(
          storedAccessTokenObject.created_date
        );
        let accessTokenStartEpoch =
          accessTokenStartDate.getTime() +
          accessTokenStartDate.getTimezoneOffset() * 60 * 1000;
        let accessTokenExpiresDate = new Date(
          storedAccessTokenObject.expires_at
        );
        let accessTokenExpiresEpoch =
          accessTokenExpiresDate.getTime() - 10 * 1000;

        if (
          currentDateEpoch < accessTokenStartEpoch ||
          currentDateEpoch > accessTokenExpiresEpoch
        ) {
          // Token has expired, so refresh (if allowed)
          if (!allowRefresh) {
            reject();
          } else {
            performRefreshRequest()
              .then(() => {
                getAccessTokenObject(false)
                  .then((tokenStructure) => {
                    resolve(tokenStructure);
                  })
                  .catch(() => {
                    reject();
                  });
              })
              .catch(() => {
                reject();
              });
          }
        } else {
          // Token is still active, so return it
          resolve({
            user_id: storedAccessTokenObject.user_id,
            session_id: storedAccessTokenObject.session_id,
            access_token: storedAccessTokenObject.access_token,
          });
        }
      }
    }
  });
};
