# Indian Tax & Expense Planner - Backend API

This repository contains the backend service for the **Indian Tax & Expense Planner** application. It provides a RESTful API architecture to handle secure user authentication, financial data storage, real-time tax calculations, budgeting, and PDF parsing capabilities for automated salary slip analysis.

---

## 🚀 Comprehensive Feature Set
- **Secure Authentication:** JWT-based user authentication and bcrypt password hashing.
- **RESTful Architecture:** Structured and predictable API routes for all resources (Expenses, Budgets, Goals).
- **Tax Calculation Engine:** Logic to calculate and compare Indian Tax regimes (Old vs. New) based on dynamically provided user inputs and salary structures.
- **PDF Parsing:** Integrates `pdf-parse` and `multer` to accept uploaded PDF salary slips, extract text, and parse out core salary components (Basic, HRA, Allowances, PF).
- **MongoDB Integration:** Persistent data storage using MongoDB and Mongoose ODM with robust schema validation.

---

## 📁 Detailed Project Structure

```text
backend/
├── apis/                 # Route definitions. Maps URLs to specific controller functions.
│   ├── authAPI.js        # /api/auth routes (register, login, profile)
│   ├── dashboardAPI.js   # /api/dashboard routes (summary metrics, charts)
│   ├── expenseAPI.js     # /api/expenses routes (CRUD for transactions)
│   ├── budgetAPI.js      # /api/budget routes (budget limits by category)
│   ├── taxAPI.js         # /api/tax routes (tax projections and comparisons)
│   ├── salaryAPI.js      # /api/salary routes (PDF upload and processing)
│   └── goalAPI.js        # /api/goals routes (financial targets)
├── config/               
│   └── db.js             # Mongoose connection logic to MongoDB
├── controllers/          # Core business logic for handling requests & responses
│   ├── authController.js     # Handles login, registration, token generation
│   ├── expenseController.js  # Expense tracking logic
│   ├── salaryController.js   # PDF extraction algorithms and regex matching
│   └── (others)
├── middleware/           
│   ├── authMiddleware.js # Verifies JWT tokens to protect private routes
│   └── errorMiddleware.js# Global error handlers for 404s and 500s
├── models/               # Mongoose Database Schemas
│   ├── User.js           # Stores credentials, profile, and default tax parameters
│   ├── Expense.js        # Transaction history (amount, category, date)
│   ├── Goal.js           # Savings goals tracking
│   └── (others)
├── uploads/              # Temporary local storage for uploaded PDF files before processing
├── server.js             # Application entry point. Initializes Express, middleware, routes
└── package.json          # Node.js dependencies and script definitions
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB (Running locally or a MongoDB Atlas URI)

### 1. Installation
Clone the repository and navigate to the backend folder:
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `backend` directory. The application requires these keys to function correctly:

```env
# Application environment (development/production)
NODE_ENV=development

# The port the Express server will run on
PORT=5000

# MongoDB Connection String (Update if using MongoDB Atlas)
MONGO_URI=mongodb://localhost:27017/taxplanner

# Secret key used for signing JWT tokens (make this a long, random string in production)
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Running the Server
**For Development:**
Runs the server with `nodemon`, which automatically restarts the server when file changes are detected.
```bash
npm run dev
```

**For Production:**
Runs the application with standard Node.
```bash
npm start
```

---

## 🔌 Detailed API Endpoints

*Note: All endpoints (except login/register) require a valid JWT token passed in the `Authorization: Bearer <token>` header.*

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate a user and receive a JWT.
- `GET /api/auth/profile`: Get logged-in user's profile details.

### Expenses (`/api/expenses`)
- `GET /api/expenses`: Retrieve all expenses for the user.
- `POST /api/expenses`: Add a new expense (Requires amount, category, date, type).
- `DELETE /api/expenses/:id`: Delete a specific expense.

### Salary Analyzer (`/api/salary`)
- `POST /api/salary/upload`: Accepts `multipart/form-data` with a `file` field. Uploads a PDF salary slip, parses it, and returns extracted structured data (Basic, HRA, PF, etc.).

### Tax Planner (`/api/tax`)
- `POST /api/tax/calculate`: Calculate tax liabilities based on provided income and deductions.
- `GET /api/tax/profile`: Get user's saved tax preferences.

### Budget & Goals (`/api/budget`, `/api/goals`)
- `GET /api/budget` & `POST /api/budget`: Manage monthly budget limits.
- `GET /api/goals` & `POST /api/goals`: Manage financial targets.

---

## 📦 Core Dependencies
- **express**: Web framework.
- **mongoose**: MongoDB object modeling.
- **jsonwebtoken**: For generating auth tokens.
- **bcryptjs**: Password hashing for security.
- **multer**: Handling file uploads (Salary PDFs).
- **pdf-parse**: Extracting text from PDF files.
- **dotenv**: Loading environment variables.
- **cors**: Handling Cross-Origin Resource Sharing for the frontend.
