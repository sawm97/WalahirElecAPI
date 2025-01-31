const { connectDB, sql } = require('../config/databaseConfig');

// GET ALL USERS
async function getAllUsers() {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .query('SELECT * FROM Users');
        return result.recordset;
    } catch (err) {
        throw new Error('Error fetching Users: ' + err);
    }
}


// GET USER BY IDENTIFIER (USERNAME/EMAIL)
async function getUserByIdentifier(identifier) {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('identifier', sql.VarChar, identifier)
            .query('SELECT id, username, email, password_hash, role FROM users WHERE email = @identifier OR username = @identifier');
        return result.recordset[0]; // Mengembalikan user pertama yang ditemukan
    } catch (err) {
        throw new Error('Error fetching user: ' + err);
    }
}


module.exports = { 
    getAllUsers, 
    getUserByIdentifier
};
