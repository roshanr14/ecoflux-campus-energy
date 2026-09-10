import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  unit = '',
  comparisonText,
  comparisonTrend = 'down', // 'down' (usually good for energy) or 'up'
  icon: Icon,
  accentColor = 'brand', // brand, solar, electric, rose
  subtext
}) {
  const colorStyles = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20 group-hover:border-brand-500/40',
    solar: 'text-solar-400 bg-solar-500/10 border-solar-500/20 group-hover:border-solar-500/40',
    electric: 'text-electric-400 bg-electric-500/10 border-electric-500/20 group-hover:border-electric-500/40',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:border-rose-500/40'
  };

  return (
    <div className="bento-card p-5 sm:p-6 group flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border transition-colors ${colorStyles[accentColor]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white number-mono">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-semibold text-slate-400">
              {unit}
            </span>
          )}
        </div>

        {comparisonText && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {comparisonTrend === 'down' ? (
              <span className="flex items-center text-emerald-400 font-medium">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {comparisonText}
              </span>
            ) : (
              <span className="flex items-center text-amber-400 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {comparisonText}
              </span>
            )}
          </div>
        )}

        {subtext && !comparisonText && (
          <p className="mt-2 text-xs text-slate-400 truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
