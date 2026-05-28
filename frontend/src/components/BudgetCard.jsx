import { PieChart } from 'lucide-react';

const BudgetCard = ({ totalBudget, usedAmount }) => {
  const percentage = Math.min(100, Math.round(((usedAmount || 0) / (totalBudget || 1)) * 100));
  
  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-400 text-base font-medium m-0">
          Monthly Budget
        </h3>
        <div className="bg-primary/10 p-2 rounded-full text-primary">
          <PieChart size={20} />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold m-0">
          ₹{(usedAmount || 0).toLocaleString('en-IN')} <span className="text-base text-slate-400 font-normal">/ ₹{(totalBudget || 0).toLocaleString('en-IN')}</span>
        </h2>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-2">
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-slate-300">Budget Used</span>
          <span className="font-semibold">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
              percentage > 90 ? 'bg-danger' : percentage > 75 ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
