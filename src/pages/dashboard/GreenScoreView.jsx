import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Leaf, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import MetricCard from '../../components/ui/MetricCard';

export default function GreenScoreView({ buildings = [] }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [campusAverage, setCampusAverage] = useState(84.5);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch('/api/green-score');
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard);
          setCampusAverage(data.campus_average_score);
          return;
        }
      } catch (e) {}

      // Fallback
      const sorted = [...buildings].sort((a, b) => b.green_score - a.green_score);
      setLeaderboard(sorted.map((b, idx) => ({
        rank: idx + 1,
        id: b.id,
        name: b.name,
        code: b.code,
        score: b.green_score,
        badge: b.green_score >= 90 ? "🏆 Excellent" : (b.green_score >= 80 ? "🌱 Sustainable" : "⚡ Needs Improvement"),
        status: b.green_score >= 90 ? "LEED Platinum Level" : (b.green_score >= 80 ? "High Performing" : "Optimization Target"),
        efficiency_factor: b.green_score - 2,
        solar_factor: b.has_solar ? 92 : 45,
        occupancy_factor: b.anomaly_flag ? 62 : 88,
        waste_reduction_factor: b.anomaly_flag ? 55 : 91
      })));
    };
    fetchScores();
  }, [buildings]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Campus Rating */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Campus Green Building Average"
          value={`${campusAverage}`}
          unit="/ 100"
          comparisonText="↑ 4.2 pts vs prior semester"
          comparisonTrend="up"
          icon={Award}
          accentColor="brand"
        />
        <MetricCard
          title="Institutional Rating"
          value="LEED Gold Tier"
          unit=""
          subtext="Top 5% of collegiate microgrids"
          icon={ShieldCheck}
          accentColor="solar"
        />
        <MetricCard
          title="Renewable Displacement"
          value="35.8%"
          unit=""
          subtext="Zero-emission campus footprint"
          icon={Leaf}
          accentColor="electric"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bento-card overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">Campus Building Sustainability Leaderboard</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by composite 100-point sustainability index combining energy efficiency, solar adoption, and waste prevention.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-brand-400 font-semibold">
            6 Buildings Monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-4 w-16 text-center">Rank</th>
                <th className="py-4 px-4">Facility</th>
                <th className="py-4 px-4">Overall Score</th>
                <th className="py-4 px-4">Tier Badge</th>
                <th className="py-4 px-4">Energy Efficiency</th>
                <th className="py-4 px-4">Solar Factor</th>
                <th className="py-4 px-4">Waste Prevention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {leaderboard.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 text-center font-mono font-bold text-sm">
                    {item.rank === 1 ? '🥇' : (item.rank === 2 ? '🥈' : (item.rank === 3 ? '🥉' : `#${item.rank}`))}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-200">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">[{item.code}] • {item.status}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-base text-white">{item.score}</span>
                      <span className="text-slate-500 text-[10px]">/ 100</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                      item.score >= 90
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : (item.score >= 80 ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30')
                    }`}>
                      {item.badge}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">{item.efficiency_factor}%</td>
                  <td className="py-4 px-4 font-mono text-solar-400">{item.solar_factor}%</td>
                  <td className="py-4 px-4 font-mono text-brand-400">{item.waste_reduction_factor}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Factor Rubric Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bento-card p-5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2">
            1. Efficiency (40%)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Measures baseline kWh consumption per square foot against standardized ASHRAE 90.1 university benchmarks.
          </p>
        </div>
        <div className="bento-card p-5">
          <h4 className="text-xs font-bold text-solar-400 uppercase tracking-wider font-mono mb-2">
            2. Solar Absorption (25%)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates the proportion of building loads powered directly by onsite rooftop PV generation versus utility grid import.
          </p>
        </div>
        <div className="bento-card p-5">
          <h4 className="text-xs font-bold text-electric-400 uppercase tracking-wider font-mono mb-2">
            3. Occupancy Density (20%)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Correlates active headcount against ventilation rates to ensure HVAC is not over-conditioning empty rooms.
          </p>
        </div>
        <div className="bento-card p-5">
          <h4 className="text-xs font-bold text-brand-300 uppercase tracking-wider font-mono mb-2">
            4. Waste Mitigation (15%)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Penalizes unaddressed anomalies such as phantom plug-loads, nighttime chiller cycling, or daylighting override.
          </p>
        </div>
      </div>

    </div>
  );
}
