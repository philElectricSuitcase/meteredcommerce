const mysql = require("mysql");

function getRecordsQuery(paramObject, requestQuery) {
  let sql = { records: ``, count: `` };
  sql.records = `SELECT * FROM ${paramObject}`;
  sql.count = `SELECT COUNT(id) AS total FROM ${paramObject}`;

  if (requestQuery.filter !== undefined) {
    const queryFilter = JSON.parse(requestQuery.filter);
    const filterCount = Object.keys(queryFilter).length;
    if (filterCount > 0) {
      const filterFinalRow = filterCount - 1;
      sql.records = sql.records + ` WHERE `;
      sql.count = sql.count + ` WHERE `;
      for (let i = 0; i < filterCount; i++) {
        const currentKey = Object.keys(queryFilter)[i];
        const currentValue = Object.values(queryFilter)[i];
        let stringValue = "'" + currentValue + "'";

        if (Array.isArray(currentValue))
          stringValue = "'" + currentValue.join("','") + "'";
        let filterString = `${currentKey} IN (${stringValue})`;
        if (
          currentKey === "name" ||
          currentKey === "policyNumber" ||
          paramObject === "SearchResults" ||
          currentKey === "Value"
        ) {
          stringValue = "'%" + currentValue + "%'";
          filterString = `${currentKey} LIKE ${stringValue}`;
        } else if (currentKey === "id__neq") {
          filterString = "id != " + stringValue;
        }
        if (i < filterFinalRow) filterString = filterString + ` AND `;
        sql.records = sql.records + filterString;
        sql.count = sql.count + filterString;
      }
    }
  }

  if (requestQuery.sort !== undefined) {
    const querySort = JSON.parse(requestQuery.sort);
    const querySortField = querySort[0];
    const querySortDirection = querySort[1];
    sql.records =
      sql.records + ` ORDER BY ${querySortField} ${querySortDirection}`;
  }

  let range = [0, 2000];
  if (requestQuery.range !== undefined) range = JSON.parse(requestQuery.range);

  const offsetString = `OFFSET ${Number(range[0])}`;
  const limitString = `LIMIT ${Number(range[1])}`;

  sql.records = sql.records + ` ${limitString} ${offsetString}`;

  return sql;
}

function getRecordQuery(paramObject, paramId) {
  let sql = `SELECT * FROM ${paramObject} WHERE id = ${paramId}`;
  return sql;
}

module.exports = {
  getRecordsQuery,
  getRecordQuery,
};
