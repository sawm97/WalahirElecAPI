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

// CREATE USER
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

// UPDATE USER REFRESH TOKEN
async function updateUserRefreshToken(userId, refreshToken) {
    try {
        const pool = await connectDB();

        // Jika refreshToken = null, berarti user logout → Hapus refreshToken
        await pool.request()
            .input("userId", sql.Int, userId)
            .input("refreshToken", sql.NVarChar, refreshToken) // Bisa null saat logout
            .query(`
                UPDATE users 
                SET refresh_token = @refreshToken 
                WHERE id = @userId
            `);

        return { success: true, message: "Refresh token updated successfully" };
    } catch (error) {
        console.error("Error updating refresh token:", error);
        return { success: false, message: "Database error" };
    }
}

module.exports = { getAllUsers, createUser, getUserByIdentifier };
