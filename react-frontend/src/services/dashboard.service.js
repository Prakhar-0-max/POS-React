import api from './api';

const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const dashboardService = {
  getDashboardStats,
};
