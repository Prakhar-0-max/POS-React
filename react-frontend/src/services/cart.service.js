import api from './api';

const checkout = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const cartService = {
  checkout,
};
