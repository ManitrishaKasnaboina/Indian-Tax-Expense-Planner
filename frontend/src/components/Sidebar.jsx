import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Receipt, PiggyBank, Calculator, FileText, BarChart3, Target, TrendingUp, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ListChecks size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} /> },
    { name: 'Budget', path: '/budget', icon: <PiggyBank size={20} /> },
    { name: 'Tax Planner', path: '/tax-planner', icon: <Calculator size={20} /> },
    { name: 'Salary Analyzer', path: '/salary-analyzer', icon: <FileText size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
  ];

  return (
    <div className="w-[260px] bg-surface border-r border-glass-border flex flex-col p-6">
      <div className="mb-10 pl-2">
        <h2 className="text-2xl font-bold">
          Tax<span className="text-accent">Planner</span>
        </h2>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-decoration-none transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white font-semibold' 
                  : 'text-slate-400 font-medium hover:bg-surface-hover hover:text-slate-200'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-glass-border pt-6 flex flex-col gap-2">
        <Link 
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-decoration-none transition-all duration-200 ${
            location.pathname === '/settings' 
              ? 'bg-primary text-white font-semibold' 
              : 'text-slate-400 font-medium hover:bg-surface-hover hover:text-slate-200'
          }`}
        >
          <Settings size={20} /> Settings
        </Link>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3.5 bg-transparent border-none text-danger cursor-pointer text-left rounded-lg w-full text-base font-medium hover:bg-danger/10 hover:text-danger-hover transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
