import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register({ name, email, password });
      navigate('/login'); // Redirect to login on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-bg-dark">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card w-full max-w-md p-10 flex flex-col gap-6"
      >
        <div className="text-center mb-2">
          <h1 className="text-3xl m-0 mb-2">Create Account</h1>
          <p className="text-slate-400 m-0">Start planning your taxes efficiently.</p>
        </div>
        
        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-2 text-sm text-slate-300">Full Name</label>
            <input 
              type="text" 
              className="input-field" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-slate-300">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-slate-300">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
              minLength="6"
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline text-decoration-none">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
