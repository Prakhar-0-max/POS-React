const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  subtotal: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  },
}, {
  tableName: 'cart_items',
  timestamps: false,
});

module.exports = CartItem;
