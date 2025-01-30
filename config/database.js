const sql = require("mssql");
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 1433,
    options: {
        encrypt: true,
        enableArithAbort: true,
    }
};

async function connectDB() {
    try {
        let pool = await sql.connect(config);
        console.log('✅ Connected to Azure SQL Database');
        return pool;
    } catch (err) {
        console.error('❌ Database connection failed: ', err);
        throw err;
    }
}

module.exports = { connectDB, sql };