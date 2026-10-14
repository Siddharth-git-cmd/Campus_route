import React, { useMemo, useRef, useState, useEffect } from 'react';
import { getPathEdgeKeys, nodeColor } from '../utils/routeUtils';

const CANVAS_W = 1000;
const CANVAS_H = 1000;
const NODE_R = 22;

/**
 * CampusMap
 * ---------
 * SVG-based interactive campus map.
 *
 * Props:
 *  - graph    { nodes, edges }
 *  - path     string[] — ordered node IDs of the shortest path (empty = no highlight)
 *  - onNodeClick  (nodeId) => void  (optional)
 *  - source   string | null
 *  - destination string | null
 */
export default function CampusMap({ graph, path = [], onNodeClick, source, destination }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });

  // Responsive SVG size based on container
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setSize({ w, h: Math.max(300, w * 0.7) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const pathEdges = useMemo(() => getPathEdgeKeys(path), [path]);

  const scaleX = (x) => (x / CANVAS_W) * size.w;
  const scaleY = (y) => (y / CANVAS_H) * size.h;
  const scaleR = () => Math.max(12, (NODE_R / CANVAS_W) * size.w);

  if (!graph) return null;

  const { nodes, edges } = graph;
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
      >
        {/* Grid dots */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.8" fill="#334155" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

        {/* ── Edges ── */}
        {edges.map((edge) => {
          const a = nodeMap[edge.source];
          const b = nodeMap[edge.target];
          if (!a || !b) return null;
          const key = `${edge.source}-${edge.target}`;
          const isPath = pathEdges.has(key);
          const mx = (scaleX(a.x) + scaleX(b.x)) / 2;
          const my = (scaleY(a.y) + scaleY(b.y)) / 2;

          return (
            <g key={key}>
              {/* Glow for path edges */}
              {isPath && (
                <line
                  x1={scaleX(a.x)} y1={scaleY(a.y)}
                  x2={scaleX(b.x)} y2={scaleY(b.y)}
                  stroke="#6366f1" strokeWidth="10" strokeOpacity="0.25"
                  strokeLinecap="round"
                />
              )}
              <line
                x1={scaleX(a.x)} y1={scaleY(a.y)}
                x2={scaleX(b.x)} y2={scaleY(b.y)}
                stroke={isPath ? '#6366f1' : '#334155'}
                strokeWidth={isPath ? 3 : 1.5}
                strokeLinecap="round"
                strokeDasharray={isPath ? 'none' : '4 4'}
              />
              {/* Distance label */}
              <text
                x={mx} y={my - 4}
                textAnchor="middle"
                fontSize={Math.max(8, scaleR() * 0.45)}
                fill={isPath ? '#a5b4fc' : '#475569'}
                fontFamily="monospace"
              >
                {edge.distance}m
              </text>
            </g>
          );
        })}

        {/* Animated path dashes overlay */}
        {path.length > 1 &&
          path.slice(0, -1).map((id, i) => {
            const a = nodeMap[id];
            const b = nodeMap[path[i + 1]];
            if (!a || !b) return null;
            return (
              <line
                key={`anim-${id}`}
                x1={scaleX(a.x)} y1={scaleY(a.y)}
                x2={scaleX(b.x)} y2={scaleY(b.y)}
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                opacity="0.7"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0" to="-24"
                  dur="0.8s" repeatCount="indefinite"
                />
              </line>
            );
          })}

        {/* ── Nodes ── */}
        {nodes.map((node) => {
          const cx = scaleX(node.x);
          const cy = scaleY(node.y);
          const r = scaleR();
          const color = nodeColor(node.type);
          const inPath = path.includes(node.id);
          const isSource = node.id === source;
          const isDest = node.id === destination;
          const fontSize = Math.max(8, r * 0.55);

          return (
            <g
              key={node.id}
              onClick={() => onNodeClick?.(node.id)}
              style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
            >
              {/* Selection ring */}
              {(isSource || isDest) && (
                <circle cx={cx} cy={cy} r={r + 6}
                  fill="none"
                  stroke={isSource ? '#6366f1' : '#10b981'}
                  strokeWidth="2"
                  opacity="0.6"
                />
              )}
              {/* Path glow */}
              {inPath && !isSource && !isDest && (
                <circle cx={cx} cy={cy} r={r + 4}
                  fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.4"
                />
              )}

              {/* Node circle */}
              <circle
                cx={cx} cy={cy} r={r}
                fill={
                  isSource ? '#6366f1'
                  : isDest  ? '#10b981'
                  : inPath  ? '#4f46e5'
                  : '#1e293b'
                }
                stroke={
                  isSource ? '#818cf8'
                  : isDest  ? '#34d399'
                  : inPath  ? '#6366f1'
                  : color.hex
                }
                strokeWidth={inPath || isSource || isDest ? 2.5 : 1.5}
              />

              {/* Icon-like initial */}
              <text
                x={cx} y={cy + fontSize * 0.35}
                textAnchor="middle"
                fontSize={fontSize}
                fill="white"
                fontWeight="700"
                fontFamily="system-ui"
              >
                {node.name.charAt(0)}
              </text>

              {/* Label below */}
              <text
                x={cx} y={cy + r + fontSize + 2}
                textAnchor="middle"
                fontSize={Math.max(7, fontSize * 0.85)}
                fill={inPath || isSource || isDest ? '#c7d2fe' : '#94a3b8'}
                fontFamily="system-ui"
                fontWeight={inPath ? '600' : '400'}
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
        {[
          { color: '#6366f1', label: 'Source / Path' },
          { color: '#10b981', label: 'Destination' },
          { color: '#334155', label: 'Regular edge (dashed)' },
          { color: '#6366f1', label: 'Shortest route (solid)' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
