import React from 'react';

/**
 * StatsCard
 * ---------
 * A reusable dashboard card that displays a single metric.
 *
 * Props:
 *  - icon       ReactNode
 *  - label      string
 *  - value      string | number
 *  - sub        string (optional subtitle)
 *  - accent     string (Tailwind colour class, e.g. 'indigo' | 'emerald' | 'purple' | 'orange')
 */
export default function StatsCard({ icon, label, value, sub, accent = 'indigo' }) {
  const accentMap = {
    indigo: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
    emerald:'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
    teal:   'bg-teal-600/20   text-teal-400   border-teal-500/30',
  };
  const cls = accentMap[accent] ?? accentMap.indigo;

  return (
    <div className="glass p-5 flex flex-col gap-3 hover:bg-white/[0.07] transition-colors">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${cls}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
