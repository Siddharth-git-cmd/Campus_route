import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Play, RotateCcw } from 'lucide-react';

/**
 * AlgorithmSteps
 * --------------
 * Step-by-step Dijkstra execution viewer.
 * Receives `steps` from the dijkstra() return value.
 */
export default function AlgorithmSteps({ steps = [], nodeMap = {} }) {
  const [current, setCurrent] = useState(0);

  if (!steps.length) {
    return (
      <div className="glass p-6 text-slate-500 text-sm">
        Run a route query first to see step-by-step algorithm execution.
      </div>
    );
  }

  const step = steps[current];

  return (
    <div className="glass p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Algorithm Execution</h3>
        <span className="text-xs text-slate-500">
          Step {current + 1} / {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step card */}
      <div className="bg-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
            {step.step}
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-300">{step.description}</p>
            <p className="text-sm text-slate-300 mt-1">{step.note}</p>
          </div>
        </div>

        {/* Current node */}
        <div className="flex gap-3 flex-wrap">
          <Badge label="Current node" value={step.currentNodeName} color="indigo" />
          {step.visited?.length > 0 && (
            <Badge
              label="Visited"
              value={step.visited.map((id) => nodeMap[id]?.name ?? id).join(', ')}
              color="emerald"
            />
          )}
        </div>

        {/* Neighbours updated */}
        {step.neighbours?.length > 0 && (
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Neighbours</p>
            <div className="flex flex-col gap-1.5">
              {step.neighbours.map((nb) => (
                <div
                  key={nb.id}
                  className={`flex items-center justify-between text-sm px-3 py-1.5 rounded-lg ${
                    nb.updated
                      ? 'bg-emerald-900/30 border border-emerald-700/40 text-emerald-300'
                      : 'bg-slate-700/40 text-slate-400'
                  }`}
                >
                  <span>{nb.name}</span>
                  <span className="font-mono text-xs">
                    {nb.updated
                      ? `Updated → ${nb.newDist}m`
                      : `Kept at ${nb.existingDist}m`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrent(0)}
          disabled={current === 0}
          className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 transition"
          title="Restart"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 transition"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 flex justify-center gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'bg-indigo-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
          disabled={current === steps.length - 1}
          className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 transition"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => setCurrent(steps.length - 1)}
          disabled={current === steps.length - 1}
          className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-30 transition"
          title="Jump to end"
        >
          <Play size={16} />
        </button>
      </div>
    </div>
  );
}

function Badge({ label, value, color }) {
  const cls = {
    indigo:  'bg-indigo-900/40 border-indigo-600/40 text-indigo-300',
    emerald: 'bg-emerald-900/40 border-emerald-600/40 text-emerald-300',
  }[color] ?? '';
  return (
    <div className={`border rounded-lg px-3 py-1.5 text-xs max-w-xs ${cls}`}>
      <span className="opacity-60 uppercase tracking-wider mr-1">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
