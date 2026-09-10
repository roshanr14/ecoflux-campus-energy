import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Building2,
  Maximize2
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import MetricCard from '../../components/ui/MetricCard';

export default function OccupancyView({ occupancyData, buildings = [] }) {
  const occ = occupancyData || {
    total_occupancy: 4980,
    total_capacity: 10950,
    campus_occupancy_rate_pct: 45.5,
    correlation: []
  };

  const correlationList = occ.correlation && occ.correlation.length > 0 ? occ.correlation : buildings.map(b => ({
    id: b.id,
    name: b.name,
    code: b.code,
    occupancy: b.current_occupancy,
    max_capacity: b.max_capacity,
    occupancy_rate_pct: Math.round((b.current_occupancy / b.max_capacity) * 1000) / 10,
    consumption_kw: b.current_consumption_kw,
    watts_per_occupant: Math.round((b.current_consumption_kw * 1000) / b.current_occupancy),
    watts_per_sqft: Math.round((b.current_consumption_kw * 1000) / b.sqft * 100) / 100,
    anomaly_flag: b.anomaly_flag
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Occupancy KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Campus Headcount"
          value={occ.total_occupancy?.toLocaleString() || "4,980"}
          unit="people"
          subtext="IoT optical counting across 6 blocks"
          icon={Users}
          accentColor="electric"
        />
        <MetricCard
          title="Total Campus Capacity"
          value={occ.total_capacity?.toLocaleString() || "10,950"}
          unit="capacity"
          subtext="Fire marshal certified envelope"
          icon={Building2}
          accentColor="brand"
        />
        <MetricCard
          title="Campus Utilization Rate"
          value={`${occ.campus_occupancy_rate_pct || 45.5}%`}
          unit=""
          subtext="Peak expected during 14:00 classes"
          icon={TrendingUp}
          accentColor="solar"
        />
        <MetricCard
          title="Avg Energy Intensity"
          value="472"
          unit="W / person"
          subtext="Benchmark: 350 - 500 W/person"
          icon={Zap}
          accentColor="brand"
        />
      </div>

      {/* Primary Correlation Feature: Energy Consumption vs Occupancy */}
      <div className="bento-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Energy Consumption vs. Occupancy Correlation</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Anomaly Detection
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies facility inefficiency: high power draw during low or moderate occupant density.
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={correlationList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="code" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" W" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val, name, item) => [`${val} Watts/Person (${item.payload.name})`, 'Energy Intensity']}
              />
              <Bar dataKey="watts_per_occupant" radius={[6, 6, 0, 0]}>
                {correlationList.map((entry, index) => (
                  <Cell 
                    key={`corr-${index}`} 
                    fill={entry.anomaly_flag ? '#ef4444' : (entry.watts_per_occupant > 700 ? '#f59e0b' : '#10b981')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Building-by-Building Occupancy Density Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Building Utilization & Capacity Envelopes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {correlationList.map((b) => (
            <div key={b.id} className="bento-card p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white truncate">{b.name}</h4>
                <span className="font-mono text-xs text-slate-400 font-semibold">[{b.code}]</span>
              </div>

              {/* Progress bar */}
              <div className="my-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Occupancy:</span>
                  <span className="font-mono font-bold text-white">{b.occupancy} / {b.max_capacity}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.anomaly_flag ? 'bg-rose-500' : 'bg-brand-500'
                    }`}
                    style={{ width: `${b.occupancy_rate_pct}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Power Draw</span>
                  <p className="font-mono font-bold text-slate-200">{b.consumption_kw} kW</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Watts / Person</span>
                  <p className={`font-mono font-bold ${b.anomaly_flag ? 'text-rose-400' : 'text-brand-400'}`}>
                    {b.watts_per_occupant} W
                  </p>
                </div>
              </div>

              {b.anomaly_flag && (
                <div className="mt-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                  <span>HVAC fan airflow oversized for current headcount</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
