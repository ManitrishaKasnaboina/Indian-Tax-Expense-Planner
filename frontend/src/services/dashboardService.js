import api from './api';

const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

const getChartData = async () => {
  const response = await api.get('/dashboard/charts');
  return response.data;
};

const getMonthlyTrends = async () => {
  const response = await api.get('/analytics/monthly-expenses');
  return response.data;
};

const dashboardService = {
  getDashboardSummary,
  getChartData,
  getMonthlyTrends,
};

export default dashboardService;
