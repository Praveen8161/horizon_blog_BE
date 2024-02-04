import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rko@965945",
  database: "horizon",
});

export default db;
