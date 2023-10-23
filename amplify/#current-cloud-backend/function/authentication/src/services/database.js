const mysql = require("mysql");

const { DB_HOST, DB_USER, DB_PWD, DB_PORT, DB_NAME } = process.env;

const DATABASE_CONFIG = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PWD,
  port: DB_PORT,
  database: DB_NAME,
};

class Database {
  constructor() {
    this.connection = mysql.createConnection(DATABASE_CONFIG);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Connected to database");
          resolve();
        }
      });
    });
  }

  closeConnection(passable) {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          console.error("Failed to close database connection: " + err);
          reject(err);
        } else {
          console.log("Connection closed");
          resolve(passable);
        }
      });
    });
  }

  //
  // User
  //

  getUserDetails(userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT id FROM user WHERE (id = ?) LIMIT 1",
        [userId],
        (err, results) => {
          if (err) {
            console.error("Failed to fetch user: " + err);
            reject();
          } else {
            if (results.length == 1) {
              resolve(results[0]);
            } else {
              reject();
            }
          }
        }
      );
    });
  }

  getUserWithEmail(email) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT id, hashed_password, hashed_password_salt FROM user WHERE (email = ?) LIMIT 1",
        [email],
        (err, results) => {
          if (err) {
            console.error("Failed to fetch user: " + err);
            reject();
          } else {
            if (results.length == 1) {
              resolve(results[0]);
            } else {
              reject();
            }
          }
        }
      );
    });
  }

  updateUserHashedPasswordAndSalt(
    userId,
    hashed_password,
    hashed_password_salt
  ) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE user SET hashed_password = ?, hashed_password_salt = ? WHERE (id = ?) LIMIT 1",
        [hashed_password, hashed_password_salt, userId],
        (err, results) => {
          if (err) {
            console.error(
              "Failed to update user hashed password and salt: " + err
            );
            reject();
          } else {
            if (results.affectedRows == 1) {
              resolve();
            } else {
              console.error(
                "Attempt to update user hashed password and salt failed, " +
                  results.affectedRows +
                  " rows updated"
              );
              reject();
            }
          }
        }
      );
    });
  }

  //
  // User Session
  //

  getSession(session_id) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM user_session WHERE (id = ?) LIMIT 1",
        [session_id],
        (err, results) => {
          if (err) {
            console.error("Failed to fetch session: " + err);
            reject();
          } else {
            if (results.length == 1) {
              resolve(results[0]);
            } else {
              reject();
            }
          }
        }
      );
    });
  }

  insertSession(sessionRecord) {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO user_session 
						 (user_id, access_token, refresh_token, access_token_created_at, access_token_expires_at, refresh_token_created_at, refresh_token_expires_at, session_created_date, session_expires_at, session_last_accessed, source_ip_address) 
						 VALUES ?`;

      let sessionValues = [
        [
          sessionRecord.user_id,
          sessionRecord.access_token,
          sessionRecord.refresh_token,
          sessionRecord.access_token_created_at,
          sessionRecord.access_token_expires_at,
          sessionRecord.refresh_token_created_at,
          sessionRecord.refresh_token_expires_at,
          sessionRecord.session_created_date,
          sessionRecord.session_expires_at,
          sessionRecord.session_last_accessed,
          sessionRecord.source_ip_address,
        ],
      ];

      this.connection.query(query, [sessionValues], (err, result) => {
        if (err) {
          console.error("Failed to insert new session into database: " + err);
          reject(err);
        } else {
          console.log("Have inserted new session into database");
          resolve(result.insertId);
        }
      });
    });
  }

  updateSessionLastAccessed(sessionId, lastAccessedDateString) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE user_session SET session_last_accessed = ? WHERE (id = ?) LIMIT 1",
        [lastAccessedDateString, sessionId],
        (err, results) => {
          if (err) {
            console.error("Failed to update session last accessed: " + err);
            reject();
          } else {
            if (results.affectedRows == 1) {
              resolve();
            } else {
              console.error(
                "Attempt to update session last accessed time failed, " +
                  results.affectedRows +
                  " rows updated"
              );
              reject();
            }
          }
        }
      );
    });
  }

  updateSessionTokens(
    sessionId,
    accessToken,
    refreshToken,
    accessTokenCreatedDateString,
    accessTokenExpiredAtString,
    refreshTokenCreatedDateString,
    refreshTokenExpiredAtString,
    lastAccessedDateString
  ) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE user_session SET access_token = ?, refresh_token = ?, access_token_created_at = ?, access_token_expires_at = ?, refresh_token_created_at = ?, refresh_token_expires_at = ?, session_last_accessed = ? WHERE (id = ?) LIMIT 1",
        [
          accessToken,
          refreshToken,
          accessTokenCreatedDateString,
          accessTokenExpiredAtString,
          refreshTokenCreatedDateString,
          refreshTokenExpiredAtString,
          lastAccessedDateString,
          sessionId,
        ],
        (err, results) => {
          if (err) {
            console.error("Failed to update session tokens: " + err);
            reject();
          } else {
            if (results.affectedRows == 1) {
              resolve();
            } else {
              console.error(
                "Attempt to update session tokens failed, " +
                  results.affectedRows +
                  " rows updated"
              );
              reject();
            }
          }
        }
      );
    });
  }

  //
  // User Permissions
  //

  getUserPermissionEndpoints(userRole) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM user_permission_endpoint WHERE (user_role = ?)",
        [userRole],
        (err, results) => {
          if (err) {
            console.error("Failed to fetch user permission endpoints: " + err);
            reject();
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  getUserPermissionFields(userRole) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM user_permission_fields WHERE (user_role = ?)",
        [userRole],
        (err, results) => {
          if (err) {
            console.error("Failed to fetch user permission fields: " + err);
            reject();
          } else {
            resolve(results);
          }
        }
      );
    });
  }
}

module.exports = Database;
