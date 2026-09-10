import React from 'react';
import { Zap, Sun, Moon, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ currentRoute, onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-dark-bg/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('landing')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-mono">ECOFLUX</span>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded">AI Campus</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">Intelligent Energy Platform</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onNavigate('landing')}
            className={`hover:text-brand-400 transition-colors ${currentRoute === 'landing' ? 'text-brand-400 font-semibold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')}
            className={`hover:text-brand-400 transition-colors ${currentRoute === 'how-it-works' ? 'text-brand-400 font-semibold' : ''}`}
          >
            How It Works
          </button>
          <button 
            onClick={() => onNavigate('features')}
            className={`hover:text-brand-400 transition-colors ${currentRoute === 'features' ? 'text-brand-400 font-semibold' : ''}`}
          >
            Features
          </button>
          <button 
            onClick={() => onNavigate('dashboard', 'simulator')}
            className="flex items-center gap-1.5 text-solar-400 hover:text-solar-300 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-solar-400" /> : <Moon className="w-4 h-4 text-electric-400" />}
          </button>

          {/* User / Dashboard button */}
          {user ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all group"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('auth')}
                className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold shadow-md transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
