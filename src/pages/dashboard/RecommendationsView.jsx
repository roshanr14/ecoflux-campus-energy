import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle, 
  DollarSign, 
  Leaf, 
  Filter,
  Check
} from 'lucide-react';

export default function RecommendationsView({ initialRecommendations = [], onApplied }) {
  const [filter, setFilter] = useState('all');
  const [recommendations, setRecommendations] = useState(initialRecommendations.length > 0 ? initialRecommendations : [
    {
      id: "rec_01",
      building_id: "bldg_sci_labs",
      building_name: "Science & Bio-Tech Complex",
      title: "Optimize Clean Room VAV Air Handler Flow",
      category: "HVAC Optimization",
      priority: "high",
      reason: "Air handler operating at 100% despite occupancy being 53% below peak design capacity.",
      action: "Engage dynamic setback to modulate ventilation fan speed by 22% during off-peak research hours.",
      estimated_savings_kwh: 340,
      estimated_savings_usd: 74.80,
      co2_saved_kg: 126,
      confidence: 0.94,
      applied: false
    },
    {
      id: "rec_02",
      building_id: "bldg_res_quad",
      building_name: "Evergreen Student Residences",
      title: "Shift Heat-Pump Water Heating to Peak Solar Window",
      category: "Load Shifting",
      priority: "high",
      reason: "Water heaters currently cycle during evening grid peak (28.6¢/kWh) instead of midday solar surplus.",
      action: "Pre-heat central thermal buffer tanks between 12:00 and 15:00 using onsite solar generation.",
      estimated_savings_kwh: 280,
      estimated_savings_usd: 68.20,
      co2_saved_kg: 104,
      confidence: 0.91,
      applied: false
    },
    {
      id: "rec_03",
      building_id: "bldg_athl_arena",
      building_name: "Pioneer Arena & Auditorium",
      title: "Dim Arena Perimeter High-Bay Lighting",
      category: "Lighting Automation",
      priority: "medium",
      reason: "High natural daylighting through skylights (lux level > 850) renders high-bays redundant.",
      action: "Apply automated 40% daylight harvesting dimming to perimeter fixture banks.",
      estimated_savings_kwh: 145,
      estimated_savings_usd: 20.60,
      co2_saved_kg: 54,
      confidence: 0.88,
      applied: false
    },
    {
      id: "rec_04",
      building_id: "bldg_eng_a",
      building_name: "Academic Block A (Engineering)",
      title: "Pre-Cool Lecture Halls Prior to Peak Tariff",
      category: "Thermal Pre-Cooling",
      priority: "medium",
      reason: "Grid tariffs spike at 16:00. Chillers can pre-cool thermal mass between 13:30 - 15:30.",
      action: "Lower temperature setpoints by 1.5°C before peak window, then coast until 19:00.",
      estimated_savings_kwh: 210,
      estimated_savings_usd: 48.30,
      co2_saved_kg: 78,
      confidence: 0.89,
      applied: true
    }
  ]);

  const [applyingId, setApplyingId] = useState(null);

  const handleApply = async (id) => {
    setApplyingId(id);
    try {
      await fetch('/api/recommendations/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendation_id: id })
      });
    } catch (e) {}

    setTimeout(() => {
      setRecommendations(prev => prev.map(r => r.id === id ? { ...r, applied: true } : r));
      setApplyingId(null);
      if (onApplied) onApplied(id);
    }, 400);
  };

  const filtered = filter === 'all' ? recommendations : recommendations.filter(r => r.priority === filter);

  const unapplied = recommendations.filter(r => !r.applied);
  const totalKwh = unapplied.reduce((acc, r) => acc + r.estimated_savings_kwh, 0);
  const totalUsd = unapplied.reduce((acc, r) => acc + r.estimated_savings_usd, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Card with Savings Pool */}
      <div className="bento-card p-6 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900 border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-solar-400" />
            <h2 className="text-xl font-bold text-white">AI Energy Recommendation Center</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Continuous energy conservation directives generated from real-time occupancy variance, solar forecast, and building thermodynamics.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Available Daily Savings</span>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{totalKwh.toLocaleString()} kWh</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Financial Impact</span>
            <p className="text-xl font-bold font-mono text-solar-400 mt-0.5">${totalUsd.toFixed(2)}/day</p>
          </div>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="flex items-center gap-2">
        {['all', 'high', 'medium', 'low'].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filter === p
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {p === 'all' ? 'All Priority Actions' : `${p} Priority`}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const isApplying = applyingId === rec.id;

          return (
            <div
              key={rec.id}
              className={`bento-card p-6 transition-all ${
                rec.applied 
                  ? 'opacity-65 border-slate-800/60 bg-slate-950/40' 
                  : 'hover:border-brand-500/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      rec.priority === 'high' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : (rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30')
                    }`}>
                      {rec.priority} Priority
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      {rec.building_name}
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono">
                      • {rec.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    <strong className="text-slate-200">Diagnostic Reason:</strong> {rec.reason}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                    <strong className="text-slate-300">Recommended Action:</strong> {rec.action}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                      ⚡ Save {rec.estimated_savings_kwh} kWh/day
                    </span>
                    <span className="flex items-center gap-1 text-solar-400 font-mono font-semibold">
                      💰 ${rec.estimated_savings_usd.toFixed(2)}/day
                    </span>
                    <span className="flex items-center gap-1 text-teal-300 font-mono text-[11px]">
                      🌱 {rec.co2_saved_kg} kg CO2
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      Confidence: {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="flex items-center flex-shrink-0">
                  {rec.applied ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Dispatched to BMS</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(rec.id)}
                      disabled={isApplying}
                      className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs shadow-md shadow-brand-500/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <span>{isApplying ? 'Dispatching...' : 'Apply Optimization'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
