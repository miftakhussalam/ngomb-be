const Validator = require('fastest-validator');
const { Order, sequelize, Categories, ProductOrder, Product } = require('../models');
const { productScheme } = require('./product');

const validator = new Validator();

const orderScheme = {
  userId: { type: 'number', optional: true, integer: true },
  createdBy: { type: 'string' },
  updatedBy: { type: 'string' },
  createdAt: { type: 'string', optional: true },
  updatedAt: { type: 'string', optional: true },
};

const productOrderScheme = {
  productId: { type: 'number', optional: true, integer: true },
  orderId: { type: 'number', optional: true, integer: true },
  qty: { type: 'number' },
  note: { type: 'string' },
  createdBy: { type: 'string' },
  updatedBy: { type: 'string' },
  createdAt: { type: 'string', optional: true },
  updatedAt: { type: 'string', optional: true },
};

const orderCreationScheme = {
  ...orderScheme,
  products: {
    type: 'array',
    items: {
      type: 'object',
      props: {
        ...productScheme,
        qty: { type: 'number' },
        note: { type: 'string', optional: true },
      },
    }
  },
};


const currentTime = new Date().toISOString();

const AddOrder = async (req, res) => {
  const {
    createdBy,
    products
  } = req.body;

  try {
    const params = {
      ...req.body,
      updatedBy: createdBy,
    }

    const validationMessagee = validator.validate(params, orderCreationScheme);
    if (validationMessagee.length) {
      return res.status(400).json({
        status: 'fail',
        message: validationMessagee,
        data: null,
      });
    }

    const [newOrder, orderCreated] = await Order.findOrCreate({
      where: {
        createdAt: currentTime,
      },
      defaults: {
        userId: req.body.userId,
        createdBy,
        createdAt: currentTime,
      },
    });

    if (!orderCreated) {
      return res.status(400).json({
        status: 'fail',
        message: 'Order is already exist',
        data: null,
      });
    }

    const productOrderPromises = await products.map(async (item) => {
      const [productOrder, isCreated] = await ProductOrder.findOrCreate({
        where: {
          orderId: newOrder.dataValues.id,
          productId: item.id,
        },
        defaults: {
          orderId: newOrder.dataValues.id,
          productId: item.id,
          qty: item.qty,
          note: item.note,
          createdBy
        }
      });

      await Product.update({ ...item, stock: item.stock - item.qty }, { where: { id: item.id } })

      return productOrder
    });

    await Promise.all(productOrderPromises);

    return res.status(200).json({
      status: 'success',
      message: 'Order created successfully',
      data: {
        order: newOrder,
        products,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// const UpdateOrder = async (req, res) => {
//   const { id } = req.body

//   try {
//     const params = {
//       ...req.body,
//       // updatedAt: currentTime,
//     };

//     const validationMessagee = validator.validate(params, { ...productScheme, id: { type: 'number', positive: true, integer: true }, });

//     if (validationMessagee.length) {
//       return res.status(400).json({
//         status: 'fail',
//         message: validationMessagee,
//         data: null,
//       });
//     }

//     const isUpdate = await Order.update(params, { where: { id } });

//     if (isUpdate < 1) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Order not updated',
//         data: null,
//       });
//     }

//     const categoryUpdated = await Order.findOne({ where: { id } });

//     return res.status(200).json({
//       status: 'success',
//       message: 'Order updated',
//       data: categoryUpdated,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };

const GetAllOrder = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          through: 'ProductOrder',
          attributes: { exclude: ['categoryId'] },
          include: [
            {
              model: Categories,
              as: 'category'
            }
          ],
        }
      ],
      order: ['createdAt']
    });
    return res.status(200).json({
      status: 'success',
      message: orders.length > 0 ? 'Order Found' : 'Order is empty',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Order.findOne({
      where: { id },
      include: [
        {
          model: Product,
          as: 'products',
          through: 'ProductOrder',
          attributes: { exclude: ['categoryId'] },
          include: [
            {
              model: Categories,
              as: 'category'
            }
          ],
        }
      ],
    });
    if (!categories) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
        data: null,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Order found',
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

const GetOrderPaging = async (req, res) => {
  const { page, rowsPerPage } = req.params;
  const offset = page * rowsPerPage;
  try {
    const { count, rows } = await Order.findAndCountAll({
      offset,
      limit: rowsPerPage,
      include: [
        {
          model: Product,
          as: 'products',
          through: 'ProductOrder',
          attributes: { exclude: ['categoryId'] },
          include: [
            {
              model: Categories,
              as: 'category'
            }
          ],
        }
      ],
      order: ['createdAt']
    });
    return res.status(200).json({
      status: 'success',
      message: count > 0 ? 'Order Found' : 'Order is empty',
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

// const GetOrderByNamePaging = async (req, res) => {
//   const { page, rowsPerPage, productName } = req.params;

//   const offset = page * rowsPerPage;
//   try {
//     const { count, rows } = await Order.findAndCountAll({
//       offset,
//       limit: rowsPerPage,
//       order: ['productName'],
//       where: {
//         productName: sequelize.where(sequelize.fn('LOWER', sequelize.col('productName')), 'LIKE', `%${productName}%`),
//       },
//       include: [
//         {
//           model: Product,
//           as: 'products',
//           through: 'ProductOrder',
//           attributes: { exclude: ['categoryId'] },
//           include: [
//             {
//               model: Categories,
//               as: 'category'
//             }
//           ],
//         }
//       ],
//       order: ['createdAt']
//     });
//     return res.status(200).json({
//       status: 'success',
//       message: count > 0 ? 'Order Found' : 'Order is empty',
//       data: rows,
//       totalData: count,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 'error',
//       message: error.message,
//     });
//   }
// };

const DeleteOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const orderExist = await Order.findOne({ where: { id } });
    if (!orderExist) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
        data: null,
      });
    }
    const orderDestroyed = await Order.destroy({ where: { id } });
    if (orderDestroyed < 1) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not deleted',
        data: null,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully',
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
  AddOrder,
  // UpdateOrder,
  GetAllOrder,
  GetOrderPaging,
  // GetOrderByNamePaging,
  GetOrderById,
  DeleteOrderById,
};
