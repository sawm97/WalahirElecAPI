const { connectDB, sql } = require('../config/database');

async function getAllUsers() {
    try {
        let pool = await connectDB();
        let result = await pool.request().query('SELECT * FROM Users');
        return result.recordset;
    } catch (err) {
        throw new Error('Error fetching Users: ' + err);
    }
}

async function createUser(username, email, passwordHash) {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .query('INSERT INTO Users (username, email, password_hash) VALUES (@username, @email, @passwordHash)');
        return result;
    } catch (err) {
        throw new Error('Error creating user: ' + err);
    }
}

module.exports = { getAllUsers, createUser };
