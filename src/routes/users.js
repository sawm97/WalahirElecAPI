var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    message: 'GET users success'
  });
});

/* POST users listing. */
router.post('/', function(req, res, next) {
  res.json({
    message: 'POST users success'
  });
});

module.exports = router;
