const { Cart, CartItem, Product, User } = require('../models');

// Helper to fetch cart with all relationships loaded
const fetchUserCart = async (userId) => {
  // Ensure user exists first
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let cart = await Cart.findOne({
    where: { user_id: userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
          },
        ],
      },
    ],
  });

  if (!cart) {
    cart = await Cart.create({ user_id: userId });
    // Reload with associations
    cart = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });
  }

  return cart;
};

const getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cart = await fetchUserCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const addItemToCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    const cart = await fetchUserCart(userId);
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    // Check if item is already in cart
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (cartItem) {
      const newQty = cartItem.quantity + Number(quantity);
      await cartItem.update({
        quantity: newQty,
        subtotal: product.price * newQty,
      });
    } else {
      await CartItem.create({
        cart_id: cart.id,
        product_id: productId,
        quantity: Number(quantity),
        subtotal: product.price * Number(quantity),
      });
    }

    const updatedCart = await fetchUserCart(userId);
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const updateItemQuantity = async (req, res, next) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    const cart = await fetchUserCart(userId);
    const cartItem = await CartItem.findByPk(itemId, {
      include: [{ model: Product, as: 'product' }],
    });

    if (!cartItem) {
      return res.status(400).json({ message: 'Cart Item not found' });
    }

    if (cartItem.cart_id !== cart.id) {
      return res.status(400).json({ message: "Item does not belong to user's cart" });
    }

    if (Number(quantity) <= 0) {
      await cartItem.destroy();
    } else {
      await cartItem.update({
        quantity: Number(quantity),
        subtotal: cartItem.product.price * Number(quantity),
      });
    }

    const updatedCart = await fetchUserCart(userId);
    res.status(200).json(updatedCart);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const removeItemFromCart = async (req, res, next) => {
  try {
    const { userId, itemId } = req.params;
    // Removing is updating quantity to 0
    req.body = { quantity: 0 };
    return updateItemQuantity(req, res, next);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const cart = await fetchUserCart(userId);

    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
