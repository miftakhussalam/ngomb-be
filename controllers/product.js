const Validator = require('fastest-validator');
const { Product, sequelize, Categories } = require('../models');

const validator = new Validator();

const productScheme = {
  productName: { type: 'string' },
  categoryId: { type: 'number', optional: true, integer: true },
  description: { type: 'string', optional: true },
  image: { type: 'string', optional: true },
  price: { type: 'number' },
  stock: { type: 'number' },
  createdBy: { type: 'string' },
  updatedBy: { type: 'string' },
  createdAt: { type: 'string', optional: true },
  updatedAt: { type: 'string', optional: true },
};

const currentTime = new Date().toISOString();

const AddProduct = async (req, res) => {
  const {
    productName,
    createdBy,
  } = req.body;

  try {
    const params = {
      ...req.body,
      updatedBy: createdBy,
    }

    const validationMessagee = validator.validate(params, productScheme);
    if (validationMessagee.length) {
      return res.status(400).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }
    const [newProduct, isCreated] = await Product.findOrCreate({
      where: {
        productName,
      },
      defaults: {
        ...req.body,
        updatedAt: currentTime,
        updatedBy: createdBy,
      },
    });
    if (!isCreated) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product is already exist',
        data: null,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const UpdateProduct = async (req, res) => {
  const { id } = req.body

  try {
    const params = {
      ...req.body,
      // updatedAt: currentTime,
    };

    const validationMessagee = validator.validate(params, { ...productScheme, id: { type: 'number', positive: true, integer: true }, });

    if (validationMessagee.length) {
      return res.status(400).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }

    const isUpdate = await Product.update(params, { where: { id } });

    if (isUpdate < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product not updated',
        data: null,
      });
    }

    const categoryUpdated = await Product.findOne({ where: { id } });

    return res.status(200).json({
      status: 'success',
      message: 'Product updated',
      data: categoryUpdated,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: ['productName'],
      include: [
        {
          model: Categories,
          as: 'category'
        }
      ],
      attributes: { exclude: ['categoryId'] }
    });
    return res.status(200).json({
      status: 'success',
      message: products.length > 0 ? 'Product Found' : 'Product is empty',
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Product.findOne({
      where: { id },
      include: [
        {
          model: Categories,
          as: 'category'
        }
      ],
      attributes: { exclude: ['categoryId'] }
    });
    if (!categories) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
        data: null,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Product found',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetProductPaging = async (req, res) => {
  const { page, rowsPerPage } = req.params;
  const offset = page * rowsPerPage;
  try {
    const { count, rows } = await Product.findAndCountAll({
      offset,
      limit: rowsPerPage,
      order: ['productName'],
      include: [
        {
          model: Categories,
          as: 'category'
        }
      ],
      attributes: { exclude: ['categoryId'] }
    });
    return res.status(200).json({
      status: 'success',
      message: count > 0 ? 'Product Found' : 'Product is empty',
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

const GetProductByNamePaging = async (req, res) => {
  const { page, rowsPerPage, productName } = req.params;

  const offset = page * rowsPerPage;
  try {
    const { count, rows } = await Product.findAndCountAll({
      offset,
      limit: rowsPerPage,
      order: ['productName'],
      where: {
        productName: sequelize.where(sequelize.fn('LOWER', sequelize.col('productName')), 'LIKE', `%${productName}%`),
      },
      include: [
        {
          model: Categories,
          as: 'category'
        }
      ],
      attributes: { exclude: ['categoryId'] }
    });
    return res.status(200).json({
      status: 'success',
      message: count > 0 ? 'Product Found' : 'Product is empty',
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

const DeleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const productExist = await Product.findOne({ where: { id } });
    if (!productExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
        data: null,
      });
    }
    const productDestroyed = await Product.destroy({ where: { id } });
    if (productDestroyed < 1) {
      return res.status(404).json({
        status: 'fail',
        message: 'product not deleted',
        data: null,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Product delete successfully',
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
  AddProduct,
  UpdateProduct,
  GetAllProduct,
  GetProductPaging,
  GetProductByNamePaging,
  GetProductById,
  DeleteProductById,
  productScheme,
};
