import axios from 'axios';

// Accept either the backend origin or an origin that already includes /api.
const configuredApiUrl = import.meta.env.VITE_API_URL || 'https://indian-tax-expense-planner.onrender.com';
const API_BASE_URL = `${configuredApiUrl.replace(/\/$/, '').replace(/\/api$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling global responses/errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.error('Unauthorized - token may be expired or invalid');
      // Optionally redirect to login: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
