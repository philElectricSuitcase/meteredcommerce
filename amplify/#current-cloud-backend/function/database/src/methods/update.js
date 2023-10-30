const mysql = require("mysql");

function updateRecordQuery(paramObject, paramId) {
  let sql = `UPDATE ${paramObject} SET ? WHERE id = ${paramId}`;
  return sql;
}

function updateRecordsQuery(paramObject, paramIds) {
  let sql = `UPDATE ${paramObject} SET ? WHERE id IN ${paramIds}`;
  return sql;
}

module.exports = {
  updateRecordQuery,
  updateRecordsQuery,
};
