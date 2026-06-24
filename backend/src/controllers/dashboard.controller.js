const { Order, Product, User } = require('../models');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalRevenueSum = await Order.sum('totalAmount');
    const totalRevenue = totalRevenueSum !== null ? Number(totalRevenueSum) : 0.0;

    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalUsers = await User.count();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
