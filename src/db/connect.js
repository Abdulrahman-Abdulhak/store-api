import mysql from "mysql2/promise.js";

export const poolDB = async (url) => {
  return mysql.createPool({
    database: process.env.DB_NAME,
    host: url,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
};

export const poolHostDB = () => poolDB(process.env.DB_HOST);
