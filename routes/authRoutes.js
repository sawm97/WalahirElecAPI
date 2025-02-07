const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { refreshSASToken } = require('../controllers/sasTokenController');

const AuthMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/refresh-sas-token', AuthMiddleware.authenticateToken, refreshSASToken);
router.post('/logout', logout); 

module.exports = router;
