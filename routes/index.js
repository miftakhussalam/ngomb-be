const express = require('express');
const router = express.Router();
const user = require('./users');
const auth = require('./authorizations');
const category = require('./categories');
const product = require('./products');
const order = require('./orders');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/category', category);
router.use('/product', product);
router.use('/order', order);

module.exports = router;
