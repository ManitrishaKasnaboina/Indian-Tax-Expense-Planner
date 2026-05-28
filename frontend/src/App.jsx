import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Notification from './components/Notification';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budget';
import TaxPlanner from './pages/TaxPlanner';
import SalaryAnalyzer from './pages/SalaryAnalyzer';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Notification />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/tax-planner" element={<ProtectedRoute><TaxPlanner /></ProtectedRoute>} />
          <Route path="/salary-analyzer" element={<ProtectedRoute><SalaryAnalyzer /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
