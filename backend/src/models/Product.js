const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Product name is required' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      isFloat: true,
      min: {
        args: [0.01],
        msg: 'Price must be positive',
      },
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  version: {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

module.exports = Product;
