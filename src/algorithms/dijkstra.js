/**
 * dijkstra.js
 * -----------
 * Core routing engine for CampusRide.
 *
 * This module is intentionally decoupled from all UI concerns so that it can
 * later be extracted and reused inside the full CampusRide platform without
 * any modification to the algorithm itself.
 *
 * Time Complexity  : O(V²) — simple array-based priority selection
 * Space Complexity : O(V + E) — adjacency list representation
 *
 * Future API compatibility:
 *   findRoute(pickupLocation, destinationLocation)  →  dijkstra(graph, src, dst)
 */

/**
 * Build an adjacency list from the flat edges array stored in campusGraph.js.
 *
 * @param {Array<{source: string, target: string, distance: number}>} edges
 * @returns {Object}  adjacency list  { nodeId: [{to, weight}, …] }
 */
export function buildAdjacencyList(edges) {
  const adj = {};
  for (const edge of edges) {
    if (!adj[edge.source]) adj[edge.source] = [];
    if (!adj[edge.target]) adj[edge.target] = [];

    adj[edge.source].push({ to: edge.target, weight: edge.distance });
    adj[edge.target].push({ to: edge.source, weight: edge.distance }); // undirected
  }
  return adj;
}

/**
 * Dijkstra's Shortest Path Algorithm
 *
 * Finds the shortest (minimum-weight) path from `sourceId` to `destinationId`
 * in a weighted, undirected graph.  All edge weights must be non-negative.
 *
 * @param {Object} graph   - { nodes: Array, edges: Array }
 * @param {string} sourceId
 * @param {string} destinationId
 *
 * @returns {{
 *   path: string[],          // ordered node IDs from source → destination
 *   distance: number,        // total distance in the same unit as edge weights
 *   hops: number,            // number of intermediate stops
 *   visitedNodes: number,    // how many nodes the algorithm explored
 *   steps: Array             // step-by-step log for the Algorithm Analysis page
 * }}
 *
 * Returns { path: [], distance: Infinity, … } when no path exists.
 */
export function dijkstra(graph, sourceId, destinationId) {
  // ── Guard clauses ────────────────────────────────────────────────────────
  if (!graph || !graph.nodes || !graph.edges) {
    return { path: [], distance: Infinity, hops: 0, visitedNodes: 0, steps: [] };
  }

  if (sourceId === destinationId) {
    return { path: [sourceId], distance: 0, hops: 0, visitedNodes: 0, steps: [] };
  }

  const nodeIds = graph.nodes.map((n) => n.id);
  const nodeMap = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));

  if (!nodeMap[sourceId] || !nodeMap[destinationId]) {
    return { path: [], distance: Infinity, hops: 0, visitedNodes: 0, steps: [] };
  }

  // ── Data structures ──────────────────────────────────────────────────────
  const adjacency = buildAdjacencyList(graph.edges);

  // dist[id] = current known shortest distance from source
  const dist = {};
  // prev[id] = previous node id on the shortest path
  const prev = {};
  // visited = set of node IDs already finalised
  const visited = new Set();

  const steps = []; // step log for the UI

  // Initialise distances to Infinity for all nodes except the source
  for (const id of nodeIds) {
    dist[id] = Infinity;
    prev[id] = null;
  }
  dist[sourceId] = 0;

  steps.push({
    step: 1,
    description: 'Initialise',
    currentNode: sourceId,
    currentNodeName: nodeMap[sourceId]?.name ?? sourceId,
    distances: { ...dist },
    visited: [],
    neighbours: [],
    note: `Set distance of "${nodeMap[sourceId]?.name}" to 0. All other nodes set to ∞.`,
  });

  let stepIndex = 2;

  // ── Main loop ────────────────────────────────────────────────────────────
  while (true) {
    // Select the unvisited node with the smallest known distance (O(V) scan)
    let u = null;
    let minDist = Infinity;
    for (const id of nodeIds) {
      if (!visited.has(id) && dist[id] < minDist) {
        minDist = dist[id];
        u = id;
      }
    }

    // No reachable unvisited node remains
    if (u === null) break;

    // Destination reached — we can stop early
    if (u === destinationId) break;

    visited.add(u);

    const neighbours = adjacency[u] ?? [];
    const neighbourLog = [];

    for (const { to, weight } of neighbours) {
      if (visited.has(to)) continue;

      const candidate = dist[u] + weight;
      if (candidate < dist[to]) {
        dist[to] = candidate;
        prev[to] = u;
        neighbourLog.push({
          id: to,
          name: nodeMap[to]?.name ?? to,
          newDist: candidate,
          weight,
          updated: true,
        });
      } else {
        neighbourLog.push({
          id: to,
          name: nodeMap[to]?.name ?? to,
          existingDist: dist[to],
          weight,
          updated: false,
        });
      }
    }

    steps.push({
      step: stepIndex++,
      description: 'Visit node',
      currentNode: u,
      currentNodeName: nodeMap[u]?.name ?? u,
      distances: { ...dist },
      visited: [...visited],
      neighbours: neighbourLog,
      note: `Visited "${nodeMap[u]?.name}". Checking ${neighbours.length} neighbour(s).`,
    });
  }

  // ── Path reconstruction ──────────────────────────────────────────────────
  if (dist[destinationId] === Infinity) {
    return {
      path: [],
      distance: Infinity,
      hops: 0,
      visitedNodes: visited.size,
      steps,
    };
  }

  const path = [];
  let cur = destinationId;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }

  steps.push({
    step: stepIndex,
    description: 'Path reconstructed',
    currentNode: destinationId,
    currentNodeName: nodeMap[destinationId]?.name ?? destinationId,
    distances: { ...dist },
    visited: [...visited],
    neighbours: [],
    note: `Shortest path found: ${path.map((id) => nodeMap[id]?.name ?? id).join(' → ')}. Total distance: ${dist[destinationId]}m.`,
  });

  return {
    path,
    distance: dist[destinationId],
    hops: path.length - 1,
    visitedNodes: visited.size,
    steps,
  };
}

/**
 * Convenience wrapper — future CampusRide public API entry point.
 *
 * When the full CampusRide platform is built, this function signature
 * can be kept unchanged while the internals evolve (e.g. A*, multi-modal).
 *
 * @param {Object} graph
 * @param {string} pickupLocation   - node ID
 * @param {string} destinationLocation - node ID
 */
export function findRoute(graph, pickupLocation, destinationLocation) {
  return dijkstra(graph, pickupLocation, destinationLocation);
}

/**
 * Estimate walking time from a distance (metres) and speed (km/h).
 *
 * @param {number} distanceMetres
 * @param {number} speedKmh  — default 5 km/h (average walking speed)
 * @returns {number} minutes (rounded)
 */
export function estimateWalkingTime(distanceMetres, speedKmh = 5) {
  const distanceKm = distanceMetres / 1000;
  const timeHours = distanceKm / speedKmh;
  return Math.round(timeHours * 60);
}

/**
 * Run Dijkstra on a synthetic random graph and return execution time (ms).
 * Used by the Performance Testing panel — no fake data.
 *
 * @param {number} nodeCount
 * @param {number} edgeDensity  — avg edges per node (default 3)
 * @returns {{ nodeCount: number, edgeCount: number, timeMs: number }}
 */
export function benchmarkDijkstra(nodeCount, edgeDensity = 3) {
  // Build synthetic graph
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `n${i}`,
    name: `Node ${i}`,
    type: 'synthetic',
  }));

  const edges = [];
  // First ensure connectivity: chain all nodes
  for (let i = 0; i < nodeCount - 1; i++) {
    edges.push({ source: `n${i}`, target: `n${i + 1}`, distance: Math.floor(Math.random() * 500) + 50 });
  }
  // Then add random extra edges
  const extraEdges = Math.floor(nodeCount * edgeDensity);
  for (let i = 0; i < extraEdges; i++) {
    const a = Math.floor(Math.random() * nodeCount);
    const b = Math.floor(Math.random() * nodeCount);
    if (a !== b) {
      edges.push({ source: `n${a}`, target: `n${b}`, distance: Math.floor(Math.random() * 500) + 50 });
    }
  }

  const syntheticGraph = { nodes, edges };

  const t0 = performance.now();
  dijkstra(syntheticGraph, 'n0', `n${nodeCount - 1}`);
  const t1 = performance.now();

  return {
    nodeCount,
    edgeCount: edges.length,
    timeMs: parseFloat((t1 - t0).toFixed(3)),
  };
}
