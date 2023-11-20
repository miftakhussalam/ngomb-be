const express = require('express');
const router = express.Router();
const category = require('./categories');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/category', category);

module.exports = router;
