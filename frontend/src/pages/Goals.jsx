import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, CheckCircle2 } from 'lucide-react';
import goalService from '../services/goalService';
import { NotificationContext } from '../context/NotificationContext';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '', deadline: '' });
  const [addFundsGoal, setAddFundsGoal] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err) {
      addNotification('Failed to load goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await goalService.createGoal({
        ...newGoal,
        targetAmount: Number(newGoal.targetAmount)
      });
      addNotification('Goal created successfully', 'success');
      setShowForm(false);
      setNewGoal({ title: '', targetAmount: '', deadline: '' });
      fetchGoals();
    } catch (err) {
      addNotification('Failed to create goal', 'error');
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    try {
      await goalService.addFundsToGoal(addFundsGoal._id, Number(fundAmount));
      addNotification('Funds added successfully', 'success');
      setAddFundsGoal(null);
      setFundAmount('');
      fetchGoals();
    } catch (err) {
      addNotification('Failed to add funds', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      addNotification('Goal deleted', 'success');
      fetchGoals();
    } catch (err) {
      addNotification('Failed to delete goal', 'error');
    }
  };

  if (loading) return <div className="text-center mt-20 text-slate-400">Loading goals...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Financial Goals</h1>
          <p className="text-slate-400 mt-1">Set targets and track your progress to financial freedom.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary inline-flex items-center gap-2">
          <Plus size={18} /> New Goal
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 overflow-hidden"
          >
            <h3 className="text-xl font-semibold mb-4">Create New Goal</h3>
            <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                required
                placeholder="Goal Title (e.g. Emergency Fund)"
                className="input-field"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <input
                type="number"
                required
                placeholder="Target Amount (₹)"
                className="input-field"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              />
              <input
                type="date"
                required
                className="input-field"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
              <button type="submit" className="btn btn-primary h-full">Save Goal</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const isCompleted = goal.status === 'completed';
          
          return (
            <div key={goal._id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{goal.title}</h3>
                      <p className="text-sm text-slate-400">Target: ₹{goal.targetAmount.toLocaleString('en-IN')} by {new Date(goal.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(goal._id)} className="text-slate-500 hover:text-danger">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-6 mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">₹{goal.currentAmount.toLocaleString('en-IN')} saved</span>
                  <span className="font-semibold">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-success' : 'bg-primary'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {!isCompleted && (
                <div className="mt-6 pt-6 border-t border-glass-border">
                  {addFundsGoal?._id === goal._id ? (
                    <form onSubmit={handleAddFunds} className="flex gap-3">
                      <input
                        type="number"
                        required
                        placeholder="Amount to add"
                        className="input-field py-2 text-sm"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary py-2 px-4 text-sm">Add</button>
                      <button type="button" onClick={() => setAddFundsGoal(null)} className="btn btn-outline py-2 px-4 text-sm">Cancel</button>
                    </form>
                  ) : (
                    <button onClick={() => setAddFundsGoal(goal)} className="text-primary text-sm font-semibold hover:underline">
                      + Add Funds
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Goals;
