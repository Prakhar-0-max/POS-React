import api from './api';

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const authService = {
  login,
  register,
};
