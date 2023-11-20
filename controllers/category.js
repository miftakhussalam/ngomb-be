const Validator = require('fastest-validator');
const { Categories, sequelize } = require('../models');

const validator = new Validator();

const categoryScheme = {
  categoryName: { type: 'string' },
  note: { type: 'string', optional: true },
  createdBy: { type: 'string' },
  updatedBy: { type: 'string' },
  createdAt: { type: 'string', optional: true },
  updatedAt: { type: 'string', optional: true },
};

const currentTime = new Date().toISOString();

const AddCategory = async (req, res) => {
  const {
    categoryName,
    note,
    createdBy,
  } = req.body;

  try {
    const params = {
      ...req.body,
      updatedBy: createdBy,
    }

    const validationMessagee = validator.validate(params, categoryScheme);
    if (validationMessagee.length) {
      return res.status(400).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }
    const [newCategories, isCreated] = await Categories.findOrCreate({
      where: {
        categoryName,
      },
      defaults: {
        note,
        createdBy,
        updatedAt: currentTime,
        updatedBy: createdBy,
      },
    });
    if (!isCreated) {
      return res.status(400).json({
        status: 'fail',
        message: 'Categories is already exist',
        data: null,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Categories added',
      data: newCategories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const UpdateCategory = async (req, res) => {
  const { id } = req.body

  try {
    const params = {
      ...req.body,
      // updatedAt: currentTime,
    };

    const validationMessagee = validator.validate(params, { ...categoryScheme, id: { type: 'number', positive: true, integer: true }, });

    if (validationMessagee.length) {
      return res.status(400).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }

    const isUpdate = await Categories.update(params, { where: { id } });

    if (isUpdate < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Categories not updated',
        data: null,
      });
    }

    const categoryUpdated = await Categories.findOne({ where: { id } });

    return res.status(200).json({
      status: 'success',
      message: 'Categories updated',
      data: categoryUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetAllCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll({
      order: ['categoryName'],
    });
    return res.status(200).json({
      status: 'success',
      message: categories.length > 0 ? 'Categories Found' : 'Categories is empty',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Categories.findOne({ where: { id } });
    if (!categories) {
      return res.status(404).json({
        status: 'fail',
        message: 'Categories not found',
        data: null,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Categories found',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetCategoriesPaging = async (req, res) => {
  const { page, rowsPerPage } = req.params;
  const offset = page * rowsPerPage;
  try {
    const { count, rows } = await Categories.findAndCountAll({
      offset,
      limit: rowsPerPage,
      order: ['categoryName'],
    });
    return res.status(200).json({
      status: 'success',
      message: count > 0 ? 'Categories Found' : 'Categories is empty',
      data: rows,
      totalData: count,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetCategoriesByNamePaging = async (req, res) => {
  const { page, rowsPerPage, categoryName } = req.params;

  const offset = page * rowsPerPage;
  try {
    const { count, rows } = await Categories.findAndCountAll({
      offset,
      limit: rowsPerPage,
      order: ['categoryName'],
      where: {
        categoryName: sequelize.where(sequelize.fn('LOWER', sequelize.col('categoryName')), 'LIKE', `%${categoryName}%`),
      },
    });
    return res.status(200).json({
      status: 'success',
      message: count > 0 ? 'Categories Found' : 'Categories is empty',
      data: rows,
      totalData: count,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const DeleteCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryExist = await Categories.findOne({ where: { id } });
    if (!categoryExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Categories not found',
        data: null,
      });
    }
    const categoryDestroyed = await Categories.destroy({ where: { id } });
    if (categoryDestroyed < 1) {
      return res.status(404).json({
        status: 'fail',
        message: 'product not deleted',
        data: null,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Categories delete successfully',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  AddCategory,
  UpdateCategory,
  GetAllCategories,
  GetCategoriesPaging,
  GetCategoriesByNamePaging,
  GetCategoryById,
  DeleteCategoryById,
};
