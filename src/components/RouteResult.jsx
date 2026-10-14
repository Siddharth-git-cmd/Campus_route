import React from 'react';
import { MapPin, Clock, Footprints, CheckCircle2 } from 'lucide-react';
import { formatDistance, formatTime } from '../utils/routeUtils';

/**
 * RouteResult
 * -----------
 * Displays the shortest path computed by Dijkstra, along with distance,
 * walking time, and stop count.
 */
export default function RouteResult({ result, graph }) {
  if (!result) return null;

  const { path, distance, hops } = result;
  const nodeMap = Object.fromEntries((graph?.nodes ?? []).map((n) => [n.id, n]));

  const isNoRoute = path.length === 0;
  const isSameNode = path.length === 1;

  if (isSameNode) {
    return (
      <div className="glass p-6 flex items-center gap-3 text-amber-400">
        <CheckCircle2 size={22} />
        <p className="font-medium">You're already at this location.</p>
      </div>
    );
  }

  if (isNoRoute) {
    return (
      <div className="glass p-6 flex items-center gap-3 text-rose-400">
        <MapPin size={22} />
        <p className="font-medium">No route is currently available between these locations.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Shortest Route Found
        </h3>
      </div>

      {/* Path steps */}
      <ol className="flex flex-col gap-0">
        {path.map((id, i) => {
          const node = nodeMap[id];
          const isLast = i === path.length - 1;
          return (
            <li key={id} className="flex flex-col">
              <div className="flex items-center gap-3">
                {/* Step indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    i === 0
                      ? 'bg-indigo-600 text-white'
                      : isLast
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{node?.name ?? id}</p>
                  <p className="text-xs text-slate-500 capitalize">{node?.type ?? ''}</p>
                </div>
              </div>
              {/* Connector */}
              {!isLast && (
                <div className="ml-4 flex flex-col items-center">
                  <div className="w-0.5 h-5 bg-gradient-to-b from-indigo-500/60 to-transparent" />
                  <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
        <Metric icon={<MapPin size={15} />}      label="Distance"  value={formatDistance(distance)} accent="indigo" />
        <Metric icon={<Clock size={15} />}        label="Time"      value={formatTime(distance)}     accent="emerald" />
        <Metric icon={<Footprints size={15} />}   label="Stops"     value={hops}                     accent="purple" />
        <Metric icon={<CheckCircle2 size={15} />} label="Algorithm" value="Dijkstra"                 accent="orange" />
      </div>
    </div>
  );
}

function Metric({ icon, label, value, accent }) {
  const cls = {
    indigo:  'text-indigo-400',
    emerald: 'text-emerald-400',
    purple:  'text-purple-400',
    orange:  'text-orange-400',
  }[accent] ?? 'text-slate-400';
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <div className={`flex items-center gap-1.5 mb-1 ${cls}`}>
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  );
}
