// categoryController.js
const CategoryModel = require('../models/categoryModel');

// GET ALL CATEGORIES
async function fetchCategories(req, res) {
    try {
        const categories = await CategoryModel.getAllCategories();
        res.status(200).json({ status: 'success', IsSuccess: true, data: categories });
    } catch (error) {
        res.status(500).json({ status: 'error', IsSuccess: false, message: error.message });
    }
}

// GET CATEGORY BY ID
async function fetchCategoryById(req, res) {
    const { id } = req.params;

    try {
        const category = await CategoryModel.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ status: 'error', IsSuccess: false, message: 'Category not found' });
        }
        res.status(200).json({ status: 'success', IsSuccess: true, data: category });
    } catch (error) {
        res.status(500).json({ status: 'error', IsSuccess: false, message: error.message });
    }
}

// CREATE CATEGORY
async function createCategory(req, res) {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ status: 'error', IsSuccess: false, message: 'Category name cannot be empty' });
        }

        const success = await CategoryModel.createCategory(name);
        if (success) {
            res.status(201).json({ status: 'success', IsSuccess: true, message: 'Category created successfully' });
        } else {
            res.status(500).json({ status: 'error', IsSuccess: false, message: 'Failed to create category' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', IsSuccess: false, message: error.message });
    }
}

// UPDATE CATEGORY
async function updateCategory(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ status: 'error', IsSuccess: false, message: 'Category name cannot be empty' });
        }

        const success = await CategoryModel.updateCategory(id, name);
        if (success) {
            res.status(200).json({ status: 'success', IsSuccess: true, message: 'Category updated successfully' });
        } else {
            res.status(404).json({ status: 'error', IsSuccess: false, message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', IsSuccess: false, message: error.message });
    }
}

// DELETE CATEGORY
async function deleteCategory(req, res) {
    const { id } = req.params;

    try {
        const success = await CategoryModel.deleteCategory(id);
        if (success) {
            res.status(200).json({ status: 'success', IsSuccess: true, message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', IsSuccess: false, message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', IsSuccess: false, message: error.message });
    }
}

module.exports = {
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
