import React, { useState } from 'react';
import { dijkstra } from '../algorithms/dijkstra';
import { campusGraph } from '../data/campusGraph';
import RouteResult from './RouteResult';
import CampusMap from './CampusMap';
import { Navigation, RefreshCw } from 'lucide-react';

/**
 * RouteFinder
 * -----------
 * The main interactive panel:  Source → Destination → Dijkstra → Result + Map
 */
export default function RouteFinder({ showMap = true, onResult }) {
  const [source, setSource]      = useState('');
  const [dest, setDest]          = useState('');
  const [result, setResult]      = useState(null);
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState('');

  const nodes = campusGraph.nodes;

  function handleFind(e) {
    e.preventDefault();
    setError('');

    if (!source) { setError('Please select a starting location.'); return; }
    if (!dest)   { setError('Please select a destination.'); return; }

    setLoading(true);
    // Use setTimeout(0) so React re-renders the loading state before the sync algorithm
    setTimeout(() => {
      const r = dijkstra(campusGraph, source, dest);
      setResult(r);
      onResult?.(r);
      setLoading(false);
    }, 0);
  }

  function handleReset() {
    setSource('');
    setDest('');
    setResult(null);
    setError('');
  }

  const destOptions = nodes.filter((n) => n.id !== source);
  const srcOptions  = nodes.filter((n) => n.id !== dest);

  return (
    <div className="space-y-6">
      {/* Search panel */}
      <form onSubmit={handleFind} className="glass p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Navigation size={20} className="text-indigo-400" />
          Find Shortest Route
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Source */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              From
            </label>
            <select
              value={source}
              onChange={(e) => { setSource(e.target.value); setResult(null); }}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select starting location</option>
              {srcOptions.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              To
            </label>
            <select
              value={dest}
              onChange={(e) => { setDest(e.target.value); setResult(null); }}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select destination</option>
              {destOptions.map((n) => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-rose-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><RefreshCw size={16} className="animate-spin" /> Calculating…</>
            ) : (
              <><Navigation size={16} /> Find Shortest Route</>
            )}
          </button>

          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-colors text-sm"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Result */}
      {result && <RouteResult result={result} graph={campusGraph} />}

      {/* Inline map */}
      {showMap && (
        <div className="glass p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Route Map
          </h3>
          <CampusMap
            graph={campusGraph}
            path={result?.path ?? []}
            source={source || undefined}
            destination={dest || undefined}
          />
        </div>
      )}
    </div>
  );
}
