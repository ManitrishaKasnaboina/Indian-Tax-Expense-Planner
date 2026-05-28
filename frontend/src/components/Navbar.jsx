import { Bell, Search, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-[70px] bg-surface border-b border-glass-border flex items-center justify-between px-8">
      <div className="relative w-[300px]">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search transactions, budgets..." 
          className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-glass-border rounded-full text-slate-100 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="bg-transparent border-none text-slate-400 cursor-pointer relative hover:text-slate-200 transition-colors">
          <Bell size={22} />
          <span className="absolute -top-0.5 -right-0.5 bg-danger w-2 h-2 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right">
            <p className="m-0 text-sm font-semibold">{user?.name || 'User'}</p>
            <p className="m-0 text-xs text-slate-400">Free Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
