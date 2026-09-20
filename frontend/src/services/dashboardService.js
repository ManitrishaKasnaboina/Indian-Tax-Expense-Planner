import api from './api';

const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

const getChartData = async () => {
  const response = await api.get('/dashboard/charts');
  return response.data;
};

const dashboardService = {
  getDashboardSummary,
  getChartData,
};

export default dashboardService;
