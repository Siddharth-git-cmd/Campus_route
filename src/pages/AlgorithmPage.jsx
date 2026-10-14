import React, { useState } from 'react';
import { Cpu, Clock, Database, Zap, PlayCircle, Loader2 } from 'lucide-react';
import { benchmarkDijkstra } from '../algorithms/dijkstra';
import AlgorithmSteps from '../components/AlgorithmSteps';
import { dijkstra } from '../algorithms/dijkstra';
import { campusGraph } from '../data/campusGraph';

const BENCHMARK_SIZES = [10, 25, 50, 100, 250, 500];

export default function AlgorithmPage() {
  const [benchResults, setBenchResults] = useState([]);
  const [running, setRunning]           = useState(false);
  const [demoSteps, setDemoSteps]       = useState([]);

  const nodeMap = Object.fromEntries(campusGraph.nodes.map((n) => [n.id, n]));

  async function runBenchmark() {
    setRunning(true);
    setBenchResults([]);
    const results = [];
    for (const size of BENCHMARK_SIZES) {
      // Yield to browser between each run so UI stays responsive
      await new Promise((r) => setTimeout(r, 0));
      results.push(benchmarkDijkstra(size));
      setBenchResults([...results]);
    }
    setRunning(false);
  }

  function runDemo() {
    const r = dijkstra(campusGraph, 'cse', 'hostel');
    setDemoSteps(r.steps);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu size={22} className="text-indigo-400" />
          Algorithm Analysis
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Theoretical background, complexity analysis, and live performance benchmarks.
        </p>
      </div>

      {/* Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <InfoCard icon={<Cpu size={20} />} label="Algorithm" value="Dijkstra's Shortest Path" accent="indigo" />
        <InfoCard icon={<Zap size={20} />} label="Category" value="Greedy Algorithm" accent="purple" />
        <InfoCard icon={<Database size={20} />} label="Graph Type" value="Weighted, Undirected" accent="orange" />
      </div>

      {/* Purpose */}
      <div className="glass p-6 space-y-3">
        <h2 className="font-semibold text-white">Purpose</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Dijkstra's Algorithm finds the shortest path from a <em className="text-indigo-300">single source</em> node
          to all other nodes in a weighted graph with <strong className="text-slate-200">non-negative edge weights</strong>.
          In CampusRide, the source is the student's current location and the algorithm returns the minimum-distance
          walking route to the destination.
        </p>
      </div>

      {/* Complexity */}
      <div className="glass p-6 space-y-5">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <Clock size={18} className="text-indigo-400" /> Complexity Analysis
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ComplexBox
            title="Time Complexity"
            formula="O(V²)"
            detail="Simple array-based priority selection — for each of V vertices, we scan all remaining unvisited nodes to find the minimum. Suitable for dense graphs or small V (like a campus)."
            color="indigo"
          />
          <ComplexBox
            title="Space Complexity"
            formula="O(V + E)"
            detail="Adjacency list: O(V + E). Distance table: O(V). Previous-node table: O(V). Visited set: O(V). Total: O(V + E)."
            color="purple"
          />
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Variables</p>
          <ul className="list-disc list-inside space-y-1">
            <li><code className="text-indigo-300">V</code> — number of vertices (campus locations)</li>
            <li><code className="text-indigo-300">E</code> — number of edges (pathways)</li>
          </ul>
          <p className="mt-2 text-xs text-slate-500">
            Note: Using a min-heap priority queue would reduce time complexity to O((V + E) log V).
            The simple O(V²) implementation is intentional here for readability and DAA demonstration clarity.
          </p>
        </div>
      </div>

      {/* Algorithm pseudocode */}
      <div className="glass p-6 space-y-3">
        <h2 className="font-semibold text-white">Pseudocode</h2>
        <pre className="bg-slate-900 rounded-xl p-4 text-xs text-slate-300 leading-relaxed overflow-x-auto scrollbar-thin font-mono">
{`function dijkstra(graph, source, destination):
  dist[source] = 0
  dist[all others] = ∞
  prev[all] = null
  visited = {}

  while unvisited nodes remain:
    u = unvisited node with minimum dist[u]
    if u == destination: break

    mark u as visited

    for each neighbour v of u:
      candidate = dist[u] + weight(u, v)
      if candidate < dist[v]:
        dist[v] = candidate
        prev[v] = u

  // Reconstruct path
  path = []
  cur = destination
  while cur != null:
    path.prepend(cur)
    cur = prev[cur]

  return { path, distance: dist[destination] }`}
        </pre>
      </div>

      {/* Demo step trace */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Step-by-Step Demo</h2>
          <button
            onClick={runDemo}
            className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            <PlayCircle size={16} />
            Show Algorithm Steps (CSE → Hostel)
          </button>
        </div>
        <AlgorithmSteps steps={demoSteps} nodeMap={nodeMap} />
      </div>

      {/* Performance benchmark */}
      <div className="glass p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-white">Performance Benchmark</h2>
          <button
            onClick={runBenchmark}
            disabled={running}
            className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            {running ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            {running ? 'Running…' : 'Run Benchmark'}
          </button>
        </div>
        <p className="text-slate-500 text-xs">
          Runs Dijkstra on synthetic random graphs of increasing size. Uses{' '}
          <code className="text-slate-400">performance.now()</code> — all times are real measurements.
        </p>

        {benchResults.length > 0 && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="text-left pb-2 pr-6">Nodes (V)</th>
                  <th className="text-left pb-2 pr-6">Edges (E)</th>
                  <th className="text-right pb-2">Time (ms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {benchResults.map((r) => (
                  <tr key={r.nodeCount} className="text-slate-300">
                    <td className="py-2 pr-6 font-mono">{r.nodeCount}</td>
                    <td className="py-2 pr-6 font-mono">{r.edgeCount}</td>
                    <td className="py-2 text-right font-mono text-emerald-300">{r.timeMs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {benchResults.length === 0 && !running && (
          <p className="text-slate-600 text-sm italic">Click "Run Benchmark" to measure actual performance.</p>
        )}
      </div>

      {/* Correctness verification */}
      <div className="glass p-6 space-y-4">
        <h2 className="font-semibold text-white">Correctness Verification</h2>
        <p className="text-slate-400 text-sm">
          The following test cases were manually verified against hand-calculated expected results:
        </p>
        <VerificationTable />
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function InfoCard({ icon, label, value, accent }) {
  const cls = {
    indigo: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
    purple: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
  }[accent] ?? '';
  return (
    <div className="glass p-5 space-y-2">
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${cls}`}>
        {icon}
      </div>
      <p className="text-slate-500 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  );
}

function ComplexBox({ title, formula, detail, color }) {
  const cls = { indigo: 'text-indigo-300', purple: 'text-purple-300' }[color] ?? 'text-slate-300';
  return (
    <div className="bg-slate-800/60 rounded-xl p-5 space-y-2">
      <p className="text-slate-400 text-xs uppercase tracking-wider">{title}</p>
      <p className={`font-mono font-bold text-2xl ${cls}`}>{formula}</p>
      <p className="text-slate-500 text-xs leading-relaxed">{detail}</p>
    </div>
  );
}

function VerificationTable() {
  // Build tiny inline graphs, run dijkstra, compare with expected
  const cases = [
    {
      desc: 'Simple triangle: A→B=4, A→C=2, C→B=1',
      graph: {
        nodes: [
          { id: 'A', name: 'A', type: 'synthetic' },
          { id: 'B', name: 'B', type: 'synthetic' },
          { id: 'C', name: 'C', type: 'synthetic' },
        ],
        edges: [
          { source: 'A', target: 'B', distance: 4 },
          { source: 'A', target: 'C', distance: 2 },
          { source: 'C', target: 'B', distance: 1 },
        ],
      },
      src: 'A', dst: 'B',
      expectedPath: 'A → C → B',
      expectedDist: 3,
    },
    {
      desc: 'Linear: A→B=10, B→C=5, A→C=20',
      graph: {
        nodes: [
          { id: 'A', name: 'A', type: 'synthetic' },
          { id: 'B', name: 'B', type: 'synthetic' },
          { id: 'C', name: 'C', type: 'synthetic' },
        ],
        edges: [
          { source: 'A', target: 'B', distance: 10 },
          { source: 'B', target: 'C', distance: 5 },
          { source: 'A', target: 'C', distance: 20 },
        ],
      },
      src: 'A', dst: 'C',
      expectedPath: 'A → B → C',
      expectedDist: 15,
    },
    {
      desc: 'Same source & destination',
      graph: {
        nodes: [{ id: 'A', name: 'A', type: 'synthetic' }],
        edges: [],
      },
      src: 'A', dst: 'A',
      expectedPath: 'A',
      expectedDist: 0,
    },
  ];

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-slate-500 text-xs uppercase tracking-wider">
            <th className="text-left pb-2 pr-4">Test Case</th>
            <th className="text-left pb-2 pr-4">Expected Path</th>
            <th className="text-right pb-2 pr-4">Expected Dist</th>
            <th className="text-right pb-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {cases.map((tc, i) => {
            const r = dijkstra(tc.graph, tc.src, tc.dst);
            const actualPath = r.path.join(' → ');
            const pass = actualPath === tc.expectedPath && r.distance === tc.expectedDist;
            return (
              <tr key={i} className="text-slate-300">
                <td className="py-2 pr-4 text-xs text-slate-400">{tc.desc}</td>
                <td className="py-2 pr-4 font-mono text-xs">{tc.expectedPath}</td>
                <td className="py-2 pr-4 text-right font-mono text-xs">{tc.expectedDist}</td>
                <td className="py-2 text-right">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    pass ? 'bg-emerald-900/50 text-emerald-400' : 'bg-rose-900/50 text-rose-400'
                  }`}>
                    {pass ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
