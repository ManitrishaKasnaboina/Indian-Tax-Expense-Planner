import api from './api';

const getGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

const addFundsToGoal = async (id, amount) => {
  const response = await api.post(`/goals/${id}/add-funds`, { amount });
  return response.data;
};

const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

const goalService = {
  getGoals,
  createGoal,
  addFundsToGoal,
  deleteGoal
};

export default goalService;
