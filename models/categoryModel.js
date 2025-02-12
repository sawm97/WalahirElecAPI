const { connectDB, sql } = require('../config/databaseConfig');

// GET ALL CATEGORIES
async function getAllCategories() {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Category');
    return result.recordset;
}

// GET CATEGORY BY ID
async function getCategoryById(id) {
    const pool = await connectDB();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Category WHERE id = @id');
    return result.recordset[0];
}

// CREATE CATEGORY
async function createCategory(name) {
    if (!name) throw new Error('Category name cannot be empty');
    
    const pool = await connectDB();
    const result = await pool.request()
        .input('name', sql.NVarChar, name)
        .input('created_at', sql.DateTime, new Date())
        .query('INSERT INTO Category (name, created_at) VALUES (@name, @created_at)');
    return result.rowsAffected[0] > 0;
}

// UPDATE CATEGORY
async function updateCategory(id, name) {
    if (!name) throw new Error('Category name cannot be empty');

    const pool = await connectDB();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('name', sql.NVarChar, name)
        .query('UPDATE Category SET name = @name WHERE id = @id');
    return result.rowsAffected[0] > 0;
}

// DELETE CATEGORY
async function deleteCategory(id) {
    const pool = await connectDB();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Category WHERE id = @id');
    return result.rowsAffected[0] > 0;
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
