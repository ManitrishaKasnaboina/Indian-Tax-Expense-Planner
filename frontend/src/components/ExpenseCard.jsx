import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ExpenseCard = ({ title, amount, percentage, isPositive }) => {
  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-400 text-base font-medium m-0">
          {title || "Total Expenses"}
        </h3>
        <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${
          isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {percentage}%
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold m-0">
          ₹{amount?.toLocaleString('en-IN') || 0}
        </h2>
        <p className="text-slate-400 text-sm mt-1">Compared to last month</p>
      </div>
    </div>
  );
};

export default ExpenseCard;
