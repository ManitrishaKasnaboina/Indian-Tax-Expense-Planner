import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Lock, Save, Sparkles } from 'lucide-react';
import taxService from '../services/taxService';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [taxRegime, setTaxRegime] = useState('new');
  const [financialYear, setFinancialYear] = useState('2025-26');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMonthlyIncome(user.monthlyIncome || 0);
      setTaxRegime(user.taxRegime || 'new');
      setFinancialYear(user.financialYear || '2025-26');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedData = await taxService.updateTaxProfile({
        name,
        monthlyIncome: Number(monthlyIncome),
        taxRegime,
        financialYear
      });

      // Update AuthContext state
      setUser(prev => ({
        ...prev,
        ...updatedData
      }));

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await taxService.updateTaxProfile({
        password: newPassword
      });

      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col gap-8"
    >
      <div>
        <h1 className="text-3xl m-0 flex items-center gap-2">
          <SettingsIcon className="text-primary animate-pulse" size={28} /> Settings
        </h1>
        <p className="text-slate-400 mt-1 mb-0">Manage your profile, account settings, and tax preferences.</p>
        
        {error && (
          <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm mt-4 border border-danger/20">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-success/10 text-success p-4 rounded-xl text-sm mt-4 border border-success/20">
            {success}
          </div>
        )}
      </div>

      <div className="flex gap-8 flex-wrap">
        {/* Profile Settings Card */}
        <div className="glass-card flex-1 min-w-[340px] flex flex-col gap-6">
          <h3 className="m-0 flex items-center gap-2 border-b border-glass-border pb-4">
            <User className="text-primary" size={20} /> User Profile & Tax Settings
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-sm text-slate-300">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm text-slate-300">Monthly Income (₹)</label>
              <input 
                type="number" 
                className="input-field" 
                value={monthlyIncome} 
                onChange={e => setMonthlyIncome(e.target.value)} 
                required 
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-slate-300">Default Tax Regime</label>
                <select 
                  className="input-field" 
                  value={taxRegime} 
                  onChange={e => setTaxRegime(e.target.value)}
                >
                  <option value="new">New Regime</option>
                  <option value="old">Old Regime</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-300">Financial Year</label>
                <select 
                  className="input-field" 
                  value={financialYear} 
                  onChange={e => setFinancialYear(e.target.value)}
                >
                  <option value="2025-26">FY 2025-26</option>
                  <option value="2024-25">FY 2024-25</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4 flex items-center justify-center gap-2" disabled={loading}>
              <Save size={18} /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="glass-card flex-1 min-w-[340px] flex flex-col gap-6">
          <h3 className="m-0 flex items-center gap-2 border-b border-glass-border pb-4">
            <Lock className="text-secondary" size={20} /> Security & Password
          </h3>
          
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-sm text-slate-300">New Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                placeholder="Minimum 6 characters"
                minLength="6"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">Confirm New Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                placeholder="Confirm password"
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-gradient mt-4 flex items-center justify-center gap-2" disabled={loading}>
              <Sparkles size={18} /> {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
