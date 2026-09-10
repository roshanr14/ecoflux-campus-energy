import React from 'react';
import { 
  Sun, 
  Sparkles, 
  TrendingUp, 
  CloudSun, 
  Gauge, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import MetricCard from '../../components/ui/MetricCard';

export default function SolarView({ solarData, history = [] }) {
  const solar = solarData?.solar || {
    total_installed_kwp: 1450,
    current_generation_kw: 842.0,
    today_generation_kwh: 4820,
    efficiency_ratio: 94.2,
    irradiance_w_m2: 785,
    panel_temp_celsius: 38.2,
    forecast_tomorrow_kwh: 6100,
    weather_condition: 'Partly Sunny, High UV index',
    arrays: [
      { name: "Engineering Rooftop Array", kwp: 380, current_kw: 224.2, status: "optimal" },
      { name: "Bio-Tech Research Solar Pergola", kwp: 420, current_kw: 251.0, status: "optimal" },
      { name: "Central Library Dual-Tilt Array", kwp: 250, current_kw: 148.5, status: "optimal" },
      { name: "Innovation Center Solar Canopy", kwp: 400, current_kw: 218.3, status: "optimal" }
    ]
  };

  const solarTimeline = history.map(h => ({
    hour_label: h.hour_label,
    solar_kw: h.solar_kw,
    theoretical_max: Math.round(h.solar_kw * 1.1)
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Solar Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Solar Generation"
          value={solar.current_generation_kw?.toLocaleString()}
          unit="kW"
          subtext="Offsetting 35.8% of campus load"
          icon={Sun}
          accentColor="solar"
        />
        <MetricCard
          title="Today Total Generated"
          value={solar.today_generation_kwh?.toLocaleString()}
          unit="kWh"
          comparisonText="↑ 12% vs 7-day average"
          comparisonTrend="up"
          icon={TrendingUp}
          accentColor="solar"
        />
        <MetricCard
          title="System Conversion Efficiency"
          value={`${solar.efficiency_ratio}%`}
          unit=""
          subtext="Inverter MPPT tracking optimal"
          icon={Gauge}
          accentColor="brand"
        />
        <MetricCard
          title="Solar Irradiance"
          value={solar.irradiance_w_m2}
          unit="W/m²"
          subtext={`Panel temp: ${solar.panel_temp_celsius}°C`}
          icon={CloudSun}
          accentColor="solar"
        />
      </div>

      {/* Solar Generation Curve */}
      <div className="bento-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Diurnal Solar Generation vs. Theoretical Capacity</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hourly photovoltaic yield across all 1,450 kWp installed campus PV arrays.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-solar-400 font-bold">Forecast Tomorrow:</span>
            <span className="text-white">{solar.forecast_tomorrow_kwh.toLocaleString()} kWh</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={solarTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="solarArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour_label" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f1f5f9' }}
              />
              <Area type="monotone" dataKey="solar_kw" name="Actual Solar kW" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#solarArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 PV Array Sub-systems */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Campus Photovoltaic Infrastructure (4 Arrays)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {solar.arrays.map((arr, idx) => (
            <div key={idx} className="bento-card p-5 group hover:border-solar-500/40">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-solar-500/10 text-solar-400 border border-solar-500/20">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Optimal
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-solar-300 transition-colors">
                {arr.name}
              </h4>
              <p className="text-xs text-slate-400 mb-4">Installed: {arr.kwp} kWp</p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Current Output:</span>
                <span className="font-mono font-bold text-solar-400 text-sm">{arr.current_kw} kW</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
