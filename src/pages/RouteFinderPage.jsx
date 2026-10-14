import React, { useState } from 'react';
import RouteFinder from '../components/RouteFinder';
import AlgorithmSteps from '../components/AlgorithmSteps';
import { campusGraph } from '../data/campusGraph';
import { Navigation } from 'lucide-react';

export default function RouteFinderPage() {
  // Lift result state so AlgorithmSteps can share the same execution trace
  const [result, setResult] = useState(null);
  const nodeMap = Object.fromEntries(campusGraph.nodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Navigation size={22} className="text-indigo-400" />
          Route Finder
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select a source and destination to compute the shortest walking route using Dijkstra's Algorithm.
        </p>
      </div>

      <RouteFinder showMap={true} onResult={setResult} />

      {/* Algorithm step viewer — only shown after a route has been computed */}
      {result?.steps?.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded-full bg-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Algorithm Step-by-Step
            </h2>
          </div>
          <AlgorithmSteps steps={result.steps} nodeMap={nodeMap} />
        </div>
      )}
    </div>
  );
}
