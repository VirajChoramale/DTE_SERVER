const writeQueries = {};
writeQueries.updateTable = (table_name, colms, identifier, identifierValue) => {
  const setClause = colms.map((col, index) => `${col} = ?`).join(", ");
  return `update ${table_name} set ${setClause} where ${identifier} = ${identifierValue} `;
};
writeQueries.updatebyMultiColumn = (tableName, colms, identifier, identifierValue) => {
  const setClause = colms.map(col => `${col} = ?`).join(", ");
  const whereClause = identifier.map((col, index) => `${col} = ${identifierValue[index]}`).join(` AND  `);
  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
  return query;
};
writeQueries.insertTable = tableName => {
  return `Insert into ${tableName} set ?`;
};
export { writeQueries };