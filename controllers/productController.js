const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    saveProductImage
} = require('../models/productModel');
const { uploadToAzureBlob } = require('../helpers/azureBlobHelper');

// GET ALL PRODUCTS
async function fetchProducts(req, res) {
    try {
        const products = await getAllProducts();
        res.status(200).json({
            status: 'success',
            IsSuccess: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: error.message
        });
    }
}

// GET PRODUCT BY ID
async function getProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await getProductById(id);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                IsSuccess: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            status: 'success',
            IsSuccess: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: error.message
        });
    }
}

// CREATE PRODUCT
async function addProduct(req, res) {
    try {
        const { name, stock, price, category_id, desc } = req.body;
        const image_url = req.file ? req.file.url : null;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                IsSuccess: false,
                message: 'Product name cannot be empty'
            });
        }

        const success = await createProduct({
            name, stock, price, category_id, desc, image_url
        });

        res.status(success ? 201 : 400).json({
            status: success ? 'success' : 'error',
            IsSuccess: success,
            message: success ? 'Product created successfully' : 'Failed to create product'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: error.message
        });
    }
}

// UPDATE PRODUCT
async function editProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, stock, price, category_id, desc } = req.body;
        const image_url = req.file ? req.file.url : null;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                IsSuccess: false,
                message: 'Product name cannot be empty'
            });
        }

        const success = await updateProduct(id, {
            name, stock, price, category_id, desc, image_url
        });

        res.status(success ? 200 : 404).json({
            status: success ? 'success' : 'error',
            IsSuccess: success,
            message: success ? 'Product updated successfully' : 'Product not found'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: error.message
        });
    }
}

// DELETE PRODUCT
async function removeProduct(req, res) {
    try {
        const { id } = req.params;
        const success = await deleteProduct(id);

        res.status(success ? 200 : 404).json({
            status: success ? 'success' : 'error',
            IsSuccess: success,
            message: success ? 'Product deleted successfully' : 'Product not found'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: error.message
        });
    }
}

// UPLOAD PRODUCT IMAGE
async function uploadProductImage(req, res) {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                status: 'error',
                IsSuccess: false,
                message: 'No image uploaded'
            });
        }

        const imageUrl = await uploadToAzureBlob(file.buffer, file.originalname, file.mimetype);
        const success = await saveProductImage(id, imageUrl);

        res.status(success ? 200 : 404).json({
            status: success ? 'success' : 'error',
            IsSuccess: success,
            image_url: imageUrl,
            message: success ? 'Image uploaded successfully' : 'Product not found'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            IsSuccess: false,
            message: error.message
        });
    }
}

module.exports = {
    fetchProducts,
    getProduct,
    addProduct,
    editProduct,
    removeProduct,
    uploadProductImage
};
