var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware')

/* GET users listing. */
router.get('/', AuthMiddleware.authenticateToken, AuthMiddleware.authorizeRoles('admin'), UserController.fetchUsers);

/* UPDATE user detail */
router.put('/edit-profile', AuthMiddleware.authenticateToken, UserController.updateProfile);


module.exports = router;
