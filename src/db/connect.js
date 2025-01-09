import mysql from "mysql2/promise.js";

export const poolDB = async (url) => {
  return mysql.createPool({
    database: process.env.DB_NAME,
    host: url,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
};

/**
 * @type {mysql.Pool}
 */
let pool = null;
export const poolHostDB = async () => {
  if (!pool) pool = await poolDB(process.env.DB_HOST);
  return pool;
};

export const testConnectionDB = async () => {
  const pool = await poolHostDB();

  try {
    await pool.ping();
    return true;
  } catch (error) {
    return false;
  }
};
