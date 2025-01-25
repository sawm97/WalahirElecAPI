var express = require('express');
var router = express.Router();

const UserController = require('../controllers/users');

/* GET users listing. */
router.get('/', UserController.getAllUsers);

/* POST users listing. */
router.post('/', UserController.createNewUser);

module.exports = router;
