import api from './api';

const getReportsData = async (year) => {
  const params = {};
  if (year) params.year = year;
  const response = await api.get('/analytics/reports', { params });
  return response.data;
};

const reportService = {
  getReportsData,
};

export default reportService;
