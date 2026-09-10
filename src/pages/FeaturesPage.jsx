import React from 'react';
import { 
  Zap, 
  Sun, 
  BatteryCharging, 
  Users, 
  TrendingUp, 
  Lightbulb, 
  LayoutDashboard, 
  Cpu, 
  Bot, 
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function FeaturesPage({ onNavigate }) {
  const features = [
    {
      id: 'energy',
      title: 'Energy Consumption',
      icon: Zap,
      accent: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
      description: 'Continuous smart-metering across classrooms, labs, and dorms. Instant identification of anomalous base-loads and time-of-use cost spikes.',
      metrics: ['Current load: 2,351 kW', 'Highest: Sci & Bio-Tech (742 kW)', 'Daily total: 24,580 kWh'],
      targetTab: 'energy',
      colSpan: 'md:col-span-2'
    },
    {
      id: 'solar',
      title: 'Solar Generation',
      icon: Sun,
      accent: 'text-solar-400 bg-solar-500/10 border-solar-500/20',
      description: 'Monitor 1,450 kWp of rooftop and parking canopy photovoltaic arrays with real-time irradiance telemetry and tomorrow generation forecast.',
      metrics: ['Current: 842 kW', 'Efficiency: 94.2%', 'Forecast: 6,100 kWh'],
      targetTab: 'solar',
      colSpan: 'md:col-span-1'
    },
    {
      id: 'battery',
      title: 'Battery Monitoring & Dispatch',
      icon: BatteryCharging,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'AI calculates the optimum dispatch strategy for the 1.2 MWh LiFePO4 BESS: absorb clean midday solar surplus or shave expensive 28.6¢/kWh peak tariffs.',
      metrics: ['SOC: 78% Charging', 'Runtime: 6.8 hrs', 'Round-trip: 93.5%'],
      targetTab: 'battery',
      colSpan: 'md:col-span-1'
    },
    {
      id: 'occupancy',
      title: 'Occupancy vs. Energy Intensity',
      icon: Users,
      accent: 'text-electric-400 bg-electric-500/10 border-electric-500/20',
      description: 'Correlate real-time optical IoT occupancy counts against HVAC power draw to pinpoint empty buildings conditioning air needlessly.',
      metrics: ['Headcount: 3,240 people', 'Capacity: 10,950', 'Watts/Occupant: 725 W'],
      targetTab: 'occupancy',
      colSpan: 'md:col-span-2'
    },
    {
      id: 'prediction',
      title: 'AI Energy Prediction',
      icon: TrendingUp,
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Scikit-learn diurnal regression models predict hourly campus energy demand and solar generation 24 hours in advance with 95% confidence intervals.',
      metrics: ['Tomorrow Peak: 2,180 kW', 'Expected: 15:00', 'Confidence: 94%'],
      targetTab: 'prediction',
      colSpan: 'md:col-span-1'
    },
    {
      id: 'recommendations',
      title: 'AI Recommendation Engine',
      icon: Lightbulb,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Rule-based and heuristic anomaly engines flag practical conservation measures, estimated kWh savings, and one-click dispatch to campus BMS.',
      metrics: ['4 Active actions', 'Potential saving: 1,040 kWh', 'Value: $212.80/day'],
      targetTab: 'recommendations',
      colSpan: 'md:col-span-2'
    },
    {
      id: 'simulator',
      title: 'What-If Scenario Simulator',
      icon: Cpu,
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: 'Interactive sliders simulate changing campus occupancy (+20%), solar expansion (+30%), or conservation targets with instant recalculation of cost and carbon impact.',
      metrics: ['Interactive sliders', 'Financial ROI projection', 'Carbon delta tracking'],
      targetTab: 'simulator',
      colSpan: 'md:col-span-1'
    },
    {
      id: 'copilot',
      title: 'AI Energy Copilot',
      icon: Bot,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Natural language energy assistant that answers complex facility inquiries, diagnoses equipment anomalies, and suggests automated setpoint adjustments.',
      metrics: ['Prompt chips', 'Structured card outputs', 'Context-aware reasoning'],
      targetTab: 'copilot',
      colSpan: 'md:col-span-1'
    },
    {
      id: 'greenscore',
      title: 'Green Building Score',
      icon: Award,
      accent: 'text-brand-300 bg-brand-500/10 border-brand-500/20',
      description: 'Holistic 100-point sustainability rating for every campus building based on energy efficiency, solar self-consumption, occupancy density, and waste reduction.',
      metrics: ['Campus Avg: 84.5/100', 'Leader: Library (94)', 'LEED Platinum tier'],
      targetTab: 'greenscore',
      colSpan: 'md:col-span-1'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Complete Ecoflux Bento Suite
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            A unified suite of intelligence modules engineered specifically for smart campus facilities directors and university sustainability officers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => onNavigate('dashboard', f.targetTab)}
                className={`bento-card p-6 sm:p-7 cursor-pointer group flex flex-col justify-between ${f.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${f.accent} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-brand-400 flex items-center gap-1">
                      <span>Open View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {f.description}
                  </p>
                </div>

                {/* Micro metrics pill list */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {f.metrics.map((m, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
