import React, { useState } from 'react';
import { 
  BatteryCharging, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Thermometer, 
  RotateCw, 
  ArrowRight,
  TrendingDown,
  Cpu
} from 'lucide-react';
import MetricCard from '../../components/ui/MetricCard';

export default function BatteryView({ batteryData }) {
  const [battery, setBattery] = useState(batteryData?.battery || {
    system_name: "Tesla Megapack 2XL LiFePO4",
    total_capacity_kwh: 1200,
    current_stored_kwh: 936,
    soc_percent: 78,
    state: "charging",
    power_flow_kw: 142.5,
    health_percent: 98.4,
    temperature_celsius: 23.8,
    cycle_count: 412,
    estimated_runtime_hours: 6.8,
    recommended_action: "Charge from surplus solar (185 kW available) until 85% SOC prior to 17:00 peak tariff.",
    efficiency_roundtrip: 93.5,
    max_charge_rate_kw: 350,
    max_discharge_rate_kw: 400
  });

  const [agentDecision, setAgentDecision] = useState({
    decision: "CHARGE",
    mode: "solar_absorption",
    power_kw: 142.5,
    reason: "Solar generation (842 kW) currently exceeds campus daytime load. Absorbing surplus cleanly avoids utility curtailment and prepares storage for 16:00 peak tariff window.",
    confidence: 0.94,
    cost_benefit: "Zero-cost renewable charging saves approx $145 vs evening grid draw."
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const triggerAgentDispatch = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/battery/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demand_kw: 2351.1,
          solar_kw: 842.0,
          soc_percent: battery.soc_percent
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.decision) {
          setAgentDecision(data.decision);
        }
      }
    } catch (e) {
      console.warn('Simulating local dispatch response');
    } finally {
      setTimeout(() => setIsCalculating(false), 500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top BESS Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="State of Charge (SOC)"
          value={`${battery.soc_percent}%`}
          unit=""
          subtext={`${battery.current_stored_kwh} / ${battery.total_capacity_kwh} kWh stored`}
          icon={BatteryCharging}
          accentColor="brand"
        />
        <MetricCard
          title="Power Flow"
          value={`+${battery.power_flow_kw}`}
          unit="kW"
          subtext="⚡ Absorbing surplus solar"
          icon={Zap}
          accentColor="solar"
        />
        <MetricCard
          title="State of Health (SOH)"
          value={`${battery.health_percent}%`}
          unit=""
          subtext={`${battery.cycle_count} lifetime cycles`}
          icon={ShieldCheck}
          accentColor="electric"
        />
        <MetricCard
          title="Est. Backup Runtime"
          value={battery.estimated_runtime_hours}
          unit="hours"
          subtext="At average campus critical load"
          icon={Clock}
          accentColor="brand"
        />
      </div>

      {/* Main Grid: Visual Battery Unit + Antigravity Agent Decision Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Visual Battery Component */}
        <div className="bento-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Physical Storage Architecture</h3>
                <p className="text-xs text-slate-400">{battery.system_name}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                {battery.state.toUpperCase()}
              </span>
            </div>

            {/* Giant Battery Visual Graphic */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center my-4">
              <div className="w-full max-w-sm relative">
                {/* Battery Terminal Pin */}
                <div className="w-12 h-3 bg-slate-700 rounded-t mx-auto"></div>
                
                {/* Battery Outer Casing */}
                <div className="w-full h-44 rounded-2xl border-4 border-slate-700 p-2 bg-slate-900/90 relative overflow-hidden flex flex-col justify-end shadow-2xl">
                  {/* Fill Level */}
                  <div 
                    className="w-full rounded-xl bg-gradient-to-t from-brand-600 via-emerald-500 to-emerald-400 transition-all duration-700 relative overflow-hidden flex items-center justify-center shadow-lg shadow-emerald-500/30"
                    style={{ height: `${battery.soc_percent}%` }}
                  >
                    {/* Liquid Energy Waves */}
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    <span className="relative z-10 font-mono font-extrabold text-white text-2xl drop-shadow">
                      {battery.soc_percent}%
                    </span>
                  </div>

                  {/* Level ticks */}
                  <div className="absolute inset-y-0 right-4 flex flex-col justify-between py-4 text-[9px] font-mono text-slate-500 pointer-events-none">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-telemetry pills */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-slate-400 text-[10px] uppercase">Pack Temp</span>
              <p className="font-mono font-bold text-slate-200 mt-0.5">{battery.temperature_celsius}°C</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-slate-400 text-[10px] uppercase">Round-Trip Eff.</span>
              <p className="font-mono font-bold text-brand-400 mt-0.5">{battery.efficiency_roundtrip}%</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60">
              <span className="text-slate-400 text-[10px] uppercase">Max Dispatch</span>
              <p className="font-mono font-bold text-electric-400 mt-0.5">{battery.max_discharge_rate_kw} kW</p>
            </div>
          </div>
        </div>

        {/* Antigravity AI Dispatch Agent */}
        <div className="bento-card p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border-brand-500/40">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Antigravity Dispatch Agent</h3>
                  <p className="text-xs text-brand-400 font-mono">Autonomous Economic Optimization</p>
                </div>
              </div>

              <button
                onClick={triggerAgentDispatch}
                disabled={isCalculating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold shadow transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
                <span>Recalculate</span>
              </button>
            </div>

            {/* Structured Agent Output Card */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recommended Action
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {agentDecision.decision} ({agentDecision.power_kw} kW)
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">
                  Mode: <span className="font-mono text-brand-400">{agentDecision.mode}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Economic & Engineering Rationale
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {agentDecision.reason}
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-brand-400 font-medium">
                  💡 {agentDecision.cost_benefit}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Agent Confidence:</span>
                  <p className="text-base font-bold font-mono text-white mt-0.5">
                    {Math.round(agentDecision.confidence * 100)}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400">Next Planned State:</span>
                  <p className="text-base font-bold font-mono text-solar-400 mt-0.5">
                    Discharge @ 16:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Dynamic BMS Gateway: Connected</span>
            <span className="text-emerald-400 font-mono">Response: 18ms</span>
          </div>
        </div>

      </div>

    </div>
  );
}
