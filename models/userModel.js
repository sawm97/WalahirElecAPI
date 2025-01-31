const { connectDB, sql } = require('../config/databaseConfig');

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

async function getUserByEmail(email) {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM users WHERE email = @email');
        return result.recordset[0]; // Mengembalikan user pertama yang ditemukan
    } catch (err) {
        throw new Error('Error fetching user: ' + err);
    }
}


module.exports = { getAllUsers, createUser, getUserByEmail };
