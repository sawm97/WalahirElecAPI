// categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET ALL CATEGORIES
router.get('/categories', categoryController.fetchCategories);

// GET CATEGORY BY ID
router.get('/categories/:id', categoryController.fetchCategoryById);

// CREATE CATEGORY
router.post('/categories', categoryController.createCategory);

// UPDATE CATEGORY
router.put('/categories/:id', categoryController.updateCategory);

// DELETE CATEGORY
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
