import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function EnergyView({ buildings = [], onNavigateSubTab }) {
  const [selectedBuildingId, setSelectedBuildingId] = useState('all');
  const [timeframe, setTimeframe] = useState('today');

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);

  // Chart data
  const chartData = buildings.map(b => ({
    name: b.code,
    fullName: b.name,
    consumption_kw: b.current_consumption_kw,
    today_kwh: b.today_kwh,
    isAnomaly: b.anomaly_flag
  }));

  const totalCampusKw = buildings.reduce((acc, b) => acc + b.current_consumption_kw, 0);
  const highestBuilding = buildings.length ? [...buildings].sort((a, b) => b.current_consumption_kw - a.current_consumption_kw)[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="bento-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Campus Building Energy Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time demand, peak usage windows, and anomalous energy baselines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Building Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs">
            <span className="text-slate-400">Filter:</span>
            <select
              value={selectedBuildingId}
              onChange={(e) => setSelectedBuildingId(e.target.value)}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Campus Facilities</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">{b.name}</option>
              ))}
            </select>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold">
            {['today', '7days', '30days'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  timeframe === tf ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === 'today' ? 'Today' : (tf === '7days' ? '7 Days' : '30 Days')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Analytics Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bento-card p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Real-Time Load</span>
          <p className="text-2xl font-bold font-mono text-white mt-1">{totalCampusKw.toFixed(1)} kW</p>
          <p className="text-xs text-slate-400 mt-1">Across 6 active sub-metered facilities</p>
        </div>
        <div className="bento-card p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Highest Consuming Facility</span>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{highestBuilding?.current_consumption_kw} kW</p>
          <p className="text-xs text-slate-300 mt-1 truncate">{highestBuilding?.name}</p>
        </div>
        <div className="bento-card p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peak Demand Window</span>
          <p className="text-2xl font-bold font-mono text-solar-400 mt-1">15:00 - 18:00</p>
          <p className="text-xs text-slate-400 mt-1">Tariff rate: 28.6¢ / kWh</p>
        </div>
      </div>

      {/* Building Load Comparison Bar Chart */}
      <div className="bento-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Facility Real-Time Power Draw (kW)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live consumption in kW. Red bars denote facilities operating at an anomalous energy baseline.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded bg-brand-500 inline-block"></span> Normal Load
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span> Anomaly Flag
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kW" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(val, name, item) => [`${val} kW (${item.payload.fullName})`, 'Current Load']}
              />
              <Bar dataKey="consumption_kw" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isAnomaly ? '#ef4444' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Facility Data Table */}
      <div className="bento-card overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Facility Telemetry Breakdown</h3>
          <span className="text-xs text-slate-400 font-mono">6 Connected Meters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Building Name</th>
                <th className="py-3.5 px-4">Primary Type</th>
                <th className="py-3.5 px-4">Area (sqft)</th>
                <th className="py-3.5 px-4">Current Draw</th>
                <th className="py-3.5 px-4">Today Total</th>
                <th className="py-3.5 px-4">Efficiency</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {buildings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <div>
                      <span>{b.name}</span>
                      <span className="ml-2 font-mono text-[10px] text-slate-500">[{b.code}]</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{b.type}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{b.sqft.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{b.current_consumption_kw} kW</td>
                  <td className="py-3.5 px-4 font-mono text-brand-400">{b.today_kwh.toLocaleString()} kWh</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {b.efficiency_rating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {b.anomaly_flag ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        Anomaly Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Optimal Baseline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
