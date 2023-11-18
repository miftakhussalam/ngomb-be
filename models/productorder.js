'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductOrder.init({
    productId: DataTypes.BIGINT,
    note: DataTypes.STRING,
    qty: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'ProductOrder',
  });
  return ProductOrder;
};