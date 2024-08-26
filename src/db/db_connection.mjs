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
      database:
        process.env.MODE == "PROD" ? process.env.DB_PROD : process.env.DB_DEV,
      dateStrings: true,
      timezone: "+05:30",
    }),
  destroy: (conn) => conn.end(),

  idleTimeoutMillis: 60000,
});

const replica_connection = createPool({
  create: () =>
    mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database:
        process.env.MODE == "PROD" ? process.env.DB_PROD : process.env.DB_DEV,
      dateStrings: true,
      timezone: "+05:30",
    }),

  destroy: (conn) => conn.end(),

  idleTimeoutMillis: 60000,
});
const multiConn = createPool({
  create: () =>
    mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database:
        process.env.MODE == "PROD" ? process.env.DB_PROD : process.env.DB_DEV,
      dateStrings: true,
      timezone: "+05:30",
    }),

  destroy: (conn) => conn.end(),

  idleTimeoutMillis: 60000,
});
const replica_four = createPool({
  create: () =>
    mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database:
        process.env.MODE == "PROD" ? process.env.DB_PROD : process.env.DB_DEV,
      dateStrings: true,
      timezone: "+05:30",
    }),

  destroy: (conn) => conn.end(),

  idleTimeoutMillis: 60000,
});

export { primary_connection, replica_connection, multiConn, replica_four };
