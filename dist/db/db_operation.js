//This is utility middleware which provide separate connection for read and write queries in mysql database don't modify this code if not neccessary.
//primary_coonection is used for read operation while replica connection will used for write operation.

import { primary_connection, replica_connection } from "./db_connection.mjs";
const executeReadQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    primary_connection.acquire().then(conn => {
      conn.query(query, params, (err, res) => {
        primary_connection.release(conn);
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }).catch(err => reject(err));
  });
};
const executeWriteQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    replica_connection.acquire().then(conn => {
      conn.query(query, params, (err, res) => {
        replica_connection.release(conn);
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    }).catch(err => reject(err));
  });
};
export { executeReadQuery, executeWriteQuery };