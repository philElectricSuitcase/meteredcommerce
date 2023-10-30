const Database = require("./utils/database");
const { getRecordsQuery, getRecordQuery } = require("./methods/get");
const { insertRecordQuery } = require("./methods/create");
const { updateRecordQuery, updateRecordsQuery } = require("./methods/update");
const { deleteRecordQuery, deleteRecordsQuery } = require("./methods/delete");

function routes(app) {
  //Get multiple records
  app.get("/:table", async (req, res) => {
    const { table } = req.params;
    const { query } = req;

    console.log(
      `[Endpoints] getList: { table: ${table}, query: ${JSON.stringify(
        query
      )} }`
    );

    const database = new Database();

    let sql_query = {};
    let data = [];
    let count = 0;
    database
      .connect()
      .then(() => getRecordsQuery(table, query))
      .then((get_query) => (sql_query = get_query))
      .then(() => database.queryRecords(sql_query.records))
      .then((data_result) => (data = data_result))
      .then(() => database.countRecords(sql_query.count))
      .then((count_result) => (count = count_result))
      .then(() => database.closeConnection())
      .then(() => res.status(200).json({ data: data, total: count }))
      .catch((err) => {
        database.closeConnection();
        console.error(`[Endpoints] getList: err = ${JSON.stringify(err)}`);
        res.status(500).json(err);
      });
  });

  //Get single record
  app.get("/:table/:id", async (req, res) => {
    const { table, id } = req.params;

    console.log(`[Endpoints] getOne: { table: ${table}, id: ${id} }`);

    const database = new Database();

    let data = {};

    database
      .connect()
      .then(() => getRecordQuery(table, id))
      .then((get_query) => database.queryRecords(get_query))
      .then((data_result) => (data = data_result[0]))
      .then(() => database.closeConnection())
      .then(() => res.status(200).json({ data: data }))
      .catch((err) => {
        database.closeConnection();
        console.error(`[Endpoints] getOne: err = ${JSON.stringify(err)}`);
        res.status(500).json(err);
      });
  });

  //Create record
  app.post("/:table", async (req, res) => {
    const { table } = req.params;
    const { body } = req;

    console.log(
      `[Endpoints] create: { table: ${table}, body: ${JSON.stringify(body)} }`
    );

    const database = new Database();

    let data = body;

    database
      .connect()
      .then(() => insertRecordQuery(table))
      .then((insert_query) => database.insertRecord(insert_query, body))
      .then((data_result) => (data["id"] = data_result.insertId))
      .then(() => database.closeConnection())
      .then(() => res.status(200).json({ data: data }))
      .catch((err) => {
        database.closeConnection();
        console.error(`[Endpoints] create: err = ${JSON.stringify(err)}`);
        res.status(500).json(err);
      });
  });

  //Update multiple records - to be updated
  app.put("/:table", async (req, res) => {
    const { table } = req.params;
    const { ids, data } = req.body;

    console.log(
      `[Endpoints] updateMany: { table: ${table}, ids: ${JSON.stringify(
        ids
      )}, data: ${JSON.stringify(data)} }`
    );

    const database = new Database();

    database
      .connect()
      .then(() => updateRecordQuery(table, ids))
      .then((update_query) => database.updateRecords(update_query, data))
      .then(() => database.closeConnection())
      .then(() => res.status(200).json({ data: ids }))
      .catch((err) => {
        database.closeConnection();
        console.error(`[Endpoints] updateMany: err = ${JSON.stringify(err)}`);
        res.status(500).json(err);
      });
  });

  //Update single record
  app.put("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const { body } = req;

    console.log(
      `[Endpoints] update: {table: ${table}, id: ${id}, body: ${JSON.stringify(
        body
      )}}`
    );

    const database = new Database();

    let response;

    database
      .connect()
      .then(() => updateRecordQuery(table, id))
      .then((update_query) => database.updateRecord(update_query, body))
      .then(() => database.closeConnection())
      .then(() => res.status(200).json({ data: body }))
      .catch((err) => {
        database.closeConnection();
        console.error(`[Endpoints] update: err = ${JSON.stringify(err)}`);
        res.status(500).json(err);
      });
  });

  //Delete multiple records
  app.delete("/:table", async (req, res) => {
    const { table } = req.params;
    const { body } = req;

    console.log(
      `[Endpoints] deleteMany: {table: ${table}, body: ${JSON.stringify(body)}}`
    );

    const database = new Database();

    let data = body;

    database
      .connect()
      .then(() => deleteRecordsQuery(table, body))
      .then((delete_query) => database.deleteRecords(delete_query))
      .then(() => database.closeConnection())
      .then(() => res.status(200).json({ data: data }))
      .catch((err) => {
        database.closeConnection();
        console.error(`[Endpoints] deleteMany: err = ${JSON.stringify(err)}`);
        res.status(500).json(err);
      });
  });

  //Delete single record
  app.delete("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const { body } = req;

    console.log(
      `[Endpoints] delete: {table: ${table}, id: ${id}, body: ${JSON.stringify(
        body
      )}}`
    );

    const database = new Database();

    let data = body;

    database
      .connect()
      .then(() => deleteRecordQuery(table, id))
      .then((delete_query) => database.deleteRecord(delete_query))
      .then(() => databaseInstance.closeConnection())
      .then(() => res.status(200).json({ data: data }))
      .catch((err) => {
        database.closeConnection();
        console.error(`[Endpoints] delete: err = ${JSON.stringify(err)}`);
        res.status(500).json(err);
      });
  });
}

module.exports = routes;
