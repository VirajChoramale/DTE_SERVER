import { executeReadQuery,executeWriteQuery} from "../db/db_operation.mjs";

const update_table=async(tabel_name,key_col,key_col_val,columns,values)=>{
      const set_col=columns.map(col=>`${col}=?`).join(",");
      const query=`update ${tabel_name} set ${set_col} where ${key_col} =?`;
      const val = [...values, key_col_val];
      const resp= await executeWriteQuery(query,val);
      return resp



}
const select_from_table=async(tableName,select_col,where_colm,key)=>{
    const where_col=where_colm.map(col=>`${col}=?`).join("AND");
    const sel_cols = select_col.map(col => `${col} = ?`).join(' , ');
    const query = `SELECT ${sel_cols} FROM ${tableName} WHERE ${where_col} ?`;
    const [rows] = await executeReadQuery(query, key);
    return rows

}
export {
        update_table,
        select_from_table
}