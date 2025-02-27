var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *         address:
 *           type: string
 *           description: The address of the user
 *         phone_number:
 *           type: string
 *           description: The phone number of the user
 *         birth_date:
 *           type: string
 *           format: date
 *           description: The birth date of the user
 *       example:
 *         id: 1
 *         username: john_doe
 *         email: john@example.com
 *         password: 123456
 *         role: user
 *         address: Jl. Merdeka No. 10
 *         phone_number: 08123456789
 *         birth_date: 1995-05-20
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', AuthMiddleware.authenticateToken, AuthMiddleware.authorizeRoles('admin'), UserController.fetchUsers);

/**
 * @swagger
 * /users/data/{identifier}:
 *   get:
 *     summary: Get the user by identifier (username or email)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         schema:
 *           type: string
 *         required: true
 *         description: The user identifier (username or email)
 *     responses:
 *       200:
 *         description: The user description by identifier
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */
router.get('/data/:identifier', AuthMiddleware.authenticateToken, UserController.getUser);

/**
 * @swagger
 * /users/edit-profile:
 *   put:
 *     summary: Update the user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user profile was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some error happened
 */
router.put('/edit-profile', AuthMiddleware.authenticateToken, UserController.updateProfile);

/**
 * @swagger
 * /users/edit-user:
 *   put:
 *     summary: Update the user information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user information was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Some error happened
 */
router.put('/edit-user', AuthMiddleware.authenticateToken, UserController.updateUserProfile);

/**
 * @swagger
 * /users/edit-profpic:
 *   post:
 *     summary: Upload the user profile picture
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The profile picture was uploaded successfully
 *       500:
 *         description: Some error happened
 */
router.post('/edit-profpic', AuthMiddleware.authenticateToken, upload.single('profilePicture'), UserController.uploadProfilePicture);

/**
 * @swagger
 * /users/get-profpic:
 *   get:
 *     summary: Get the user profile picture
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user profile picture URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image_url:
 *                   type: string
 *                   description: The URL of the profile picture
 *       404:
 *         description: The user profile picture was not found
 */
router.get('/get-profpic', AuthMiddleware.authenticateToken, UserController.viewImage);

module.exports = router;