import React, { useState, useEffect } from 'react';
import taxService from '../services/taxService';
import { Calculator, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const TaxPlanner = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [taxRegime, setTaxRegime] = useState('new');
  const [sec80C, setSec80C] = useState(0);
  const [sec80D, setSec80D] = useState(0);

  const fetchOverview = async () => {
    try {
      const data = await taxService.getTaxOverview();
      setOverview(data);
      // Pre-fill form with existing user data if overview doesn't have it all, but we can just use overview's grossIncome
      setMonthlyIncome(data.grossIncome / 12);
      setTaxRegime(data.selectedRegime);
    } catch (err) {
      setError('Failed to load tax overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    
    // Attempt to pre-fill deductions from local storage if available
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.deductions) {
          setSec80C(user.deductions.section80C || 0);
          setSec80D(user.deductions.section80D || 0);
        }
      } catch(e){}
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await taxService.updateTaxProfile({
        monthlyIncome: Number(monthlyIncome),
        taxRegime,
        deductions: {
          section80C: Number(sec80C),
          section80D: Number(sec80D)
        }
      });
      fetchOverview(); // Refresh calculations
    } catch (err) {
      setError('Failed to update tax profile');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl m-0">Tax Planner</h1>
        <p className="text-slate-400 mt-1 mb-0">Calculate and optimize your taxes based on the latest regimes.</p>
        {error && <p className="text-danger mt-1">{error}</p>}
      </div>

      <div className="flex gap-8 flex-wrap">
        
        {/* Input Form */}
        <div className="glass-card flex-1 min-w-[300px]">
          <h3 className="mb-6 flex items-center gap-2"><Calculator size={20} /> Financial Profile</h3>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div>
              <label className="block mb-2 text-sm">Monthly Income (₹)</label>
              <input type="number" className="input-field" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} required min="0" />
            </div>
            <div>
              <label className="block mb-2 text-sm">Preferred Tax Regime</label>
              <select className="input-field" value={taxRegime} onChange={e => setTaxRegime(e.target.value)}>
                <option value="new">New Regime (Default)</option>
                <option value="old">Old Regime</option>
              </select>
            </div>
            
            <h4 className="mt-4 mb-2 pb-2 border-b border-glass-border">Deductions (Old Regime)</h4>
            <div>
              <label className="block mb-2 text-sm">Section 80C (Max ₹1.5L)</label>
              <input type="number" className="input-field" value={sec80C} onChange={e => setSec80C(e.target.value)} min="0" />
            </div>
            <div>
              <label className="block mb-2 text-sm">Section 80D (Health Ins.)</label>
              <input type="number" className="input-field" value={sec80D} onChange={e => setSec80D(e.target.value)} min="0" />
            </div>
            
            <button type="submit" className="btn btn-primary mt-4">Calculate & Save</button>
          </form>
        </div>

        {/* Results Display */}
        <div className="flex-[2] min-w-[400px] flex flex-col gap-6">
          {loading ? (
            <div className="glass-card"><p className="text-slate-400">Loading calculations...</p></div>
          ) : overview ? (
            <>
              {/* Recommendation Banner */}
              <div className={`glass-card border-none ${overview.recommendedRegime === overview.selectedRegime ? 'bg-gradient-to-r from-success to-success/80' : 'bg-gradient-to-r from-primary to-primary/80'}`}>
                <h3 className="m-0 mb-2 text-white flex items-center gap-2">
                  <Award size={24} /> 
                  Recommendation: Go with the {overview.recommendedRegime.charAt(0).toUpperCase() + overview.recommendedRegime.slice(1)} Regime
                </h3>
                <p className="m-0 text-white/90">{overview.advisoryNote}</p>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`glass-card ${overview.selectedRegime === 'new' ? 'ring-2 ring-primary' : ''}`}>
                  <h3 className="mb-4 text-slate-400 font-normal">New Regime</h3>
                  <h2 className="text-3xl m-0 mb-2">₹{overview.newRegimeTax.toLocaleString('en-IN')}</h2>
                  <p className="text-slate-400 m-0">Total Tax Liability</p>
                </div>
                
                <div className={`glass-card ${overview.selectedRegime === 'old' ? 'ring-2 ring-primary' : ''}`}>
                  <h3 className="mb-4 text-slate-400 font-normal">Old Regime</h3>
                  <h2 className="text-3xl m-0 mb-2">₹{overview.oldRegimeTax.toLocaleString('en-IN')}</h2>
                  <p className="text-slate-400 m-0">Total Tax Liability</p>
                  <p className="text-sm mt-2 text-success">With ₹{overview.deductionsTotal.toLocaleString('en-IN')} deductions</p>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card"><p className="text-slate-400">No tax data available.</p></div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaxPlanner;
