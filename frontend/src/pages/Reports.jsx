import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import reportService from '../services/reportService';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#22C55E', '#3B82F6', '#EC4899'];

const Reports = () => {
  const [data, setData] = useState({ monthlyData: [], categoryData: [] });
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const result = await reportService.getReportsData(year);
        setData(result);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [year]);

  if (loading) {
    return <div className="text-center mt-20 text-slate-400">Loading reports...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
          <p className="text-slate-400 mt-1">Deep dive into your financial data for {year}.</p>
        </div>
        <select 
          className="input-field w-auto" 
          value={year} 
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[...Array(5)].map((_, i) => {
            const y = new Date().getFullYear() - i;
            return <option key={y} value={y}>{y}</option>;
          })}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-[400px]">
          <h3 className="text-xl font-semibold mb-6">Income vs Expense (YTD)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6 h-[400px]">
          <h3 className="text-xl font-semibold mb-6">Expense Breakdown</h3>
          {data.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No expenses recorded for this year.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
