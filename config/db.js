const db = require("knex")({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    }
  });
  
module.exports = db;
  