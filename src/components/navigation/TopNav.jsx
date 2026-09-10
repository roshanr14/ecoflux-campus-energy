import React, { useState, useEffect } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Calendar,
  Building2,
  ChevronDown,
  AlertTriangle,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function TopNav({ isCollapsed, onSelectBuilding }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('Apex University Smart Campus');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Energy Anomaly Detected',
      message: 'Science & Bio-Tech air handlers running at 100% despite 53% low occupancy.',
      time: '12m ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Solar Surplus Available',
      message: 'Solar arrays generating 842 kW. Megapack BESS charging at 142.5 kW.',
      time: '24m ago'
    },
    {
      id: 3,
      type: 'action',
      title: 'Peak Tariff Window Approaching',
      message: 'Peak tariff (28.6¢/kWh) starts at 16:00. Battery discharge auto-scheduled.',
      time: '1h ago'
    }
  ];

  return (
    <header 
      className={`sticky top-0 z-30 h-20 bg-dark-bg/90 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 px-4 sm:px-8 flex items-center justify-between ${
        isCollapsed ? 'ml-20' : 'ml-64'
      }`}
    >
      {/* Left: Campus Selector & Operational Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60 shadow-sm">
          <Building2 className="w-4 h-4 text-brand-400" />
          <select 
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="bg-transparent text-sm font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="Apex University Smart Campus" className="bg-slate-900 text-white">Apex University Smart Campus</option>
            <option value="Innovation Valley Tech Park" className="bg-slate-900 text-white">Innovation Valley Tech Park</option>
            <option value="St. Jude Health Sciences District" className="bg-slate-900 text-white">St. Jude Health Sciences District</option>
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Microgrid: Grid-Tied Optimal</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Date / Time */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-brand-400 font-bold ml-1">{currentTime}</span>
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title="Campus Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-solar-500 animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-solar-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-dark-surface border border-slate-700/80 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-100">Campus Alerts & AI Insights</h4>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300">3 Active</span>
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-800/60 mt-2 space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="pt-2 flex items-start gap-3 text-left">
                    <div className={`mt-0.5 p-1.5 rounded-lg ${
                      n.type === 'warning' ? 'bg-rose-500/20 text-rose-400' : (n.type === 'action' ? 'bg-solar-500/20 text-solar-400' : 'bg-blue-500/20 text-blue-400')
                    }`}>
                      {n.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-200 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          title="Toggle Light / Dark theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-solar-400" /> : <Moon className="w-4 h-4 text-electric-400" />}
        </button>

        {/* User Avatar */}
        {user && (
          <div className="flex items-center gap-2 pl-2">
            <img 
              src={user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
              alt="User" 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/30 shadow"
            />
          </div>
        )}
      </div>
    </header>
  );
}
