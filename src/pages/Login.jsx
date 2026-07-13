import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, KeyRound, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-slate-950">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl relative">
        
        {/* Visual Graphic Panel (Left side) */}
        <div className="relative hidden lg:block overflow-hidden bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
            alt="Interior architectural rendering"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <h2 className="text-3xl font-display font-extrabold text-white">Your journey starts here.</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Log in to unlock custom property favorites, message sellers directly, or manage your real estate portfolio listings.
            </p>
          </div>
        </div>

        {/* Auth Form Panel (Right side) */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-2 justify-center lg:justify-start">
              <LogIn className="w-6 h-6 text-indigo-500" />
              <span>Welcome Back</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Log in to manage your real estate listings</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Password</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
                <KeyRound className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 mt-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
            <p className="text-sm text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
