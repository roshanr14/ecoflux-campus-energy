import React, { useState } from 'react';
import { 
  Building2, 
  Sun, 
  BatteryCharging, 
  Users, 
  Cpu, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight,
  Database,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function HowItWorksPage({ onNavigate }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Data Sources & Telemetry",
      subtitle: "Multi-Sensor Campus Data Ingestion",
      icon: Database,
      accent: "text-electric-400 bg-electric-500/10 border-electric-500/30",
      description: "Smart sub-meters, rooftop solar inverters, battery management systems (BMS), and IoT optical occupancy counters stream high-frequency telemetry every 60 seconds.",
      items: [
        { label: "Building Smart Sub-meters", detail: "Classrooms, bio-tech labs, hostels & libraries" },
        { label: "Solar Inverter Telemetry", detail: "1,450 kWp rooftop & canopy generation arrays" },
        { label: "Battery Storage (BESS)", detail: "State of Charge (SOC), cell temps, round-trip efficiency" },
        { label: "IoT Occupancy Sensors", detail: "Room-by-room headcount & density metrics" }
      ]
    },
    {
      step: 2,
      title: "Ecoflux Intelligence Engine",
      subtitle: "FastAPI + Python + AI Processing Layer",
      icon: Cpu,
      accent: "text-brand-400 bg-brand-500/10 border-brand-500/30",
      description: "FastAPI serves as the high-throughput bridge connecting campus telemetry with Python analytical pipelines, validating schemas and orchestrating machine learning models in real time.",
      items: [
        { label: "Async FastAPI Core", detail: "Sub-millisecond data routing and API gateway" },
        { label: "Data Normalization & Cleaning", detail: "Noise filtering, gap filling, and unit reconciliation" },
        { label: "Dynamic Tariff Synchronization", detail: "Real-time utility time-of-use (TOU) price integration" },
        { label: "Secure Role-Based Access", detail: "Enterprise-grade facilities access and audit logging" }
      ]
    },
    {
      step: 3,
      title: "AI Analysis & Modeling",
      subtitle: "Machine Learning & Optimization Pipelines",
      icon: TrendingUp,
      accent: "text-solar-400 bg-solar-500/10 border-solar-500/30",
      description: "Scikit-learn algorithms and heuristic solvers analyze campus consumption patterns to forecast future electricity demand, evaluate solar irradiance, and model battery dispatch.",
      items: [
        { label: "Demand Forecasting Regressors", detail: "Ridge regression with confidence interval bounding" },
        { label: "Battery Dispatch Optimization", detail: "Solar arbitrage vs. peak demand shaving algorithms" },
        { label: "Occupancy vs. Load Correlation", detail: "Identifies spaces running HVAC with low occupant counts" },
        { label: "What-If Scenario Engine", detail: "Calculates cost and carbon impact of proposed shifts" }
      ]
    },
    {
      step: 4,
      title: "Smart Decisions & Automation",
      subtitle: "Measurable Campus Energy Outcomes",
      icon: CheckCircle2,
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      description: "Actionable directives are routed to facilities directors, building automation systems (BAS), and campus sustainability dashboards to eliminate energy waste.",
      items: [
        { label: "Immediate Cost Reduction", detail: "Avoid up to 28.6¢/kWh peak demand surcharges" },
        { label: "Maximum Solar Utilization", detail: "Zero solar curtailment through battery buffering" },
        { label: "Automated HVAC Setbacks", detail: "Dynamic ventilation adjustment in low-density buildings" },
        { label: "Campus Green Building Index", detail: "Quantified LEED/GRESB sustainability scores" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            System Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Ecoflux Powers Smarter Campuses
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Follow the continuous lifecycle of campus energy from physical IoT hardware to intelligent automated actions.
          </p>
        </div>

        {/* Step Progression Visual */}
        <div className="space-y-8 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === s.step;

            return (
              <div key={s.step} className="relative">
                {/* Connecting arrow line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-slate-700 via-brand-500/50 to-slate-700 -mb-8 z-0"></div>
                )}

                <div 
                  onClick={() => setActiveStep(s.step)}
                  className={`bento-card p-6 sm:p-8 cursor-pointer transition-all duration-300 relative z-10 ${
                    isSelected ? 'border-brand-500/50 shadow-xl shadow-brand-500/10 bg-slate-900/90' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    
                    {/* Step Icon Badge */}
                    <div className="flex items-center gap-4 md:flex-col md:items-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg ${s.accent}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        STAGE 0{s.step}
                      </span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider font-mono">
                          {s.subtitle}
                        </span>
                        <h3 className="text-2xl font-bold text-white mt-1">{s.title}</h3>
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">{s.description}</p>
                      </div>

                      {/* Detail Items Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {s.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                            <p className="text-xs font-semibold text-slate-200">{item.label}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Mobile step connector */}
                {idx < steps.length - 1 && (
                  <div className="flex md:hidden justify-center py-2 text-slate-600">
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center bento-card p-8 bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-950 border-brand-500/30">
          <h3 className="text-2xl font-bold text-white mb-2">Experience the Intelligence in Action</h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Explore live building meters, adjust What-If scenarios, and ask the AI Energy Copilot for actionable insights.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 transition-colors"
            >
              Open Smart Dashboard
            </button>
            <button
              onClick={() => onNavigate('dashboard', 'simulator')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors"
            >
              Run Scenario Simulation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
