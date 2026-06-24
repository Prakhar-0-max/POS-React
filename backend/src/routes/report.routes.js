const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/product-sales', reportController.getProductSales);
router.get('/low-stock', reportController.getLowStockProducts);

module.exports = router;
