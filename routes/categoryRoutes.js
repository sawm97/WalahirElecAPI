// categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET ALL CATEGORIES
router.get('/', categoryController.fetchCategories);

// GET CATEGORY BY ID
router.get('/:id', categoryController.fetchCategoryById);

// CREATE CATEGORY
router.post('/', categoryController.createCategory);

// UPDATE CATEGORY
router.put('/:id', categoryController.updateCategory);

// DELETE CATEGORY
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
