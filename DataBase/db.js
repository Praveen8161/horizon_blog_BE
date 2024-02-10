import mysql from "mysql2";
import dotenv from "dotenv";

// Config DOTENV
dotenv.config();

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Rko@965945",
//   database: "horizon",
// });

// const db = mysql.createConnection({
//   host: process.env.HOST,
//   port: "3306",
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
// });

const db = mysql.createConnection({
  host: process.env.FHOST,
  port: "3306",
  user: process.env.FUSER,
  password: process.env.FPASSWORD,
  database: process.env.FDATABASE,
});

export default db;
