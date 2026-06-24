const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/:userId', cartController.getCart);
router.post('/:userId/items', cartController.addItemToCart);
router.put('/:userId/items/:itemId', cartController.updateItemQuantity);
router.delete('/:userId/items/:itemId', cartController.removeItemFromCart);
router.delete('/:userId/clear', cartController.clearCart);

module.exports = router;
