const Database = require("./services/database");
const { getRecordsQuery, getRecordQuery } = require("./methods/get");
const { insertRecordQuery } = require("./methods/create");
const { updateRecordQuery } = require("./methods/update");
const { deleteRecordQuery, deleteRecordsQuery } = require("./methods/delete");

const { DB_HOST, DB_USER, DB_PWD, DB_PORT, DB_NAME } = process.env;

//DATABASE CONNECTION CONFIG
const DATABASE_CONFIG = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PWD,
  port: DB_PORT,
  database: DB_NAME,
};

function routes(app) {
  //Get multiple records
  app.get("/:table", async (req, res) => {
    return new Promise((resolve, reject) => {
      const databaseInstance = new Database(DATABASE_CONFIG);
      let data = [];
      let sqlQuery = {};
      databaseInstance
        .connect()
        .then(() => getRecordsQuery(req.params.table, req.query))
        .then((sql) => (sqlQuery = sql))
        .then(() => databaseInstance.queryRecords(sqlQuery.records))
        .then((resultsData) => (data = resultsData))
        .then(() => databaseInstance.countRecords(sqlQuery.count))
        .then((countData) =>
          res.status(200).json({ data: data, total: countData })
        )
        .then(() => databaseInstance.closeConnection())
        .then(() => {
          resolve({
            statusCode: 200,
            message: "Successful operation",
            error: "",
          });
        })
        .catch((err) => {
          console.error("Had an operational error: ", err);
          res.status(500).json(err);
          databaseInstance
            .closeConnection()
            .then(() => {
              console.log(
                "Database connection has been closed successfully after error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error: "Had an operational error: " + err,
              });
            })
            .catch((error) => {
              console.error(
                "Failed to close database connection following error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error:
                  "Had an operational error: " +
                  err +
                  "\n\nAlso failed to close database following operational error:" +
                  error,
              });
            });
        });
    });
  });

  //Get single record
  app.get("/:table/:id", async (req, res) => {
    return new Promise((resolve, reject) => {
      const databaseInstance = new Database(DATABASE_CONFIG);
      databaseInstance
        .connect()
        .then(() => getRecordQuery(req.params.table, req.params.id))
        .then((value) => databaseInstance.queryRecords(value))
        .then((value) => res.status(200).json(value))
        .then(() => databaseInstance.closeConnection())
        .then(() => {
          resolve({
            statusCode: 200,
            message: "Successful operation",
            error: "",
          });
        })
        .catch((err) => {
          console.error("Had an operational error: ", err);
          res.status(500).json(err);
          databaseInstance
            .closeConnection()
            .then(() => {
              console.log(
                "Database connection has been closed successfully after error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error: "Had an operational error: " + err,
              });
            })
            .catch((error) => {
              console.error(
                "Failed to close database connection following error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error:
                  "Had an operational error: " +
                  err +
                  "\n\nAlso failed to close database following operational error:" +
                  error,
              });
            });
        });
    });
  });

  //Create record
  app.post("/:table", async (req, res) => {
    return new Promise((resolve, reject) => {
      const databaseInstance = new Database(DATABASE_CONFIG);
      databaseInstance
        .connect()
        .then(() => insertRecordQuery(req.params.table))
        .then((value) => databaseInstance.insertRecord(value, req.body))
        .then((value) => res.status(200).json(value))
        .then(() => databaseInstance.closeConnection())
        .then(() => {
          resolve({
            statusCode: 200,
            message: "Successful operation",
            error: "",
          });
        })
        .catch((err) => {
          console.error("Had an operational error: ", err);
          res.status(500).json(err);
          databaseInstance
            .closeConnection()
            .then(() => {
              console.log(
                "Database connection has been closed successfully after error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error: "Had an operational error: " + err,
              });
            })
            .catch((error) => {
              console.error(
                "Failed to close database connection following error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error:
                  "Had an operational error: " +
                  err +
                  "\n\nAlso failed to close database following operational error:" +
                  error,
              });
            });
        });
    });
  });

  //Update multiple records - to be updated
  app.put("/:table", async (req, res) => {
    //TO BE UPDATED - CURRENTLY GET ALL
    let sql = `SELECT * FROM ${req.params.table}`;
    return new Promise((resolve, reject) => {
      const databaseInstance = new Database(DATABASE_CONFIG);
      databaseInstance
        .connect()
        .then(() => databaseInstance.queryRecords(sql))
        .then((value) => res.status(200).json(value))
        .then(() => databaseInstance.closeConnection())
        .then(() => {
          resolve({
            statusCode: 200,
            message: "Successful operation",
            error: "",
          });
        })
        .catch((err) => {
          console.error("Had an operational error: ", err);
          res.status(500).json(err);
          databaseInstance
            .closeConnection()
            .then(() => {
              console.log(
                "Database connection has been closed successfully after error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error: "Had an operational error: " + err,
              });
            })
            .catch((error) => {
              console.error(
                "Failed to close database connection following error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error:
                  "Had an operational error: " +
                  err +
                  "\n\nAlso failed to close database following operational error:" +
                  error,
              });
            });
        });
    });
  });

  //Update single record
  app.put("/:table/:id", async (req, res) => {
    return new Promise((resolve, reject) => {
      const databaseInstance = new Database(DATABASE_CONFIG);
      databaseInstance
        .connect()
        .then(() => updateRecordQuery(req.params.table, req.params.id))
        .then((value) => databaseInstance.updateRecord(value, req.body))
        .then((value) => res.status(200).json(value))
        .then(() => databaseInstance.closeConnection())
        .then(() => {
          resolve({
            statusCode: 200,
            message: "Successful operation",
            error: "",
          });
        })
        .catch((err) => {
          console.error("Had an operational error: ", err);
          res.status(500).json(err);
          databaseInstance
            .closeConnection()
            .then(() => {
              console.log(
                "Database connection has been closed successfully after error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error: "Had an operational error: " + err,
              });
            })
            .catch((error) => {
              console.error(
                "Failed to close database connection following error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error:
                  "Had an operational error: " +
                  err +
                  "\n\nAlso failed to close database following operational error:" +
                  error,
              });
            });
        });
    });
  });

  //Delete multiple records
  app.delete("/:table", async (req, res) => {
    return new Promise((resolve, reject) => {
      const databaseInstance = new Database(DATABASE_CONFIG);
      databaseInstance
        .connect()
        .then(() => deleteRecordsQuery(req.params.table, req.query.filter))
        .then((value) => databaseInstance.deleteRecords(value))
        .then((value) => res.status(200).json(value))
        .then(() => databaseInstance.closeConnection())
        .then(() => {
          resolve({
            statusCode: 200,
            message: "Successful operation",
            error: "",
          });
        })
        .catch((err) => {
          console.error("Had an operational error: ", err);
          res.status(500).json(err);
          databaseInstance
            .closeConnection()
            .then(() => {
              console.log(
                "Database connection has been closed successfully after error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error: "Had an operational error: " + err,
              });
            })
            .catch((error) => {
              console.error(
                "Failed to close database connection following error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error:
                  "Had an operational error: " +
                  err +
                  "\n\nAlso failed to close database following operational error:" +
                  error,
              });
            });
        });
    });
  });

  //Delete single record
  app.delete("/:table/:id", async (req, res) => {
    return new Promise((resolve, reject) => {
      const databaseInstance = new Database(DATABASE_CONFIG);
      databaseInstance
        .connect()
        .then(() => deleteRecordQuery(req.params.table, req.params.id))
        .then((value) => databaseInstance.deleteRecord(value))
        .then((value) => res.status(200).json(value))
        .then(() => databaseInstance.closeConnection())
        .then(() => {
          resolve({
            statusCode: 200,
            message: "Successful operation",
            error: "",
          });
        })
        .catch((err) => {
          console.error("Had an operational error: ", err);
          res.status(500).json(err);
          databaseInstance
            .closeConnection()
            .then(() => {
              console.log(
                "Database connection has been closed successfully after error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error: "Had an operational error: " + err,
              });
            })
            .catch((error) => {
              console.error(
                "Failed to close database connection following error"
              );
              resolve({
                statusCode: 500,
                message: "",
                error:
                  "Had an operational error: " +
                  err +
                  "\n\nAlso failed to close database following operational error:" +
                  error,
              });
            });
        });
    });
  });
}
module.exports = routes;
