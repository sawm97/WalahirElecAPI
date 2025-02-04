const { connectDB, sql } = require('../config/databaseConfig');

async function upsertUserDetail(userId, address, phoneNumber, birthDate) {
    try {
        let pool = await connectDB();

        // Cek apakah user_detail sudah ada
        let checkResult = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT COUNT(*) AS count FROM Users_Detail WHERE user_id = @userId');

        const userExists = checkResult.recordset[0].count > 0;

        if (userExists) {
            // Jika sudah ada, update data
            let result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('address', sql.VarChar, address)
                .input('phoneNumber', sql.VarChar, phoneNumber)
                .input('birthDate', sql.DateTime, birthDate)
                .query(`
                    UPDATE Users_Detail 
                    SET address = @address, phone_number = @phoneNumber, birth_date = @birthDate 
                    WHERE user_id = @userId
                `);
            return { 
                success: true, message: 'Profil berhasil diperbarui' };
        } else {
            // Jika belum ada, insert data baru
            let result = await pool.request()
                .input('userId', sql.Int, userId)
                .input('address', sql.VarChar, address)
                .input('phoneNumber', sql.VarChar, phoneNumber)
                .input('birthDate', sql.DateTime, birthDate)
                .query(`
                    INSERT INTO Users_Detail (user_id, address, phone_number, birth_date) 
                    VALUES (@userId, @address, @phoneNumber, @birthDate)
                `);
            return { success: true, message: 'Profil berhasil ditambahkan' };
        }
    } catch (err) {
        console.error('Error updating user detail:', err);
        return { success: false, error: 'Gagal memperbarui data profil' };
    }
}

module.exports = { upsertUserDetail };
