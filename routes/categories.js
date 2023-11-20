const express = require('express');
const {
  AddCategory,
  GetAllCategories,
  GetCategoryById,
  UpdateCategory,
  DeleteCategoryById,
  GetCategoriesPaging,
  GetCategoriesByNamePaging,
} = require('../controllers/category');

const router = express.Router();

/* midle ware to handle authorization */
// router.use(verifyToken);
router.post('/add', AddCategory);
router.get('/', GetAllCategories);
router.get('/page/:page/rowsPerPage/:rowsPerPage', GetCategoriesPaging);
router.get('/categoryName/:categoryName/page/:page/rowsPerPage/:rowsPerPage', GetCategoriesByNamePaging);
router.get('/id/:id', GetCategoryById);
router.put('/update', UpdateCategory);
router.delete('/delete/id/:id', DeleteCategoryById);

module.exports = router;
