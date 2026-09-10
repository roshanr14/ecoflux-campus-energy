import React, { useState } from 'react';
import { 
  Zap, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import HeroCampusCanvas from '../components/canvas/HeroCampusCanvas';

export default function AuthPage({ onNavigate }) {
  const { loginWithEmail, loginWithGoogle, loginAsDemoAdmin, loading, error: authError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }
    const res = await loginWithEmail(email, password);
    if (res.success) {
      onNavigate('onboarding');
    }
  };

  const handleGoogle = async () => {
    const res = await loginWithGoogle();
    if (res.success) {
      onNavigate('onboarding');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoAdmin();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col lg:flex-row">
      
      {/* Left Column: Campus Energy Simulation Showcase */}
      <div className="hidden lg:flex lg:w-1/2 p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 border-r border-slate-800 flex-col justify-between relative overflow-hidden">
        
        {/* Top brand */}
        <div className="flex items-center gap-3 cursor-pointer z-10" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono tracking-wider text-white">ECOFLUX</span>
            <p className="text-[10px] text-brand-400 uppercase tracking-wide">University Microgrid SaaS</p>
          </div>
        </div>

        {/* Center 3D visual preview */}
        <div className="my-auto py-6 z-10 space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
              Autonomous Optimization
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Unified Campus Energy Intelligence
            </h2>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Connect solar panels, battery energy storage, and classroom HVAC systems to reduce energy bills by up to 22%.
            </p>
          </div>

          <div className="h-[280px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <HeroCampusCanvas className="!h-full border-none rounded-none" />
          </div>
        </div>

        {/* Bottom Trust statement */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Enterprise 256-Bit Encrypted IoT Telemetry</span>
          </div>
          <span>v2.4 Production Ready</span>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right Column: Authentication Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-mono font-bold text-xl text-white">ECOFLUX</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isSignUp ? 'Create Campus Account' : 'Welcome to Ecoflux'}
            </h2>
            <p className="text-sm text-slate-400">
              Sign in to manage your campus energy microgrid and view AI insights.
            </p>
          </div>

          {/* 1-Click Fast Facilities Admin Evaluation Mode */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-slate-900 border border-brand-500/40 shadow-lg relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand-400 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Evaluator Access
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  Evaluate complete platform as <strong>Chief Facilities Officer</strong> with full live dataset.
                </p>
              </div>
              <button
                onClick={handleDemoLogin}
                className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1 flex-shrink-0 ml-3"
              >
                <span>Demo Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-xs uppercase font-mono text-slate-500">Or use credentials</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {/* Errors */}
          {(localError || authError) && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{localError || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                University Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director.energy@apex-univ.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-brand-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : (isSignUp ? 'Create Facilities Account' : 'Sign In to Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Toggle Sign up / Login */}
          <div className="text-center text-xs text-slate-400">
            <span>{isSignUp ? "Already have an enterprise account?" : "Don't have an account yet?"} </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-brand-400 font-semibold hover:underline ml-1"
            >
              {isSignUp ? 'Log in' : 'Create Account'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
