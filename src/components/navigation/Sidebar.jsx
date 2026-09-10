import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Sun,
  BatteryCharging,
  Users,
  TrendingUp,
  Lightbulb,
  Cpu,
  Bot,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, onNavigateLanding }) {
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'energy', label: 'Energy Consumption', icon: Zap },
    { id: 'solar', label: 'Solar Generation', icon: Sun },
    { id: 'battery', label: 'Battery Monitoring', icon: BatteryCharging },
    { id: 'occupancy', label: 'Occupancy Analytics', icon: Users },
    { id: 'prediction', label: 'AI Prediction', icon: TrendingUp, badge: 'ML' },
    { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb, count: 4 },
    { id: 'simulator', label: 'What-If Simulator', icon: Cpu, highlight: true },
    { id: 'copilot', label: 'AI Energy Copilot', icon: Bot, ai: true },
    { id: 'greenscore', label: 'Green Building Score', icon: Award },
    { id: 'figma', label: 'Design System & Figma', icon: Palette }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-40 bg-dark-surface/95 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800">
        <div 
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
          onClick={onNavigateLanding}
          title="Return to Ecoflux Landing"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex-shrink-0 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200">
              <span className="font-mono font-bold text-lg tracking-wider text-white">ECOFLUX</span>
              <p className="text-[10px] text-brand-400 uppercase tracking-wider font-semibold">Campus SaaS</p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
              }`} />

              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Dynamic Badges */}
              {!isCollapsed && item.count && (
                <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.count}
                </span>
              )}

              {!isCollapsed && item.badge && (
                <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {item.badge}
                </span>
              )}

              {!isCollapsed && item.ai && (
                <span className="ml-auto px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 animate-pulse">
                  Agent
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-slate-100 text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-800">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* User Info & Footer */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        {/* User preview */}
        {!isCollapsed && user && (
          <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-2 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-xs border border-brand-500/40">
              {user.user_metadata?.full_name ? user.user_metadata.full_name[0] : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user.user_metadata?.full_name || 'Campus Admin'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user.user_metadata?.role || 'Facilities Manager'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
