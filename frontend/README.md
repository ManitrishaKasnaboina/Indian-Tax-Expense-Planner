# Indian Tax & Expense Planner - Frontend

This repository contains the React frontend for the **Indian Tax & Expense Planner** application. It is built to offer a highly responsive, animated, and visually striking user experience utilizing a modern Glassmorphism design system. 

It allows users to track expenses, manage monthly budgets, set financial goals, upload and analyze salary slips via PDF, and proactively plan their Indian income taxes.

---

## 🚀 Comprehensive Feature Set
- **Dynamic Dashboard:** A central hub showing overall financial health, recent transactions, and monthly savings trends.
- **Tax Planner Module:** Interactive calculators to compare the Old vs. New Indian tax regimes dynamically as income and deductions are entered.
- **Salary Analyzer:** An interface to upload PDF salary slips. It communicates with the backend to parse out Basic Pay, HRA, PF, etc., and auto-fills the tax planner.
- **Expense & Budget Tracking:** Real-time logging of transactions with visual indicators of budget utilization per category.
- **Financial Goals:** A module for setting savings targets and tracking progress visually.
- **Glassmorphism UI:** A custom-built design system using Tailwind CSS and Framer Motion to provide a premium, modern aesthetic with fluid micro-animations.

---

## 📁 Detailed Project Structure

```text
frontend/
├── public/                 # Static assets (favicons, manifest, external images)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Top navigation header (user profile, theme toggles)
│   │   ├── Sidebar.jsx     # Side navigation menu with active route highlighting
│   │   ├── Charts.jsx      # Recharts wrappers for Bar/Line/Pie visualisations
│   │   ├── ExpenseCard.jsx # UI card for individual transaction items
│   │   └── Notification.jsx# Global toast notification component
│   ├── context/            # React Context Providers for global state management
│   │   ├── AuthContext.jsx # Manages user login state, JWT storage, and logout
│   │   └── NotificationContext.jsx # Manages global app success/error toasts
│   ├── pages/              # Main Route Views
│   │   ├── Dashboard.jsx   # Overview of finances
│   │   ├── Expenses.jsx    # Transaction list and add-expense form
│   │   ├── TaxPlanner.jsx  # Tax calculation interfaces
│   │   ├── SalaryAnalyzer.jsx # Drag-and-drop PDF upload UI
│   │   ├── Budget.jsx      # Monthly category budget management
│   │   ├── Goals.jsx       # Savings targets management
│   │   ├── Login.jsx       # User authentication view
│   │   └── Register.jsx    # User registration view
│   ├── services/           # API interaction layer (Axios instances)
│   │   ├── api.js          # Base Axios configuration with auth interceptors
│   │   ├── authService.js  # API calls for login/register
│   │   └── (others)        # Services mapping to backend endpoints
│   ├── App.jsx             # Root React component containing React Router configuration
│   ├── App.css             # Global CSS Variables for the Glassmorphism Theme
│   ├── index.css           # Tailwind CSS directives entry point
│   └── main.jsx            # React mounting file
├── package.json            # Node.js dependencies and script definitions
├── tailwind.config.js      # Tailwind theme configuration and custom colors
└── vite.config.js          # Vite build tool configuration
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- Node.js (v16 or higher recommended)
- Backend server running (see Backend README)

### 1. Installation
Clone the repository and navigate to the frontend folder:
```bash
cd frontend
npm install
```

### 2. Configuration
The application connects to the backend API via Axios. The base URL is configured in `src/services/api.js`. 
By default, it expects the backend to be running on `http://localhost:5000/api`. If you are running the backend on a different port or in a production environment, you must update the `baseURL` in `api.js` or configure an environment variable.

### 3. Running the Development Server
Starts the Vite development server with extremely fast Hot Module Replacement (HMR).
```bash
npm run dev
```
Once running, open your browser and navigate to `http://localhost:5173/`.

---

## 💻 Available NPM Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Bundles the React application for production. Outputs optimized, minified HTML/CSS/JS files to the `dist` directory.
- `npm run preview`: Starts a lightweight local web server to serve the `dist` directory, allowing you to test the production build locally before deployment.
- `npm run lint`: Runs ESLint over the `src` directory to catch syntax errors or style guide violations.

---

## 🎨 Design System & Styling

This app does not rely on a heavy component library like Material-UI. Instead, it utilizes a custom **Glassmorphism** design system built natively with **Tailwind CSS**.

- **CSS Variables:** Core colors (`--primary`, `--accent`, `--surface`) are defined in `src/App.css`. This allows for easy theme switching (e.g., dark mode/light mode).
- **Glass Cards:** Elements use translucent backgrounds (`bg-white/10` or `bg-surface`), backdrop blurs (`backdrop-blur-md`), and subtle borders to create a frosted glass effect.
- **Animations:** Almost every page transition, button hover, and list rendering uses `framer-motion` for smooth, modern micro-interactions (`<motion.div>`).

---

## 📦 Core Dependencies
- **react** & **react-dom**: Core library.
- **react-router-dom**: Declarative routing for React web apps.
- **framer-motion**: Production-ready animation library.
- **recharts**: Composable charting library built on React components.
- **axios**: Promise-based HTTP client for the browser.
- **lucide-react**: Beautiful & consistent icon toolkit.
- **tailwindcss**: Utility-first CSS framework for rapid UI development.
- **vite**: Next generation frontend tooling (fast build tool).
