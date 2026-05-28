const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authAPI = require('./apis/authAPI');
const expenseAPI = require('./apis/expenseAPI');
const budgetAPI = require('./apis/budgetAPI');
const taxAPI = require('./apis/taxAPI');
const salaryAPI = require('./apis/salaryAPI');
const dashboardAPI = require('./apis/dashboardAPI');
const analyticsAPI = require('./apis/analyticsAPI');
const goalAPI = require('./apis/goalAPI');

// Load environment variables
dotenv.config();

// Connect to Database (non-blocking)
connectDB().catch(err => {
  console.warn('Database connection failed on startup, continuing without DB...');
});

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Indian Tax & Expense Planner API' });
});

// API Routes
app.use('/api/auth', authAPI);
app.use('/api/expenses', expenseAPI);
app.use('/api/budget', budgetAPI);
app.use('/api/tax', taxAPI);
app.use('/api/salary', salaryAPI);
app.use('/api/dashboard', dashboardAPI);
app.use('/api/analytics', analyticsAPI);
app.use('/api/goals', goalAPI);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
