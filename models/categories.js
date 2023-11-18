'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Categories.init({
    categoryName: DataTypes.STRING,
    note: DataTypes.STRING,
    createdBy: DataTypes.BIGINT,
    updatedBy: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Categories',
  });
  return Categories;
};