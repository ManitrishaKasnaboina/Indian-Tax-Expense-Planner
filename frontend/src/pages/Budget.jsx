import React, { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import { Target, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');

  const fetchBudgets = async () => {
    try {
      // Backend automatically maps actual spent when fetching GET /api/budget
      const data = await budgetService.getBudgets();
      setBudgets(data);
    } catch (err) {
      setError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
      const now = new Date();
      await budgetService.setBudgetLimit({ 
        category, 
        limit: Number(limit),
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
      setLimit('');
      fetchBudgets();
    } catch (err) {
      setError('Failed to set budget');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl m-0">Monthly Budget</h1>
        <p className="text-slate-400 mt-1 mb-0">Set limits and monitor your category spending.</p>
        {error && <p className="text-danger mt-1">{error}</p>}
      </div>

      <div className="flex gap-8 flex-wrap">
        {/* Set Budget Form */}
        <div className="glass-card flex-1 min-w-[300px] self-start">
          <h3 className="mb-6 flex items-center gap-2"><Target size={20} /> Set Category Limit</h3>
          <form onSubmit={handleSetBudget} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-sm">Category</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Transportation">Transportation</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm">Monthly Limit (₹)</label>
              <input type="number" className="input-field" value={limit} onChange={e => setLimit(e.target.value)} required min="1" />
            </div>
            <button type="submit" className="btn btn-primary mt-2">Save Limit</button>
          </form>
        </div>

        {/* Budget Progress List */}
        <div className="glass-card flex-[2] min-w-[400px]">
          <h3 className="mb-6">Current Budgets</h3>
          {loading ? (
            <p className="text-slate-400">Loading budgets...</p>
          ) : budgets.length === 0 ? (
            <p className="text-slate-400">No budget limits set for this month.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {budgets.map((b) => {
                const percentage = Math.min(100, Math.round(((b.spent || 0) / b.limit) * 100));
                const isWarning = percentage >= 80;
                const isDanger = percentage >= 100;
                
                return (
                  <div key={b._id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{b.category}</span>
                      <span className="text-sm">
                        ₹{(b.spent || 0).toLocaleString()} / ₹{b.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ease-in-out ${
                        isDanger ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-primary'
                      }`} style={{ width: `${percentage}%` }}></div>
                    </div>
                    {isDanger && (
                      <p className="flex items-center gap-1 text-danger text-xs mt-1">
                        <AlertCircle size={12} /> Limit exceeded
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Budget;
