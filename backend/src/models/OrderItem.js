const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
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
  price: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  },
  subtotal: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0.0,
  },
}, {
  tableName: 'order_items',
  timestamps: false,
});

module.exports = OrderItem;
