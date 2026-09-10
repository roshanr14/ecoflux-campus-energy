import React from 'react';
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Layers, 
  TrendingUp, 
  Cpu, 
  BarChart3,
  ExternalLink
} from 'lucide-react';
import HeroCampusCanvas from '../components/canvas/HeroCampusCanvas';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-gradient-to-b from-brand-500/10 via-electric-500/5 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold tracking-wide shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Campus Microgrid Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Powering Smarter Campuses Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-200">Intelligent Energy Decisions.</span>
            </h1>

            {/* Alternative Supporting Line */}
            <p className="text-lg sm:text-xl text-brand-400 font-medium font-mono">
              Monitor. Predict. Optimize. Build a sustainable campus.
            </p>

            {/* Hero Description */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Ecoflux brings electricity consumption, solar generation, battery intelligence, occupancy data, and AI-powered recommendations into one unified enterprise energy management platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-semibold text-base shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all group"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('how-it-works')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition-colors"
              >
                See How It Works
              </button>

              <button
                onClick={() => onNavigate('dashboard', 'simulator')}
                className="px-6 py-3.5 rounded-2xl bg-solar-500/10 hover:bg-solar-500/20 text-solar-300 border border-solar-500/30 font-semibold text-base flex items-center gap-2 transition-colors"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch Simulator</span>
              </button>
            </div>

          </div>

          {/* 3D Smart Campus Visualization */}
          <div className="mt-14 relative">
            <HeroCampusCanvas />
          </div>

          {/* Live Campus Telemetry Ticker */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bento-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Campus Load</span>
              <p className="text-xl font-bold font-mono text-white mt-1">24,580 kWh</p>
              <span className="text-[10px] text-emerald-400 font-medium">↓ 8.2% vs last week</span>
            </div>
            <div className="bento-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Solar Generated</span>
              <p className="text-xl font-bold font-mono text-solar-400 mt-1">8,420 kWh</p>
              <span className="text-[10px] text-slate-400">4 Arrays Active</span>
            </div>
            <div className="bento-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Battery Level</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">78% SOC</p>
              <span className="text-[10px] text-emerald-400 font-medium">⚡ Charging (Surplus)</span>
            </div>
            <div className="bento-card p-4 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Campus Occupancy</span>
              <p className="text-xl font-bold font-mono text-electric-400 mt-1">3,240 People</p>
              <span className="text-[10px] text-slate-400">6 Monitored Facilities</span>
            </div>
            <div className="bento-card p-4 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Energy Saved</span>
              <p className="text-xl font-bold font-mono text-brand-300 mt-1">1,840 kWh</p>
              <span className="text-[10px] text-brand-400 font-medium">$285.20 Saved Today</span>
            </div>
          </div>

        </div>
      </section>

      {/* Campus Problem Statement & Solution */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-solar-400">The Problem</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Disjointed Campus Energy Systems Create Costly Blindspots.
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Colleges consume millions of kWh across lecture halls, high-demand research labs, student hostels, and athletics complexes. Managing these systems in separate silos leads to missed solar opportunities, uncoordinated battery dispatch, and unchecked energy waste.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Clean rooms & lecture halls conditioning air with zero occupants inside.",
                  "Solar energy curtailed or sold back cheap instead of charging campus storage.",
                  "Peak demand charges incurred because batteries discharged at the wrong hours.",
                  "No automated correlation between campus event calendars and chillers."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✕</span>
                    <p className="text-sm text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ecoflux Solution Card */}
            <div className="bento-card p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-brand-500/30 shadow-2xl relative">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap className="w-32 h-32 text-brand-500" />
              </div>

              <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400">The Ecoflux Solution</span>
              <h3 className="text-2xl font-bold text-white mt-2 mb-4">
                Unified Autonomous Microgrid Intelligence
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Ecoflux connects IoT smart meters, solar inverters, BMS chillers, and occupancy telemetry into a continuous AI decision engine that forecasts demand, orchestrates storage, and saves thousands of kWh.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-2xl font-bold font-mono text-brand-400">35.8%</div>
                  <div className="text-xs text-slate-400 mt-1">Solar Offset Share</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-2xl font-bold font-mono text-solar-400">$64,000+</div>
                  <div className="text-xs text-slate-400 mt-1">Avg Annual Savings</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-2xl font-bold font-mono text-electric-400">&lt; 15 min</div>
                  <div className="text-xs text-slate-400 mt-1">Anomaly Detection</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-2xl font-bold font-mono text-emerald-400">94/100</div>
                  <div className="text-xs text-slate-400 mt-1">Avg Green Building Score</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ready to evaluate your campus?</span>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  <span>Launch Live Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Grid Feature Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400">Intelligent Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Modern Smart Campuses
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything your university facilities department needs to monitor, forecast, and optimize electricity in one high-performance interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('dashboard', 'energy')}
            className="bento-card p-6 cursor-pointer group hover:border-brand-500/50 transition-all"
          >
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Building Energy Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Real-time consumption telemetry across classrooms, robotics labs, and dormitories with peak usage alerts.
            </p>
            <span className="text-xs font-semibold text-brand-400 flex items-center gap-1 group-hover:underline">
              Inspect Consumption Analytics →
            </span>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('dashboard', 'battery')}
            className="bento-card p-6 cursor-pointer group hover:border-solar-500/50 transition-all"
          >
            <div className="p-3 rounded-xl bg-solar-500/10 text-solar-400 border border-solar-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Battery & Solar Dispatch</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              AI calculates when to absorb clean rooftop solar generation and when to discharge BESS to shave utility peak tariffs.
            </p>
            <span className="text-xs font-semibold text-solar-400 flex items-center gap-1 group-hover:underline">
              Explore Battery Optimizer →
            </span>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('dashboard', 'copilot')}
            className="bento-card p-6 cursor-pointer group hover:border-electric-500/50 transition-all"
          >
            <div className="p-3 rounded-xl bg-electric-500/10 text-electric-400 border border-electric-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Energy Copilot</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Ask natural language questions about wasted electricity, tomorrow's demand spike, or optimal chiller schedules.
            </p>
            <span className="text-xs font-semibold text-electric-400 flex items-center gap-1 group-hover:underline">
              Chat with Energy Copilot →
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-dark-surface/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-mono font-bold text-sm tracking-wider text-white">ECOFLUX</span>
            <span className="text-xs text-slate-500">© 2026 Apex Smart Campus Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => onNavigate('dashboard', 'figma')} className="hover:text-white transition-colors">Design System</button>
            <button onClick={() => onNavigate('auth')} className="hover:text-white transition-colors">Facilities Sign In</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
