// productModel.js
const { connectDB } = require('../config/databaseConfig');
const sql = require('mssql');

// GET ALL PRODUCTS
async function getAllProducts() {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Product');
    return result.recordset;
}

// GET PRODUCT BY ID
async function getProductById(id) {
    const pool = await connectDB();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Product WHERE id = @id');
    return result.recordset[0];
}

// CREATE PRODUCT
async function createProduct({ name, stock, price, category_id, description }) {
    if (!name) throw new Error('Product name cannot be empty');
    
    const pool = await connectDB();
    const result = await pool.request()
        .input('name', sql.NVarChar, name)
        .input('stock', sql.Int, stock)
        .input('price', sql.Int, price)
        .input('category_id', sql.Int, category_id)
        .input('description', sql.NVarChar, description)
        .query(`
            INSERT INTO Product (name, stock, price, category_id, description) 
            VALUES (@name, @stock, @price, @category_id, @description)
        `);
    return result.rowsAffected[0] > 0;
}

// UPDATE PRODUCT
async function updateProduct(id, { name, stock, price, category_id, description }) {
    const pool = await connectDB();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('name', sql.NVarChar, name)
        .input('stock', sql.Int, stock)
        .input('price', sql.Int, price)
        .input('category_id', sql.Int, category_id)
        .input('description', sql.NVarChar, description)
        .query(`
            UPDATE Product 
            SET name = @name, stock = @stock, price = @price, category_id = @category_id, description = @description 
            WHERE id = @id
        `);
    return result.rowsAffected[0] > 0;
}

// SAVE PRODUCT IMAGE
async function saveProductImage(productId, imageUrl) {
    try {
        const pool = await connectDB();
        await pool.request()
            .input('productId', sql.Int, productId)
            .input('imageUrl', sql.NVarChar, imageUrl)
            .query(`
                UPDATE Product
                SET image_url = @imageUrl
                WHERE id = @productId
            `);
        return true;
    } catch (error) {
        console.error('Error saving product image URL:', error);
        throw error;
    }
}

// DELETE PRODUCT
async function deleteProduct(id) {
    const pool = await connectDB();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Product WHERE id = @id');
    return result.rowsAffected[0] > 0;
}

module.exports = { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    saveProductImage,
    deleteProduct 
};
