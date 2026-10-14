/**
 * routeUtils.js
 * -------------
 * Shared utilities used across the CampusRide UI.
 * Pure functions — no side effects.
 */

import { estimateWalkingTime } from '../algorithms/dijkstra';

/** Format metres → human-readable string  (e.g. 1250 → "1.25 km") */
export function formatDistance(metres) {
  if (metres === Infinity || metres == null) return '—';
  if (metres < 1000) return `${metres} m`;
  return `${(metres / 1000).toFixed(2)} km`;
}

/** Format estimated walking time → human-readable string  (e.g. 14 → "~14 min") */
export function formatTime(distanceMetres) {
  if (distanceMetres === Infinity || distanceMetres == null) return '—';
  const mins = estimateWalkingTime(distanceMetres);
  if (mins === 0) return '< 1 min';
  return `~${mins} min`;
}

/** Return the set of edge keys that belong to a given path (for map highlighting). */
export function getPathEdgeKeys(path) {
  const keys = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    keys.add(`${path[i]}-${path[i + 1]}`);
    keys.add(`${path[i + 1]}-${path[i]}`); // undirected
  }
  return keys;
}

/** Node type → display colour class (Tailwind) */
export const NODE_TYPE_COLORS = {
  entrance:    { bg: 'bg-emerald-500',  text: 'text-emerald-700',  border: 'border-emerald-400',  hex: '#10b981' },
  academic:    { bg: 'bg-blue-500',     text: 'text-blue-700',     border: 'border-blue-400',     hex: '#3b82f6' },
  facility:    { bg: 'bg-purple-500',   text: 'text-purple-700',   border: 'border-purple-400',   hex: '#a855f7' },
  admin:       { bg: 'bg-orange-500',   text: 'text-orange-700',   border: 'border-orange-400',   hex: '#f97316' },
  residential: { bg: 'bg-rose-500',     text: 'text-rose-700',     border: 'border-rose-400',     hex: '#f43f5e' },
  recreation:  { bg: 'bg-teal-500',     text: 'text-teal-700',     border: 'border-teal-400',     hex: '#14b8a6' },
  synthetic:   { bg: 'bg-slate-500',    text: 'text-slate-700',    border: 'border-slate-400',    hex: '#64748b' },
};

export function nodeColor(type) {
  return NODE_TYPE_COLORS[type] ?? NODE_TYPE_COLORS.facility;
}
