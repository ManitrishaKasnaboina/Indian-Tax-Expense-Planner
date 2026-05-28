import React, { useState, useEffect, useContext, useRef } from 'react';
import expenseService from '../services/expenseService';
import { NotificationContext } from '../context/NotificationContext';
import { Plus, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Expenses = () => {
  const { addNotification } = useContext(NotificationContext);
  const formRef = useRef(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getExpenses();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses. Please log in again or check your connection.');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await expenseService.addExpense({ type, description: title, amount: Number(amount), category, date });
      setTitle('');
      setAmount('');
      setType('expense');
      setError('');
      const typeLabel = type === 'income' ? 'Income' : 'Expense';
      const verb = type === 'income' ? 'added' : 'recorded';
      addNotification(`${typeLabel} ${verb}: ₹${Number(amount).toLocaleString('en-IN')} in ${category}`, 'success');
      fetchExpenses(); // Refresh list
    } catch (err) {
      const errorMessage = 'Failed to add transaction.';
      setError(errorMessage);
      addNotification(errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      setError('');
      addNotification('Transaction deleted successfully', 'success');
      fetchExpenses(); // Refresh list
    } catch (err) {
      const errorMessage = 'Failed to delete transaction.';
      setError(errorMessage);
      addNotification(errorMessage, 'error');
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const term = searchTerm.trim().toLowerCase();
    const title = (expense.description || '').toString().toLowerCase();
    const categoryValue = (expense.category || '').toString().toLowerCase();
    const typeValue = (expense.type || '').toString().toLowerCase();
    return (
      title.includes(term) ||
      categoryValue.includes(term) ||
      typeValue.includes(term)
    );
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold m-0">Transactions</h1>
          <p className="text-slate-400 mt-1 mb-0">Track income and expenses with category, type and amount details.</p>
          {error && <p className="text-danger mt-3">{error}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions, expenses..."
              className="input-field pl-11 pr-4 w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Add Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-8">
        <div ref={formRef} className="glass-card p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Add Transaction</h3>
            <span className="text-slate-400 text-sm">New entry</span>
          </div>

          <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-sm text-slate-300">Type</label>
              <select className="input-field" value={type} onChange={e => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm text-slate-300">Title</label>
              <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="E.g., Grocery Shopping" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-slate-300">Amount (₹)</label>
                <input type="number" className="input-field" value={amount} onChange={e => setAmount(e.target.value)} required min="1" />
              </div>
              <div>
                <label className="block mb-2 text-sm text-slate-300">Category</label>
                <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Food">Food</option>
                  <option value="Housing">Housing</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Salary">Salary</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm text-slate-300">Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary mt-2">Add Transaction</button>
          </form>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              <p className="text-slate-400 text-sm mt-1">Latest entries sorted by date.</p>
            </div>
            <span className="text-slate-400 text-sm">{filteredExpenses.length} items</span>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading transactions...</p>
          ) : filteredExpenses.length === 0 ? (
            <p className="text-slate-400">No transactions found. Add your first one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase tracking-[0.15em]">
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Type</th>
                    <th className="pb-4 text-right">Amount</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="bg-white/5 rounded-3xl border border-glass-border mb-3">
                      <td className="py-4 pr-6 text-sm text-slate-300">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-4 pr-6 text-sm text-slate-200">{expense.description}</td>
                      <td className="py-4 pr-6">
                        <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100">{expense.category}</span>
                      </td>
                      <td className="py-4 pr-6">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${expense.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}
                        </span>
                      </td>
                      <td className={`py-4 pr-6 text-right text-sm font-semibold ${expense.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {expense.type === 'income' ? '+' : '-'} ₹{expense.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => handleDelete(expense._id)} className="rounded-full border border-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-800 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Expenses;
