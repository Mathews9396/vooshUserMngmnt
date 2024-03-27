// const { Client } = require("pg");

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// client.connect();

// client.query("SELECT table_schema,table_name FROM information_schema.tables;", (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

module.exports = {
  development: {
    username: process.env.DB_USER || process.env.TEMPLATEAPP_DATABASE_USER,
    password: process.env.DB_PASSWORD || process.env.TEMPLATEAPP_DATABASE_PASSWORD,
    database: process.env.DB_NAME || process.env.TEMPLATEAPP_DATABASE,
    host: process.env.DB_HOST || process.env.TEMPLATE_DATABASE_HOSTNAME,
    dialect: "postgres",
    logging: (msg) => logger.debug(msg),
  },
  staging: {
    username: process.env.DB_USER || process.env.TEMPLATEAPP_DATABASE_USER,
    password: process.env.DB_PASSWORD || process.env.TEMPLATEAPP_DATABASE_PASSWORD,
    database: process.env.DB_NAME || process.env.TEMPLATEAPP_DATABASE,
    host: process.env.DB_HOST || process.env.TEMPLATE_DATABASE_HOSTNAME,
    dialect: "postgres",
    logging: (msg) => logger.debug(msg),
  },
};
