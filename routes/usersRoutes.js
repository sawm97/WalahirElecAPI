var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middleware/authMiddleware')

/* GET users listing. */
router.get('/', AuthMiddleware.authenticateToken , UserController.fetchUsers);

/* POST users listing. */
router.post('/', UserController.addUser);

module.exports = router;
