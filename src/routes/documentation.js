var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('documentation', { title: 'API Documentation' });
});

module.exports = router;
