import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ExpenseOverview from '../components/ExpenseOverview';
import Charts from '../components/Charts';
import dashboardService from '../services/dashboardService';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [categoryPie, setCategoryPie] = useState([]);
  const [budgetVsActual, setBudgetVsActual] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const lineChartData = [
    { name: 'Dec', income: 42000, expense: 16000 },
    { name: 'Jan', income: 56000, expense: 19000 },
    { name: 'Feb', income: 52000, expense: 21000 },
    { name: 'Mar', income: 64000, expense: 22000 },
    { name: 'Apr', income: 58000, expense: 18000 },
    { name: 'May', income: 68750, expense: 24350 }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryData, chartData] = await Promise.all([
          dashboardService.getDashboardSummary(),
          dashboardService.getChartData()
        ]);

        const totalIncome = summaryData?.taxSummary?.annualGrossIncome || 320000;
        const totalExpenses = summaryData?.expenseSummary?.totalSpent || 74370;
        const balance = totalIncome - totalExpenses;

        setSummary({
          balance,
          totalIncome,
          totalExpenses,
          taxLiability: summaryData?.taxSummary?.taxLiability || 215800,
          effectiveRate: summaryData?.taxSummary?.annualGrossIncome ? ((summaryData.taxSummary.taxLiability / summaryData.taxSummary.annualGrossIncome) * 100).toFixed(1) : 12.0,
          overallBudget: summaryData?.budgetSummary?.budgetLimit || 45000,
          usedBudget: totalExpenses,
          remainingBudget: Math.max((summaryData?.budgetSummary?.budgetLimit || 45000) - totalExpenses, 0),
          lastMonthChange: 12.5
        });

        setCategoryPie(chartData.categoryPie?.length ? chartData.categoryPie : [
          { name: 'Food & Dining', value: 18450 },
          { name: 'Transport', value: 12650 },
          { name: 'Shopping', value: 10320 },
          { name: 'Bills & Utilities', value: 8910 },
          { name: 'Entertainment', value: 6250 },
          { name: 'Others', value: 17790 }
        ]);

        setBudgetVsActual(chartData.budgetVsActual?.length ? chartData.budgetVsActual : [
          { category: 'Food & Dining', limit: 25000, spent: 18450 },
          { category: 'Transport', limit: 15000, spent: 12650 },
          { category: 'Shopping', limit: 14000, spent: 10320 },
          { category: 'Bills & Utilities', limit: 12000, spent: 8910 }
        ]);
      } catch (err) {
        setError('Failed to load dashboard data. Showing mock values.');
        setSummary({
          balance: 245630,
          totalIncome: 320000,
          totalExpenses: 74370,
          taxLiability: 215800,
          effectiveRate: 12.0,
          overallBudget: 45000,
          usedBudget: 32400,
          remainingBudget: 12600,
          lastMonthChange: 12.5
        });
        setCategoryPie([
          { name: 'Food & Dining', value: 18450 },
          { name: 'Transport', value: 12650 },
          { name: 'Shopping', value: 10320 },
          { name: 'Bills & Utilities', value: 8910 },
          { name: 'Entertainment', value: 6250 },
          { name: 'Others', value: 17790 }
        ]);
        setBudgetVsActual([
          { category: 'Food & Dining', limit: 25000, spent: 18450 },
          { category: 'Transport', limit: 15000, spent: 12650 },
          { category: 'Shopping', limit: 14000, spent: 10320 },
          { category: 'Bills & Utilities', limit: 12000, spent: 8910 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalCategoryValue = categoryPie.reduce((sum, entry) => sum + entry.value, 0);

  const topCategories = categoryPie.slice(0, 4).map(item => ({
    name: item.name,
    amount: item.value,
    percentage: totalCategoryValue ? Math.round((item.value / totalCategoryValue) * 100) : 0
  }));

  if (loading) {
    return <div className="text-center mt-20 text-slate-400">Loading your financial overview...</div>;
  }

  if (!user?.monthlyIncome) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6"
      >
        <div className="glass-card p-12 max-w-lg flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/20 p-6 mb-2">
            <span className="text-4xl">💰</span>
          </div>
          <h2 className="text-3xl font-semibold m-0">Welcome, {user?.name || 'User'}!</h2>
          <p className="text-slate-400 mt-2 mb-4 text-lg">
            To get started with your financial dashboard and tax planning, please tell us your monthly income.
          </p>
          <button onClick={() => navigate('/settings')} className="btn btn-primary px-8 py-3 text-lg">
            Set Monthly Income
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back, {user?.name || 'Dharani'} <span aria-hidden="true">👋</span></h1>
          <p className="text-slate-400 mt-2">Here&apos;s what&apos;s happening with your finances today.</p>
          {error && <p className="text-warning text-sm mt-3">{error}</p>}
        </div>
        <button onClick={() => navigate('/transactions')} className="btn btn-primary inline-flex items-center gap-2 px-5 py-3">
          <Plus size={18} /> Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass-card p-6 bg-slate-950/60 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Balance</p>
              <h2 className="text-3xl font-semibold mt-3">₹{summary.balance.toLocaleString('en-IN')}</h2>
            </div>
            <div className="rounded-3xl bg-slate-800 p-4 text-slate-100">₹</div>
          </div>
          <p className="text-sm text-slate-400 mt-4">{summary.lastMonthChange}% vs last month</p>
        </div>

        <div className="glass-card p-6 bg-emerald-950/40 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-200">Total Income</p>
              <h2 className="text-3xl font-semibold mt-3 text-white">₹{summary.totalIncome.toLocaleString('en-IN')}</h2>
            </div>
            <div className="rounded-3xl bg-emerald-900 p-4 text-white">💼</div>
          </div>
          <p className="text-sm text-emerald-300 mt-4">8.3% vs last month</p>
        </div>

        <div className="glass-card p-6 bg-rose-950/40 border border-rose-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-200">Total Expenses</p>
              <h2 className="text-3xl font-semibold mt-3 text-white">₹{summary.totalExpenses.toLocaleString('en-IN')}</h2>
            </div>
            <div className="rounded-3xl bg-rose-900 p-4 text-white">🛍️</div>
          </div>
          <p className="text-sm text-rose-300 mt-4">6.1% vs last month</p>
        </div>

        <div className="glass-card p-6 bg-slate-950/70 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Est. Tax Liability (FY 24-25)</p>
              <h2 className="text-3xl font-semibold mt-3">₹{summary.taxLiability.toLocaleString('en-IN')}</h2>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4 text-slate-100">TAX</div>
          </div>
          <p className="text-sm text-slate-400 mt-4">Effective Tax Rate: {summary.effectiveRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Expense Overview</h3>
              <p className="text-slate-400 text-sm mt-1">Breakdown by category</p>
            </div>
            <select className="input-field w-auto">
              <option>May 2024</option>
              <option>June 2024</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            <div className="flex items-center justify-center">
              <ExpenseOverview data={categoryPie} />
            </div>
            <div className="space-y-4">
              {categoryPie.slice(0, 6).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between gap-4 rounded-3xl border border-glass-border bg-slate-950/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#22C55E'][idx % 6] }} />
                    <div>
                      <p className="text-sm text-slate-300">{item.name}</p>
                      <p className="text-sm text-slate-500">₹{item.value.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">{totalCategoryValue ? Math.round((item.value / totalCategoryValue) * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Cash Flow Overview</h3>
              <p className="text-slate-400 text-sm mt-1">Income vs expenses over time</p>
            </div>
            <select className="input-field w-auto">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <Charts data={lineChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="glass-card p-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-glass-border p-5 bg-slate-950/50">
            <p className="text-sm text-slate-400 uppercase tracking-[0.18em]">Overall Budget</p>
            <h3 className="text-2xl font-semibold mt-3">₹{summary.overallBudget.toLocaleString('en-IN')}</h3>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min((summary.usedBudget / Math.max(summary.overallBudget, 1)) * 100, 100)}%` }} />
            </div>
            <div className="mt-4 flex justify-between text-sm text-slate-400">
              <span>Used: ₹{summary.usedBudget.toLocaleString('en-IN')}</span>
              <span>Remaining: ₹{summary.remainingBudget.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="rounded-3xl border border-glass-border p-5 bg-slate-950/50">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-400 uppercase tracking-[0.18em]">Top Spending Categories</p>
            </div>
            <div className="space-y-3">
              {topCategories.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-200">{item.name}</p>
                    <p className="text-xs text-slate-500">₹{item.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-sm text-slate-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-200/80">Tax Saving Tip</p>
              <h3 className="text-xl font-semibold mt-3">Save up to ₹46,800 in taxes</h3>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">💰</div>
          </div>
          <p className="mt-4 text-slate-200/90">You can save more by investing in Section 80C and optimizing deductions.</p>
          <button className="btn btn-primary mt-6 bg-white text-indigo-700 hover:bg-slate-100 border-none">Explore Deductions</button>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Recent Transactions</h3>
            <p className="text-slate-400 text-sm mt-1">Latest records from your wallet.</p>
          </div>
          <button onClick={() => navigate('/transactions')} className="text-primary text-sm font-semibold">View All Transactions →</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-[0.15em]">
                <th className="pb-4">Date</th>
                <th className="pb-4">Description</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Type</th>
                <th className="pb-4 text-right">Amount</th>
                <th className="pb-4">Method</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '21 May 2024', description: 'Grocery Shopping', category: 'Food & Dining', type: 'Expense', amount: '-1,250', method: 'UPI' },
                { date: '20 May 2024', description: 'Salary Credit', category: 'Salary', type: 'Income', amount: '+68,750', method: 'Bank Transfer' }
              ].map((item) => (
                <tr key={item.description} className="bg-white/5 rounded-3xl border border-glass-border mb-3">
                  <td className="py-4 pr-6 text-sm text-slate-300">{item.date}</td>
                  <td className="py-4 pr-6 text-sm text-slate-200">{item.description}</td>
                  <td className="py-4 pr-6 text-sm text-slate-200">{item.category}</td>
                  <td className="py-4 pr-6">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className={`py-4 pr-6 text-right text-sm font-semibold ${item.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{item.amount.replace('₹', '')}
                  </td>
                  <td className="py-4 text-sm text-slate-300">{item.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
