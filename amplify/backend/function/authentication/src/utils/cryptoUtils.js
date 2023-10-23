const cryptography = require("crypto");

const HASH_ITERATIONS_PER_PASSWORD = 20000;
const ACCESS_TOKEN_LENGTH = 512;
const REFRESH_TOKEN_LENGTH = 512;
const PASSWORD_SALT_LENGTH = 512;
const NEW_PASSWORD_LENGTH = 12;

const ACCESS_TOKEN_BYTES = (ACCESS_TOKEN_LENGTH * 6) / 8;
const REFRESH_TOKEN_BYTES = (REFRESH_TOKEN_LENGTH * 6) / 8;
const PASSWORD_SALT_BYTES = (PASSWORD_SALT_LENGTH * 6) / 8;
const NEW_PASSWORD_BYTES = (NEW_PASSWORD_LENGTH * 6) / 8;

const getURLFriendlyBase64String = (rawBase64) =>
  rawBase64.replaceAll("+", ".").replaceAll("/", "_").replaceAll("=", "-");
const getUserFriendlyBase64String = (rawBase64) =>
  rawBase64.replaceAll("+", "@").replaceAll("/", "_").replaceAll("=", "-");

const getHashedPassword = (plaintext_password, salt) => {
  return new Promise((resolve, reject) => {
    let hashingAlgorithm = cryptography.createHash("sha512");
    for (let i = 0; i < HASH_ITERATIONS_PER_PASSWORD; i++) {
      hashingAlgorithm.update(salt);
      hashingAlgorithm.update(plaintext_password);
    }
    resolve(getURLFriendlyBase64String(hashingAlgorithm.digest("base64")));
  });
};
const getNewPassword = () => {
  return new Promise((resolve, reject) => {
    cryptography.randomBytes(NEW_PASSWORD_BYTES, (err, buf) => {
      if (err) {
        console.error("Failed to generate new password: " + err);
        reject();
      } else {
        resolve(getUserFriendlyBase64String(buf.toString("base64")));
      }
    });
  });
};
const getNewPasswordSalt = () => {
  return new Promise((resolve, reject) => {
    cryptography.randomBytes(PASSWORD_SALT_BYTES, (err, buf) => {
      if (err) {
        console.error("Failed to generate new password salt: " + err);
        reject();
      } else {
        resolve(getURLFriendlyBase64String(buf.toString("base64")));
      }
    });
  });
};

const getNewAccessToken = () => {
  return new Promise((resolve, reject) => {
    cryptography.randomBytes(ACCESS_TOKEN_BYTES, (err, buf) => {
      if (err) {
        console.error("Failed to generate new access token: " + err);
        reject();
      } else {
        resolve(getURLFriendlyBase64String(buf.toString("base64")));
      }
    });
  });
};
const getNewRefreshToken = () => {
  return new Promise((resolve, reject) => {
    cryptography.randomBytes(REFRESH_TOKEN_BYTES, (err, buf) => {
      if (err) {
        console.error("Failed to generate new refresh token: " + err);
        reject();
      } else {
        resolve(getURLFriendlyBase64String(buf.toString("base64")));
      }
    });
  });
};

module.exports = {
  getNewAccessToken,
  getNewRefreshToken,
  getHashedPassword,
  getNewPassword,
  getNewPasswordSalt,
};
