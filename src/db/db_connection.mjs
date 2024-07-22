import mysql from "mysql2";
import { configDotenv } from "dotenv";
import { createPool } from "generic-pool";

configDotenv();

const primary_connection = createPool({
  create: () =>
    mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      dateStrings: true,
    }),
  destroy: (conn) => conn.end(),
  max: 10,
  min: 2,
  idleTimeoutMillis: 60000,
});

const replica_connection = createPool({
  create: () =>
    mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    }),
  destroy: (conn) => conn.end(),
  max: 5,
  min: 2,
  idleTimeoutMillis: 60000,
});

export { primary_connection, replica_connection };
