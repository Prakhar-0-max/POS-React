import api from './api';

const getLowStockProducts = async () => {
  const response = await api.get('/reports/low-stock');
  return response.data;
};

const getProductSales = async () => {
  const response = await api.get('/reports/product-sales');
  return response.data;
};

export const reportService = {
  getLowStockProducts,
  getProductSales,
};
