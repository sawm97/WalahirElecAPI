/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */
const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { refreshSASToken } = require('../controllers/sasTokenController');
const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and return tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identifier:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh access token using a valid refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /refresh-sas-token:
 *   post:
 *     summary: Refresh SAS token for Azure Blob Storage
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SAS token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh-sas-token', AuthMiddleware.authenticateToken, refreshSASToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user and remove refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       204:
 *         description: No content (token not found)
 */
router.post('/logout', logout);

module.exports = router;
