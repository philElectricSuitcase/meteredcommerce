const mysql = require("mysql");

function insertRecordQuery(paramObject) {
  let sql = `INSERT INTO ${paramObject} SET ?`;
  return sql;
}

module.exports = {
  insertRecordQuery,
};
