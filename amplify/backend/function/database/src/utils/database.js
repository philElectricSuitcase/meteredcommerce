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
          console.log(`[Database] connect: Connected to database`);
          resolve();
        }
      });
    });
  }

  queryRecords(sql) {
    return new Promise((resolve, reject) => {
      console.log(`[Database] queryRecords: sql = ${sql}`);
      this.connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `[Database] queryRecords: results = ${JSON.stringify(results)}`
          );
          resolve(results);
        }
      });
    });
  }

  countRecords(sql) {
    return new Promise((resolve, reject) => {
      console.log(`[Database] countRecords: sql = ${sql}`);
      this.connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log(`[Database] countRecords: results = ${results[0].total}`);
          resolve(results[0].total);
        }
      });
    });
  }

  insertRecord(insertQuery, newRecord) {
    return new Promise((resolve, reject) => {
      if (newRecord === null) resolve();

      if (newRecord.length === 0) resolve();

      console.log(`[Database] insertRecord: sql = ${sql}`);

      this.connection.query(insertQuery, newRecord, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `[Database] insertRecord: result = ${JSON.stringify(result)}`
          );
          resolve(result);
        }
      });
    });
  }

  updateRecord(updateQuery, newRecordValues) {
    return new Promise((resolve, reject) => {
      if (newRecordValues === null) resolve();

      if (newRecordValues.length === 0) resolve();

      console.log(`[Database] updateRecord: updateQuery = ${updateQuery}`);
      console.log(
        `[Database] updateRecord: newRecordValues = ${JSON.stringify(
          newRecordValues
        )}`
      );

      this.connection.query(updateQuery, newRecordValues, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `[Database] updateRecord: result = ${JSON.stringify(result)}`
          );
          resolve(result);
        }
      });
    });
  }

  updateRecords(updateQuery, newRecordValues) {
    return new Promise((resolve, reject) => {
      if (newRecordValues === null) resolve();

      if (newRecordValues.length === 0) resolve();

      console.log(`[Database] updateRecords: updateQuery = ${updateQuery}`);
      console.log(
        `[Database] updateRecords: newRecordValues = ${JSON.stringify(
          newRecordValues
        )}`
      );

      this.connection.query(updateQuery, newRecordValues, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `[Database] updateRecords: result = ${JSON.stringify(result)}`
          );
          resolve();
        }
      });
    });
  }

  deleteRecords(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          console.log("Deleted records: " + results);
          resolve(fields);
        }
      });
    });
  }

  deleteRecord(sql) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("Deleted record: " + results);
          resolve(results);
        }
      });
    });
  }

  closeConnection() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          reject(err);
        } else {
          console.log("Connection closed");
          resolve();
        }
      });
    });
  }
}

module.exports = Database;
