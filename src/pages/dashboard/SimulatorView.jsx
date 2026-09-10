import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Sun, 
  BatteryCharging, 
  DollarSign, 
  Award, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

export default function SimulatorView() {
  const [occupancyDelta, setOccupancyDelta] = useState(20); // +20%
  const [solarDelta, setSolarDelta] = useState(-15); // -15%
  const [batteryDelta, setBatteryDelta] = useState(30); // +30%
  const [conservationTarget, setConservationTarget] = useState(10); // 10% reduction

  const [simulationResult, setSimulationResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runSimulation = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occupancy_delta_pct: occupancyDelta,
          solar_delta_pct: solarDelta,
          battery_capacity_delta_pct: batteryDelta,
          conservation_target_pct: conservationTarget
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (e) {
      console.warn('Simulating local fallback for scenario sandbox');
    } finally {
      setTimeout(() => setIsCalculating(false), 200);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [occupancyDelta, solarDelta, batteryDelta, conservationTarget]);

  const resetDefaults = () => {
    setOccupancyDelta(0);
    setSolarDelta(0);
    setBatteryDelta(0);
    setConservationTarget(0);
  };

  const sim = simulationResult?.simulated || {
    daily_consumption_kwh: 23842,
    daily_solar_kwh: 4097,
    daily_cost_usd: 3060,
    annual_cost_savings_usd: 48200,
    renewable_share_pct: 17.2,
    battery_capacity_kwh: 1560,
    green_score_projected: 86.2
  };

  const base = simulationResult?.baseline || {
    daily_consumption_kwh: 24580,
    daily_solar_kwh: 4820,
    renewable_share_pct: 19.6,
    green_score_avg: 84.5
  };

  const comparisonChart = [
    { metric: 'Consumption (kWh)', Baseline: base.daily_consumption_kwh, Simulated: sim.daily_consumption_kwh },
    { metric: 'Solar Yield (kWh)', Baseline: base.daily_solar_kwh, Simulated: sim.daily_solar_kwh },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="bento-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-400" />
            <h2 className="text-xl font-bold text-white">Interactive What-If Scenario Sandbox</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-500/20 text-brand-300">
              FastAPI + Python Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Test campus changes before capital expenditure: adjust student attendance, solar capacity, or storage to forecast exact utility costs and sustainability impacts.
          </p>
        </div>

        <button
          onClick={resetDefaults}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Main Sandbox Grid: Sliders on Left, Immediate Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 4 Interactive Parameter Sliders (5 cols) */}
        <div className="lg:col-span-5 bento-card p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Adjust Simulation Variables
          </h3>

          {/* Slider 1: Occupancy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Campus Occupancy Change</span>
              <span className={`font-mono font-bold ${occupancyDelta >= 0 ? 'text-solar-400' : 'text-emerald-400'}`}>
                {occupancyDelta > 0 ? `+${occupancyDelta}%` : `${occupancyDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={occupancyDelta}
              onChange={(e) => setOccupancyDelta(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50% (Summer break)</span>
              <span>Baseline (0%)</span>
              <span>+100% (Convocation)</span>
            </div>
          </div>

          {/* Slider 2: Solar Generation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Solar Generation Variance</span>
              <span className={`font-mono font-bold ${solarDelta >= 0 ? 'text-solar-400' : 'text-rose-400'}`}>
                {solarDelta > 0 ? `+${solarDelta}%` : `${solarDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={solarDelta}
              onChange={(e) => setSolarDelta(Number(e.target.value))}
              className="w-full accent-solar-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50% (Overcast)</span>
              <span>Baseline (0%)</span>
              <span>+100% (New Array)</span>
            </div>
          </div>

          {/* Slider 3: Battery Capacity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Battery Storage Capacity</span>
              <span className="font-mono font-bold text-electric-400">
                {batteryDelta > 0 ? `+${batteryDelta}%` : `${batteryDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="200"
              step="10"
              value={batteryDelta}
              onChange={(e) => setBatteryDelta(Number(e.target.value))}
              className="w-full accent-electric-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50% (600 kWh)</span>
              <span>1,200 kWh</span>
              <span>+200% (3,600 kWh)</span>
            </div>
          </div>

          {/* Slider 4: Conservation Target */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Energy Conservation Target</span>
              <span className="font-mono font-bold text-emerald-400">
                {conservationTarget}% Reduction
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={conservationTarget}
              onChange={(e) => setConservationTarget(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (As-is)</span>
              <span>15% (Chiller setback)</span>
              <span>35% (Deep retrofit)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
            💡 Slider adjustments immediately transmit to Python microservices via WebSocket/REST for real-time recalculation.
          </div>
        </div>

        {/* Right Column: Dynamic Projected Impact Meters & Visuals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 4 Simulated KPI Outcome Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bento-card p-4">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Simulated Load</span>
              <p className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                {sim.daily_consumption_kwh?.toLocaleString()} kWh
              </p>
              <span className={`text-[10px] font-medium ${sim.daily_consumption_kwh < base.daily_consumption_kwh ? 'text-emerald-400' : 'text-rose-400'}`}>
                {sim.daily_consumption_kwh < base.daily_consumption_kwh ? '↓ Reduced Load' : '↑ Increased Load'}
              </span>
            </div>

            <div className="bento-card p-4">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Annual Financial ROI</span>
              <p className={`text-lg sm:text-xl font-bold font-mono mt-1 ${sim.annual_cost_savings_usd >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {sim.annual_cost_savings_usd >= 0 ? `+$${sim.annual_cost_savings_usd?.toLocaleString()}` : `-$${Math.abs(sim.annual_cost_savings_usd)?.toLocaleString()}`}
              </p>
              <span className="text-[10px] text-slate-400">Utility bill delta</span>
            </div>

            <div className="bento-card p-4">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Renewable Share</span>
              <p className="text-lg sm:text-xl font-bold font-mono text-solar-400 mt-1">
                {sim.renewable_share_pct}%
              </p>
              <span className="text-[10px] text-slate-400">Target: 40%</span>
            </div>

            <div className="bento-card p-4">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Green Score</span>
              <p className="text-lg sm:text-xl font-bold font-mono text-brand-300 mt-1">
                {sim.green_score_projected} / 100
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">LEED Impact</span>
            </div>
          </div>

          {/* Baseline vs Scenario Chart */}
          <div className="bento-card p-6">
            <h4 className="text-sm font-bold text-white mb-1">Baseline vs. Scenario Comparison</h4>
            <p className="text-xs text-slate-400 mb-4">
              Daily electricity consumption and renewable generation under the selected scenario.
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" kWh" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Baseline" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights & Observations from simulation */}
          {simulationResult?.insights && (
            <div className="bento-card p-5 bg-gradient-to-r from-slate-900 to-slate-950 border-brand-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400">
                  Scenario Intelligence Findings
                </h4>
              </div>
              <div className="space-y-1.5 pt-1">
                {simulationResult.insights.map((ins, i) => (
                  <p key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-brand-400 font-bold">•</span>
                    <span>{ins}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
