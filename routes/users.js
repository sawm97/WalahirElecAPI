var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');

/* GET users listing. */
router.get('/', UserController.fetchUsers);

/* POST users listing. */
router.post('/', UserController.addUser);

module.exports = router;
