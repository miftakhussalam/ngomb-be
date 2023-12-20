const express = require('express');
const router = express.Router();
const category = require('./categories');
const product = require('./products');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/category', category);
router.use('/product', product);

module.exports = router;
