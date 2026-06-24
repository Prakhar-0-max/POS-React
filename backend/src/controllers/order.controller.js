const { sequelize, Order, OrderItem, Product, User } = require('../models');

const createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, paymentMethod = 'Cash', items } = req.body;

    if (!userId) {
      await transaction.rollback();
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(400).json({ message: 'User not found' });
    }

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create the Order record
    const order = await Order.create({
      user_id: userId,
      paymentMethod,
      date: new Date(),
      status: 'completed',
      totalAmount: 0.0, // Will update this at the end of loop
    }, { transaction });

    let totalAmount = 0.0;

    for (const itemReq of items) {
      const productId = itemReq.id;
      const quantity = Number(itemReq.quantity);

      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Product not found' });
      }

      // Check stock
      if (product.stock === null || product.stock < quantity) {
        await transaction.rollback();
        const availableStock = product.stock !== null ? product.stock : 0;
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}. Available: ${availableStock}, Requested: ${quantity}`
        });
      }

      const subtotal = product.price * quantity;
      totalAmount += subtotal;

      // Deduct stock
      await product.update({
        stock: product.stock - quantity
      }, { transaction });

      // Create OrderItem
      await OrderItem.create({
        order_id: order.id,
        product_id: productId,
        quantity,
        price: product.price,
        subtotal
      }, { transaction });
    }

    // Update order total amount
    await order.update({ totalAmount }, { transaction });

    await transaction.commit();

    // Fetch the complete order with relationships to return
    const completedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    res.status(200).json(completedOrder);
  } catch (error) {
    if (transaction.finished !== 'commit') {
      await transaction.rollback();
    }
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      order: [['date', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Implement getOrderById to match frontend service (in case it is called)
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderHistory,
  getOrderById,
};
