'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.ProductOrder, { foreignKey: 'orderId' });
      Order.belongsToMany(models.Product, { through: models.ProductOrder, as: 'products', foreignKey: 'orderId' });
    }
  }
  Order.init({
    userId: DataTypes.BIGINT,
    createdBy: DataTypes.STRING(20)
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};