const express = require('express');
const {
  AddProduct,
  GetAllProduct,
  UpdateProduct,
  GetProductById,
  GetProductPaging,
  GetProductByNamePaging,
  DeleteProductById,
} = require('../controllers/product');

const router = express.Router();

router.post('/add', AddProduct);
router.get('/', GetAllProduct);
router.get('/id/:id', GetProductById);
router.put('/update', UpdateProduct);
router.get('/page/:page/rowsPerPage/:rowsPerPage', GetProductPaging);
router.get('/productName/:productName/page/:page/rowsPerPage/:rowsPerPage', GetProductByNamePaging);
router.delete('/delete/id/:id', DeleteProductById);

module.exports = router;
