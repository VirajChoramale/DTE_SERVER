const writeQueries = {};

writeQueries.updateTable = (table_name, colms, identifier, identifierValue) => {
  const setClause = colms.map((col, index) => `${col} = ?`).join(", ");
    return `update ${table_name} set ${setClause} where ${identifier} = ${identifierValue} `;
};
writeQueries.insertTable=(tableName)=>{
  return `Insert into ${tableName} set ?`
}
export { writeQueries };

