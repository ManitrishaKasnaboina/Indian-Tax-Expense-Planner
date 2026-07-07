import api from './api';

const getTaxOverview = async () => {
  const response = await api.get('/analytics/tax-overview');
  return response.data;
};

const updateTaxProfile = async (profileData) => {
  const response = await api.put('/auth/update-profile', profileData);
  // Update local storage user data as well
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = {
    ...currentUser,
    ...response.data,
    deductions: {
      ...(currentUser.deductions || {}),
      ...(response.data.deductions || {})
    }
  };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return response.data;
};

const taxService = {
  getTaxOverview,
  updateTaxProfile,
};

export default taxService;
