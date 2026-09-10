import React from 'react';
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  Users, 
  Award, 
  ArrowRight, 
  TrendingDown, 
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Cpu
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import MetricCard from '../../components/ui/MetricCard';
import EnergyFlowCanvas from '../../components/canvas/EnergyFlowCanvas';

export default function OverviewView({ data, onNavigateSubTab }) {
  const metrics = data?.metrics || {};
  const history = data?.history || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top 5 Key Metric Cards with Animated Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Consumption"
          value={metrics.total_today_kwh?.toLocaleString() || "24,580"}
          unit="kWh"
          comparisonText="↓ 8.2% vs last week"
          comparisonTrend="down"
          icon={Zap}
          accentColor="brand"
        />
        <MetricCard
          title="Solar Generation"
          value={metrics.solar_today_kwh?.toLocaleString() || "4,820"}
          unit="kWh"
          subtext="842 kW active across 4 arrays"
          icon={Sun}
          accentColor="solar"
        />
        <MetricCard
          title="Battery Storage"
          value={`${metrics.battery_soc_percent || 78}%`}
          unit="SOC"
          subtext={`⚡ ${metrics.battery_state === 'charging' ? 'Charging (+142 kW)' : 'Discharging'}`}
          icon={BatteryCharging}
          accentColor="electric"
        />
        <MetricCard
          title="Campus Occupancy"
          value={metrics.current_occupancy?.toLocaleString() || "3,240"}
          unit="people"
          subtext="29.6% of campus capacity"
          icon={Users}
          accentColor="electric"
        />
        <MetricCard
          title="Energy Saved Today"
          value={metrics.energy_saved_today_kwh?.toLocaleString() || "1,840"}
          unit="kWh"
          subtext="$285.20 in avoided utility tariffs"
          icon={Award}
          accentColor="brand"
        />
      </div>

      {/* Main Central Row: Live Energy Flow Canvas + Quick AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Central Energy Flow Canvas (2 cols) */}
        <div className="lg:col-span-2 bento-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Campus Energy Flow Ecosystem</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time dynamic power routing between Utility Grid, Rooftop Solar, Battery Storage, and Building Loads.
              </p>
            </div>
            
            <button
              onClick={() => onNavigateSubTab('simulator')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-solar-500/10 hover:bg-solar-500/20 border border-solar-500/30 text-solar-300 text-xs font-semibold transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Simulate Scenario</span>
            </button>
          </div>

          <EnergyFlowCanvas 
            gridKw={metrics.net_grid_kw || 1509.1}
            solarKw={metrics.solar_generation_kw || 842.0}
            campusKw={metrics.total_consumption_kw || 2351.1}
            batteryKw={metrics.battery_flow_kw || 142.5}
            batteryState={metrics.battery_state || 'charging'}
          />

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Grid Import</span>
              <p className="text-sm font-bold font-mono text-electric-400 mt-0.5">
                {metrics.net_grid_kw?.toLocaleString() || "1,509"} kW
              </p>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Clean Solar</span>
              <p className="text-sm font-bold font-mono text-solar-400 mt-0.5">
                {metrics.solar_generation_kw?.toLocaleString() || "842"} kW
              </p>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Self-Sufficiency</span>
              <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                {metrics.renewable_share_pct || 35.8}%
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: AI Priority Directive + Active Warning */}
        <div className="space-y-6 flex flex-col justify-between">
          
          {/* AI Priority Directive Card */}
          <div className="bento-card p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-brand-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400">
                  Antigravity AI Agent
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                High Priority
              </span>
            </div>

            <h4 className="text-sm font-bold text-white mb-1">
              Optimize Clean Room VAV Air Handlers
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Science & Bio-Tech air handlers are running at 100% full blast despite occupancy being 53% below peak design limits.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 flex items-center justify-between text-xs">
              <span className="text-slate-400">Potential Savings:</span>
              <span className="font-mono font-bold text-emerald-400">340 kWh ($74.80/day)</span>
            </div>

            <button
              onClick={() => onNavigateSubTab('recommendations')}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              <span>Review & Apply Optimization</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick AI Battery Dispatch Rationale */}
          <div className="bento-card p-5 bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Battery Dispatch Rationale
              </span>
              <span className="text-xs font-mono font-bold text-solar-400">78% SOC</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Surplus solar generation exceeds daytime baseline load. Clean power is directed to Megapack BESS in preparation for 16:00 peak tariff window (28.6¢/kWh).
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Next Dispatch: Discharge @ 16:00</span>
              <button 
                onClick={() => onNavigateSubTab('battery')}
                className="text-brand-400 hover:underline font-semibold"
              >
                Inspect BESS →
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 24-Hour Campus Diurnal Energy Curve */}
      <div className="bento-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">24-Hour Diurnal Energy & Solar Curve</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical hourly load (kW) plotted against rooftop solar PV generation and net utility grid draw.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-3 h-3 rounded-full bg-brand-500 inline-block"></span> Total Load
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-3 h-3 rounded-full bg-solar-400 inline-block"></span> Solar Generation
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-3 h-3 rounded-full bg-electric-400 inline-block"></span> Net Grid
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour_label" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f1f5f9' }}
              />
              <Area type="monotone" dataKey="demand_kw" name="Total Demand" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
              <Area type="monotone" dataKey="solar_kw" name="Solar Gen" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorSolar)" />
              <Area type="monotone" dataKey="net_grid_kw" name="Net Grid Draw" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorGrid)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
