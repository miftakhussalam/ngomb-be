const express = require('express');
const {
  AddOrder,
  GetAllOrder,
  GetOrderById,
  GetOrderPaging,
  DeleteOrderById,
} = require('../controllers/order');

const router = express.Router();

router.post('/add', AddOrder);
router.get('/', GetAllOrder);
router.get('/id/:id', GetOrderById);
// router.put('/update', UpdateProduct);
router.get('/page/:page/rowsPerPage/:rowsPerPage', GetOrderPaging);
// router.get('/productName/:productName/page/:page/rowsPerPage/:rowsPerPage', GetProductByNamePaging);
router.delete('/delete/id/:id', DeleteOrderById);

module.exports = router;
