var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/* GET users listing. */
router.get('/', AuthMiddleware.authenticateToken, AuthMiddleware.authorizeRoles('admin'), UserController.fetchUsers);

/* GET user data */
router.get('/data/:identifier', AuthMiddleware.authenticateToken, UserController.getUser);

/* UPDATE user detail */
router.put('/edit-profile', AuthMiddleware.authenticateToken, UserController.updateProfile);

/* UPDATE user */
router.put('/edit-user', AuthMiddleware.authenticateToken, UserController.updateUserProfile);

/* UPDATE user profile picture */
router.post('/edit-profpic', AuthMiddleware.authenticateToken, upload.single('profilePicture'), UserController.uploadProfilePicture);

/* GET user profile picture */
router.get('/get-profpic', AuthMiddleware.authenticateToken, UserController.viewImage);

module.exports = router;