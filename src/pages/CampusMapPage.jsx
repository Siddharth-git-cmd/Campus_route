import React from 'react';
import CampusMap from '../components/CampusMap';
import { campusGraph } from '../data/campusGraph';
import { Map } from 'lucide-react';
import { NODE_TYPE_COLORS } from '../utils/routeUtils';

export default function CampusMapPage() {
  const { nodes, edges } = campusGraph;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Map size={22} className="text-indigo-400" />
          Campus Map
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Visual overview of all campus locations and pathways with distances in metres.
        </p>
      </div>

      <div className="glass p-6">
        <CampusMap graph={campusGraph} path={[]} />
      </div>

      {/* Node type legend */}
      <div className="glass p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Location Types
        </h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(NODE_TYPE_COLORS).filter(([k]) => k !== 'synthetic').map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
              <div className="w-3 h-3 rounded-full" style={{ background: color.hex }} />
              <span className="text-slate-300 text-sm capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edge table */}
      <div className="glass p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Pathway Distances
        </h2>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left pb-2 pr-4">From</th>
                <th className="text-left pb-2 pr-4">To</th>
                <th className="text-right pb-2">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {edges.map((e, i) => {
                const src = campusGraph.nodes.find((n) => n.id === e.source);
                const tgt = campusGraph.nodes.find((n) => n.id === e.target);
                return (
                  <tr key={i} className="text-slate-300 hover:bg-white/5 transition">
                    <td className="py-2 pr-4">{src?.name ?? e.source}</td>
                    <td className="py-2 pr-4">{tgt?.name ?? e.target}</td>
                    <td className="py-2 text-right font-mono text-indigo-300">{e.distance} m</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
