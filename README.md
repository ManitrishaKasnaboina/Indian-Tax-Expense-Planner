# 💰 Indian Tax & Expense Planner

A modern MERN stack personal finance management web application for tracking expenses, managing budgets, analyzing salary slips, and optimizing Indian tax planning with interactive dashboards and analytics.

---

# 🚀 Features

## ✅ Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

---

## 💸 Expense Management
- Add Transactions
- Track Expenses
- Edit/Delete Expenses
- Expense Categories
- Expense Analytics

---

## 📊 Dashboard
- Total Balance
- Total Income
- Total Expenses
- Estimated Tax
- Financial Overview Charts
- Monthly Analytics

---

## 🧾 Tax Planner
- Old vs New Tax Regime Comparison
- Tax Calculation
- 80C Deduction Support
- 80D Deduction Support
- Tax Saving Suggestions

---

## 📁 Salary Analyzer
- Upload Salary Slips
- Salary Breakdown
- Tax Deduction Analysis

---

## 📈 Reports & Analytics
- Pie Charts
- Cash Flow Graphs
- Expense Reports
- Budget Tracking

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Recharts
- CSS / Tailwind CSS

---

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer

---

# 📂 Project Structure

```bash
INDIAN-TAX-EXPENSE-PLANNER/
│
├── backend/
│
└── frontend/
```

---

# 📂 Frontend Structure

```bash
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ExpenseCard.jsx
│   │   ├── BudgetCard.jsx
│   │   ├── Charts.jsx
│   │   └── SalaryUpload.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   ├── Budget.jsx
│   │   ├── TaxPlanner.jsx
│   │   ├── SalaryAnalyzer.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │
│   ├── context/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── package.json
```

---

# 📂 Backend Structure

```bash
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── expenseController.js
│   ├── budgetController.js
│   ├── taxController.js
│   └── salaryController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── uploadMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Expense.js
│   ├── Budget.js
│   ├── Tax.js
│   └── SalarySlip.js
│
├── routes/
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   ├── budgetRoutes.js
│   ├── taxRoutes.js
│   └── salaryRoutes.js
│
├── utils/
│   ├── calculateTax.js
│   └── generateToken.js
│
├── uploads/
│
├── .env
├── server.js
└── package.json
```

---

# 🔗 API Endpoints

## 🔐 Authentication APIs

```bash
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/update-profile
```

---

## 💸 Expense APIs

```bash
POST   /api/expenses/add
GET    /api/expenses
PUT    /api/expenses/update/:id
DELETE /api/expenses/delete/:id
GET    /api/expenses/summary/monthly
```

---

## 📊 Budget APIs

```bash
POST   /api/budget/create
GET    /api/budget
PUT    /api/budget/update/:id
DELETE /api/budget/delete/:id
```

---

## 🧾 Tax APIs

```bash
POST   /api/tax/calculate
GET    /api/tax/suggestions
POST   /api/tax/save
```

---

## 📁 Salary APIs

```bash
POST   /api/salary/upload
POST   /api/salary/analyze
GET    /api/salary/details
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/indian-tax-expense-planner.git
```

---

# 📦 Backend Setup

## Move to Backend Folder

```bash
cd backend
```

---

## Install Packages

```bash
npm install
```

---

## Install Required Packages

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer
```

---

## Run Backend

```bash
npm run server
```

OR

```bash
npm start
```

---

# 💻 Frontend Setup

## Move to Frontend Folder

```bash
cd frontend
```

---

## Install Packages

```bash
npm install
```

---

## Install Frontend Dependencies

```bash
npm install react-router-dom axios recharts react-hot-toast
```

---

## Run Frontend

```bash
npm run dev
```

---

# 🔐 Environment Variables

Create `.env` file inside backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key
```

---

# 📊 Dashboard Modules

- Financial Overview
- Expense Tracking
- Budget Management
- Tax Planner
- Salary Analyzer
- Analytics & Reports

---

# 🎨 UI Features

- Modern Dashboard
- Dark Theme
- Responsive Design
- Interactive Charts
- Professional Sidebar Navigation
- Card-based Layout

---

# 🏆 Project Highlights

✅ MERN Stack Project  
✅ Authentication System  
✅ Real-time Financial Analytics  
✅ Indian Tax Planning  
✅ Expense & Budget Tracking  
✅ Professional Fintech Dashboard  
✅ Resume-worthy Project  

---

# 📸 Screenshots

## Dashboard
- Total Balance
- Income
- Expenses
- Tax Overview
- Charts & Analytics

## Tax Planner
- Tax Comparison
- Deduction Management
- Tax Suggestions

## Expense Tracker
- Transaction History
- Expense Categories
- Budget Monitoring

---

# 📄 License

This project is for educational purposes.
