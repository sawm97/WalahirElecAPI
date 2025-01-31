const { connectDB, sql } = require('../config/databaseConfig');

// STORE USER REFRESH TOKEN
async function storeRefreshToken(userId, refreshToken) {
    try {
        const pool = await connectDB();
        await pool.request()
            .input("userId", sql.Int, userId)
            .input("refreshToken", sql.NVarChar, refreshToken)
            .query(`
                INSERT INTO users_token (user_id, refresh_token) 
                VALUES (@userId, @refreshToken)
            `);
    } catch (error) {
        console.error("Error storing refresh token:", error);
    }
}

// REMOVE USER REFRESH TOKEN
async function removeRefreshToken(refreshToken) {
    try {
        const pool = await connectDB();
        await pool.request()
            .input("refreshToken", sql.NVarChar, refreshToken)
            .query(`
                DELETE FROM users_token WHERE refresh_token = @refreshToken
            `);
    } catch (error) {
        console.error("Error removing refresh token:", error);
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

// REFRESH ACCESS TOKEN
async function findUserByRefreshToken(refreshToken) {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input("refreshToken", sql.NVarChar, refreshToken)
            .query(`
                SELECT users.id, users.role 
                FROM users 
                INNER JOIN users_token ON users.id = users_token.user_id
                WHERE users_token.refresh_token = @refreshToken
            `);
        
        return result.recordset.length ? result.recordset[0] : null;
    } catch (error) {
        console.error("Error finding user by refresh token:", error);
        return null;
    }
}


module.exports = { 
    storeRefreshToken,
    removeRefreshToken,
    updateUserRefreshToken,
    findUserByRefreshToken
};
