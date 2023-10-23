const mysql = require("mysql");

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
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

  queryRecords(sql) {
    return new Promise((resolve, reject) => {
      console.log("sql:" + sql);
      this.connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("Retrieved records: " + results);
          resolve(results);
        }
      });
    });
  }

  countRecords(sql) {
    return new Promise((resolve, reject) => {
      console.log("sql:" + sql);
      this.connection.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("Retrieved count: " + results[0].total);
          resolve(results[0].total);
        }
      });
    });
  }

  insertRecord(insertQuery, newRecord) {
    return new Promise((resolve, reject) => {
      if (newRecord === null) resolve();

      if (newRecord.length === 0) resolve();

      console.log("Insert query: " + insertQuery);

      this.connection.query(insertQuery, newRecord, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("Records updated:", result);
          resolve(result);
        }
      });
    });
  }

  updateRecord(updateQuery, newRecordValues) {
    return new Promise((resolve, reject) => {
      if (newRecordValues === null) resolve();

      if (newRecordValues.length === 0) resolve();

      console.log("Update query: " + updateQuery);
      console.log("New Values: " + newRecordValues);

      this.connection.query(updateQuery, newRecordValues, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("Records updated:", result.affectedRows);
          resolve(result);
        }
      });
    });
  }

  updateRecords(newRecordValues) {
    return new Promise((resolve, reject) => {
      if (newRecordValues === null) resolve();

      if (newRecordValues.length === 0) resolve();

      let updateQuery = "UPDATE webform_10dayfree SET processed = CASE id ";
      for (let i = 0; i < newRecordValues.length; i++)
        updateQuery +=
          "WHEN " +
          newRecordValues[i].id +
          " THEN " +
          newRecordValues[i].newValue +
          " ";
      updateQuery += "END WHERE id IN (";

      updateQuery += newRecordValues[0].id;
      for (let i = 1; i < newRecordValues.length; i++)
        updateQuery += ", " + newRecordValues[i].id;
      updateQuery += ")";

      console.log("Update query: " + updateQuery);

      this.connection.query(updateQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("Records updated:", result.affectedRows);
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
