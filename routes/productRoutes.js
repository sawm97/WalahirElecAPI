const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const ProductController = require('../controllers/productController');

// GET ALL PRODUCTS
router.get('/', ProductController.fetchProducts);

// GET PRODUCT BY ID
router.get('/:id', ProductController.getProduct);

// CREATE PRODUCT
router.post('/', ProductController.addProduct);

// UPDATE PRODUCT
router.put('/:id', ProductController.editProduct);

// DELETE PRODUCT
router.delete('/:id', ProductController.removeProduct);

// UPLOAD PRODUCT IMAGE
router.post('/:id/upload-image', upload.single('image'), ProductController.uploadProductImage);

module.exports = router;
