import api from './api';

const uploadSalarySlip = async (file) => {
  const formData = new FormData();
  formData.append('salarySlip', file);

  const response = await api.post('/salary/upload', formData);
  return response.data;
};

const finalizeSalary = async (id, parsedData) => {
  const response = await api.post('/salary/analyze', {
    id,
    parsedData,
    syncToProfile: true,
  });
  return response.data;
};

const salaryService = {
  uploadSalarySlip,
  finalizeSalary,
};

export default salaryService;
