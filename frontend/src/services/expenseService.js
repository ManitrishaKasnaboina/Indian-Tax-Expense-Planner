import api from './api';

const getExpenses = async (month, year) => {
  const params = {};
  if (month) params.month = month;
  if (year) params.year = year;
  const response = await api.get('/expenses', { params });
  // Backend returns { expenses, page, pages, total }, we need just the expenses array
  return response.data.expenses || [];
};

const addExpense = async (expenseData) => {
  const response = await api.post('/expenses/add', expenseData);
  return response.data;
};

const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/delete/${id}`);
  return response.data;
};

const expenseService = {
  getExpenses,
  addExpense,
  deleteExpense,
};

export default expenseService;
