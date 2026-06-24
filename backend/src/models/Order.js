const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  totalAmount: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    field: 'total_amount',
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'completed',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_method',
    defaultValue: 'Cash',
  },
}, {
  tableName: 'orders',
  timestamps: false,
});

module.exports = Order;
