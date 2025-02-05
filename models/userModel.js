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

module.exports = { 
    getAllUsers, 
    getUserByUnameEmail,
    createUser,
    getUserById
};
