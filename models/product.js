'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductOrder, { foreignKey: 'productId' });
      Product.belongsToMany(models.Order, { through: models.ProductOrder, as: 'orders', foreignKey: 'productId' });
      Product.belongsTo(models.Categories, { foreignKey: 'categoryId', as: 'category' });
    }
  }
  Product.init({
    productName: DataTypes.STRING,
    categoryId: DataTypes.BIGINT,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    createdBy: DataTypes.STRING(20),
    updatedBy: DataTypes.STRING(20),
    price: DataTypes.BIGINT,
    stock: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};