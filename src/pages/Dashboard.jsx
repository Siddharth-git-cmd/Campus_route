import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GitBranch, Cpu, Navigation2, ArrowRight, TrendingUp } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { campusGraph } from '../data/campusGraph';
import { formatDistance } from '../utils/routeUtils';

export default function Dashboard() {
  const { nodes, edges } = campusGraph;

  // Derive stats from actual graph data
  const totalNodes = nodes.length;
  const totalEdges = edges.length;
  const avgDist    = Math.round(edges.reduce((s, e) => s + e.distance, 0) / edges.length);

  // Node type breakdown
  const typeCounts = nodes.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Route Optimization Active
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          CampusRide
        </h1>
        <p className="text-slate-400 text-base max-w-lg">
          Find the shortest route across campus using{' '}
          <span className="text-indigo-300 font-semibold">Dijkstra's Algorithm</span>.
          Select any two locations and get the optimal walking path instantly.
        </p>
      </div>

      {/* Quick action */}
      <Link
        to="/route"
        className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors group"
      >
        <Navigation2 size={18} />
        Find a Route
        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<MapPin size={20} />}
          label="Campus Locations"
          value={totalNodes}
          sub={`${Object.keys(typeCounts).length} location types`}
          accent="indigo"
        />
        <StatsCard
          icon={<GitBranch size={20} />}
          label="Available Routes"
          value={totalEdges}
          sub="Bidirectional pathways"
          accent="purple"
        />
        <StatsCard
          icon={<Cpu size={20} />}
          label="Algorithm"
          value="Dijkstra"
          sub="O(V²) time complexity"
          accent="orange"
        />
        <StatsCard
          icon={<TrendingUp size={20} />}
          label="Avg. Path Length"
          value={formatDistance(avgDist)}
          sub="Average edge weight"
          accent="emerald"
        />
      </div>

      {/* Location type breakdown */}
      <div className="glass p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Campus Location Types
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} className="bg-slate-800/60 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-slate-300 capitalize text-sm">{type}</span>
              <span className="text-indigo-400 font-bold text-sm">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All locations */}
      <div className="glass p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          All Locations
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {nodes.map((n) => (
            <div key={n.id} className="flex items-center gap-2 px-3 py-2 bg-slate-800/40 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
              <span className="text-slate-300 text-sm">{n.name}</span>
              <span className="ml-auto text-slate-600 text-xs capitalize">{n.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture note */}
      <div className="glass p-6 border-l-4 border-indigo-500 space-y-2">
        <p className="text-xs text-indigo-400 uppercase font-semibold tracking-wider">
          CampusRide Architecture
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          The routing engine (<code className="text-indigo-300">dijkstra.js</code>) and campus data (
          <code className="text-indigo-300">campusGraph.js</code>) are fully decoupled from this UI.
          When the full CampusRide platform is built, they can be extracted and used as the backend
          routing service without any algorithm changes.
        </p>
      </div>
    </div>
  );
}
