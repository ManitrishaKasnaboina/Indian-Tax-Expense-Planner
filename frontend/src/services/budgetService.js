import api from './api';

const getBudgets = async (month, year) => {
  const params = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const response = await api.get('/budget/status/current', { params });
  return response.data.budgeted || [];
};

const setBudgetLimit = async (budgetData) => {
  // budgetData: { category, limit, month, year }
  const response = await api.post('/budget/create', budgetData);
  return response.data;
};

const budgetService = {
  getBudgets,
  setBudgetLimit,
};

export default budgetService;
