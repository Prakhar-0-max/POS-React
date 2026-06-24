const { sequelize, OrderItem, Product } = require('../models');
const { Op } = require('sequelize');

const getProductSales = async (req, res, next) => {
  try {
    const sales = await OrderItem.findAll({
      attributes: [
        [sequelize.col('product.id'), 'id'],
        [sequelize.col('product.name'), 'name'],
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'totalSold'],
        [sequelize.col('product.stock'), 'currentStock'],
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: [],
        },
      ],
      group: ['product.id', 'product.name', 'product.stock'],
      order: [[sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'DESC']],
      raw: true,
    });

    // Parse numeric strings to actual numbers
    const formattedSales = sales.map(s => ({
      id: Number(s.id),
      name: s.name,
      totalSold: Number(s.totalSold || 0),
      currentStock: Number(s.currentStock || 0),
    }));

    res.status(200).json(formattedSales);
  } catch (error) {
    next(error);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        stock: {
          [Op.lt]: 5,
        },
      },
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductSales,
  getLowStockProducts,
};
