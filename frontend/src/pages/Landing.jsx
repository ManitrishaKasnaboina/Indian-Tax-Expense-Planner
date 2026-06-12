import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, PieChart, Shield, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:px-12 relative z-10">
        <div className="text-2xl font-bold">
          Tax<span className="text-accent">Planner</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-decoration-none font-medium">Log In</Link>
          <Link to="/register" className="btn btn-primary px-6 py-2.5 rounded-full text-sm font-semibold">Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center relative z-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl flex flex-col items-center"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-6">
            Smart Financial Management
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
            Take Control of Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-fuchsia-500">
              Wealth & Taxes
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            The all-in-one platform to track expenses, optimize tax liabilities, and achieve your financial goals with intelligent insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/register" className="btn btn-primary px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:scale-105 transition-transform text-decoration-none">
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-full text-lg font-semibold border border-glass-border bg-white/5 hover:bg-white/10 transition-colors text-decoration-none text-white">
              Access Account
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full"
        >
          {[
            { icon: <Calculator className="text-emerald-400" size={32} />, title: "Tax Optimization", desc: "Automated calculations and smart saving tips to minimize your tax liability." },
            { icon: <PieChart className="text-primary" size={32} />, title: "Expense Tracking", desc: "Monitor your spending habits with intuitive categorization and stunning charts." },
            { icon: <Shield className="text-accent" size={32} />, title: "Bank-Grade Security", desc: "Your financial data is encrypted and stored with the highest security standards." }
          ].map((feature, idx) => (
            <Link to="/register" key={idx} className="glass-card p-8 rounded-3xl text-left border border-white/5 hover:border-primary/50 transition-colors bg-white/5 backdrop-blur-md text-decoration-none cursor-pointer block hover:scale-[1.02] transform duration-200">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </Link>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
