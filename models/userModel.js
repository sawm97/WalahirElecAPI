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

async function createUser(username, email, passwordHash, role,) {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('passwordHash', sql.VarChar, passwordHash)
            .input('role', sql.VarChar, role)
            .query('INSERT INTO Users (username, email, password_hash, role) VALUES (@username, @email, @passwordHash, @role)');
        return result;
    } catch (err) {
        throw new Error('Error creating user: ' + err);
    }
}

module.exports = { getAllUsers, createUser };
