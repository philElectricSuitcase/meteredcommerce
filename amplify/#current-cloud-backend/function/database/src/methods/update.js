const mysql = require("mysql");

function updateRecordQuery(paramObject, paramId) {
  let sql = `UPDATE ${paramObject} SET ? WHERE id = ${paramId}`;
  return sql;
}

module.exports = {
  updateRecordQuery,
};
