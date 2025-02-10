const { connectDB, sql } = require('../config/databaseConfig');

// CREATE USER
async function createUser(username, email, passwordHash, role) {
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


// GET USER BY USERNAME/EMAIL
async function getUserByUnameEmail(uname_email) {
    try {
        let pool = await connectDB();

        let result = await pool.request()
            .input('uname_email', sql.VarChar, uname_email)
            .query(`
                SELECT 
                    u.id, 
                    u.username, 
                    u.email,
                    u.password_hash, 
                    u.role, 
                    ud.address, 
                    ud.phone_number, 
                    ud.birth_date
                FROM Users u
                LEFT JOIN Users_Detail ud ON u.id = ud.user_id
                WHERE u.email = @uname_email OR u.username = @uname_email
            `);

        return result.recordset[0]; // Mengembalikan user pertama yang ditemukan
    } catch (err) {
        throw new Error('Error fetching user: ' + err);
    }
}

// GET USER BY IDENTIFIER
async function getUserById(id) {
    try {
        let pool = await connectDB();

        let result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    u.id, 
                    u.username, 
                    u.email,
                    u.password_hash, 
                    u.role, 
                    ud.address, 
                    ud.phone_number, 
                    ud.birth_date
                FROM Users u
                LEFT JOIN Users_Detail ud ON u.id = ud.user_id
                WHERE u.id = @id 
            `);

        return result.recordset[0]; // Mengembalikan user pertama yang ditemukan
    } catch (err) {
        throw new Error('Error fetching user: ' + err);
    }
}

// UPDATE USER (USERNAME & EMAIL)
async function updateUser(userId, username, email) {
    try {
        let pool = await connectDB();
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .query(`
                UPDATE Users 
                SET username = @username, email = @email
                WHERE id = @userId
            `);
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "Database error" };
    }
}

// GET USER PASSWORD HASH (Untuk Validasi)
async function getUserPasswordHash(userId) {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT password_hash FROM Users WHERE id = @userId`);
        
        return result.recordset.length ? result.recordset[0].password_hash : null;
    } catch (error) {
        console.error("Error fetching user password:", error);
        return null;
    }
}

// UPDATE PASSWORD
async function updateUserPassword(userId, newPasswordHash) {
    try {
        let pool = await connectDB();
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('passwordHash', sql.VarChar, newPasswordHash)
            .query(`
                UPDATE Users 
                SET password_hash = @passwordHash 
                WHERE id = @userId
            `);
        return { success: true };
    } catch (error) {
        console.error("Error updating password:", error);
        return { success: false, message: "Database error" };
    }
}

// SAVE USER IMAGE
async function saveUserImage(userId, imageUrl) {
    try {
        const pool = await connectDB();
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('imageUrl', sql.NVarChar, imageUrl)
            .input('uploadedAt', sql.DateTime, new Date())
            .query(`
                MERGE INTO Users_Image AS target
                USING (SELECT @userId AS user_id) AS source
                ON target.user_id = source.user_id
                WHEN MATCHED THEN
                    UPDATE SET image_url = @imageUrl, uploaded_at = @uploadedAt
                WHEN NOT MATCHED THEN
                    INSERT (user_id, image_url, uploaded_at)
                    VALUES (@userId, @imageUrl, @uploadedAt);
            `);
    } catch (error) {
        console.error('Error saving image URL to database:', error);
        throw error;
    }
}

// GET USER IMAGE
async function getUserImageById(userId) {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT image_url 
                FROM Users_Image 
                WHERE user_id = @userId
            `);

        return result.recordset.length ? result.recordset[0].image_url : null;
    } catch (error) {
        console.error("Error fetching user image:", error);
        throw error;
    }
}

// SAVE USER SAS TOKEN
async function storeUserSASToken(userId, sasToken, expiresAt) {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        await request
            .input('userId', sql.Int, userId)
            .input('sasToken', sql.NVarChar, sasToken)
            .input('expiresAt', sql.DateTime, expiresAt)
            .query(`
                DELETE FROM Users_SAS_Token WHERE user_id = @userId;
                INSERT INTO Users_SAS_Token (user_id, sas_token, expires_at)
                VALUES (@userId, @sasToken, @expiresAt);
            `);

        await transaction.commit();
    } catch (error) {
        console.error("Error storing SAS Token:", error);
        // Rollback transaksi jika terjadi error
        if (transaction._aborted !== true) {
            await transaction.rollback();
        }
        throw error;
    } finally {
        // Pastikan koneksi tertutup
        pool.close();
    }
}



module.exports = { 
    getAllUsers, 
    getUserByUnameEmail,
    createUser,
    getUserById,
    updateUser,
    getUserPasswordHash,
    updateUserPassword,
    saveUserImage,
    getUserImageById,
    storeUserSASToken
};
