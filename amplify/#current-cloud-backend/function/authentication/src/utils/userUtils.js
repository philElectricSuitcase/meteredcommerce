const Database = require("./../services/database");
const cryptoUtils = require("./cryptoUtils");

const getUserIdFromEmail = async (email) => {
  return new Promise((resolve, reject) => {
    // Try and fetch the user with the provided email
    let databaseInstance = new Database();
    databaseInstance
      .connect()
      .then(() => databaseInstance.getUserWithEmail(email))
      .then((user) => databaseInstance.closeConnection(user))
      .then((user) => {
        resolve({
          success: true,
          userId: user.id,
        });
      })
      .catch((err) => {
        console.error(
          "Failed to find user against email '" + email + "'. Error: ",
          err
        );

        databaseInstance
          .closeConnection()
          .then(() => {
            console.log(
              "Database connection has been closed successfully after error"
            );
            resolve({
              success: false,
              userId: null,
            });
          })
          .catch((error) => {
            console.error(
              "Failed to close database connection following error: " + error
            );
            resolve({
              success: false,
              userId: null,
            });
          });
      });
  });
};

const getUserIdFromCredentials = async (email, plaintext_password) => {
  return new Promise((resolve, reject) => {
    // Try and fetch the user with the provided email
    let databaseInstance = new Database();
    databaseInstance
      .connect()
      .then(() => databaseInstance.getUserWithEmail(email))
      .then((user) => databaseInstance.closeConnection(user))
      .then((user) => {
        // Check whether the user's stored hashed password matches the hash of the password provided
        cryptoUtils
          .getHashedPassword(plaintext_password, user.hashed_password_salt)
          .then((providedHashPassword) => {
            console.error("Stored:   " + user.hashed_password);
            console.error("Provided: " + providedHashPassword);

            if (user.hashed_password === providedHashPassword) {
              resolve({
                success: true,
                userId: user.id,
              });
            } else {
              resolve({
                success: false,
                userId: null,
              });
            }
          })
          .catch(() => {
            console.error(
              "Failed to hash provided plaintext password to compare against user's stored password"
            );
            resolve({
              success: false,
              userId: null,
            });
          });
      })
      .catch((err) => {
        console.error(
          "Failed to find user against email '" +
            email +
            "' and given password. Error: ",
          err
        );

        databaseInstance
          .closeConnection()
          .then(() => {
            console.log(
              "Database connection has been closed successfully after error"
            );
            resolve({
              success: false,
              userId: null,
            });
          })
          .catch((error) => {
            console.error(
              "Failed to close database connection following error: " + error
            );
            resolve({
              success: false,
              userId: null,
            });
          });
      });
  });
};

const setUserHashedPasswordAndSalt = async (
  userId,
  hashed_password,
  hashed_password_salt
) => {
  return new Promise((resolve, reject) => {
    // Try and update the user's hashed password and salt
    let databaseInstance = new Database();
    databaseInstance
      .connect()
      .then(() =>
        databaseInstance.updateUserHashedPasswordAndSalt(
          userId,
          hashed_password,
          hashed_password_salt
        )
      )
      .then((user) => databaseInstance.closeConnection(user))
      .then((user) => {
        resolve();
      })
      .catch((err) => {
        console.error(
          "Failed to update the password for user " + userId + ": ",
          err
        );

        databaseInstance
          .closeConnection()
          .then(() => {
            console.log(
              "Database connection has been closed successfully after error"
            );
            reject();
          })
          .catch((error) => {
            console.error(
              "Failed to close database connection following error: " + error
            );
            reject();
          });
      });
  });
};

module.exports = {
  getUserIdFromEmail,
  getUserIdFromCredentials,
  setUserHashedPasswordAndSalt,
};
