const mysql = require("mysql");

function deleteRecordsQuery(paramObject, paramFilter) {
  const recordIds = JSON.parse(paramFilter);
  let sql = "DELETE FROM ?? WHERE ?? IN (?)";
  let deletes = [paramObject, "id", recordIds];
  sql = mysql.format(sql, deletes);
  return sql;
}

function deleteRecordQuery(paramObject, paramId) {
  let sql = `DELETE FROM ${paramObject} WHERE id = ${paramId}`;
  return sql;
}

module.exports = {
  deleteRecordsQuery,
  deleteRecordQuery,
};
