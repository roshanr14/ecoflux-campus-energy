import React from 'react';
import { 
  Palette, 
  Layers, 
  Type, 
  CheckCircle2, 
  ExternalLink, 
  Sliders, 
  LayoutGrid,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function FigmaSpecView() {
  const colorTokens = [
    { name: 'Brand Emerald 500', hex: '#10B981', class: 'bg-emerald-500', usage: 'Primary brand, optimal states, confirm buttons' },
    { name: 'Brand Emerald 600', hex: '#059669', class: 'bg-emerald-600', usage: 'Hover states, dark green gradients' },
    { name: 'Solar Amber 500', hex: '#F59E0B', class: 'bg-amber-500', usage: 'Solar PV generation, warnings, midday metrics' },
    { name: 'Electric Cyan 400', hex: '#38BDF8', class: 'bg-sky-400', usage: 'Grid electricity, AI telemetry, data nodes' },
    { name: 'Dark Surface', hex: '#0D1322', class: 'bg-[#0d1322]', usage: 'Bento card backgrounds, modals, dropdowns' },
    { name: 'Dark Background', hex: '#080C14', class: 'bg-[#080c14]', usage: 'Primary page canvas background' },
    { name: 'Rose Anomaly 500', hex: '#EF4444', class: 'bg-red-500', usage: 'High consumption alerts, waste flags' }
  ];

  const figmaPages = [
    { num: "01", name: "Cover & Brand Identity", status: "Completed" },
    { num: "02", name: "Design System & Tokens (Typography, Color, Spacing)", status: "Completed" },
    { num: "03", name: "Landing / Hero Experience (3D Canvas & Ticker)", status: "Completed" },
    { num: "04", name: "How Ecoflux Works (4-Stage Pipeline)", status: "Completed" },
    { num: "05", name: "Features Showcase Bento Grid", status: "Completed" },
    { num: "06", name: "Authentication & OAuth (Split-Screen)", status: "Completed" },
    { num: "07", name: "User Onboarding Setup Wizard", status: "Completed" },
    { num: "08", name: "Smart Dashboard Master Overview", status: "Completed" },
    { num: "09", name: "Building Energy Consumption Analytics", status: "Completed" },
    { num: "10", name: "Solar Photovoltaic Monitoring", status: "Completed" },
    { num: "11", name: "BESS Battery Storage Optimizer", status: "Completed" },
    { num: "12", name: "Occupancy vs. Energy Intensity Correlation", status: "Completed" },
    { num: "13", name: "Scikit-Learn ML Demand Prediction", status: "Completed" },
    { num: "14", name: "AI Recommendation Action Center", status: "Completed" },
    { num: "15", name: "What-If Scenario Sandbox Simulator", status: "Completed" },
    { num: "16", name: "AI Energy Copilot Conversational Drawer", status: "Completed" },
    { num: "17", name: "Campus Green Building Score Leaderboard", status: "Completed" },
    { num: "18", name: "Mobile Responsive Bento Layouts", status: "Completed" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bento-card p-6 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Figma + Stitch Design System Specifications</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Enterprise design tokens, component architecture, and 18 production Figma view specifications created for the Ecoflux platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            Figma Tokens v2.4
          </span>
        </div>
      </div>

      {/* Color Tokens Matrix */}
      <div className="bento-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Curated Energy Color Tokens</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {colorTokens.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className={`w-full h-12 rounded-lg ${c.class} shadow-inner border border-white/10 flex items-center justify-end p-2`}>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-white">
                  {c.hex}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{c.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{c.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Scale */}
      <div className="bento-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <Type className="w-4 h-4 text-brand-400" />
          <span>Modern Typography Scale (Plus Jakarta Sans & JetBrains Mono)</span>
        </h3>

        <div className="divide-y divide-slate-800/60 text-xs">
          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-400 font-mono">Display Hero (72px / Bold / -0.02em)</span>
            <span className="text-2xl font-extrabold text-white">Powering Smarter Campuses</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-400 font-mono">Section Header (32px / Bold)</span>
            <span className="text-xl font-bold text-white">Campus Building Energy Analytics</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-400 font-mono">Telemetry Mono (24px / SemiBold)</span>
            <span className="font-mono text-lg font-bold text-brand-400">24,580 kWh • 60.02 Hz</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <span className="text-slate-400 font-mono">Body Regular (14px / Regular)</span>
            <span className="text-slate-300">Continuous energy conservation measures for college facilities.</span>
          </div>
        </div>
      </div>

      {/* 18 Figma Production Pages Architecture */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-solar-400" />
            <span>Figma Architecture & Screen Hierarchy (18 Canvas Views)</span>
          </h3>
          <span className="text-xs text-brand-400 font-mono font-semibold">100% Implemented in Code</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {figmaPages.map((p) => (
            <div key={p.num} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-brand-400">{p.num}</span>
                <span className="text-xs font-semibold text-slate-200">{p.name}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
