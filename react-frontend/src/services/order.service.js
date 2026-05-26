import api from './api';

const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

const getOrderHistory = async (userId) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

export const orderService = {
  getAllOrders,
  getOrderById,
  getOrderHistory,
};
