# CampusRide — Route Optimization System

> **DAA Academic Mini-Project** — Demonstrating Dijkstra's Shortest Path Algorithm through an interactive campus navigation web application.

---

## 1. Project Overview

CampusRide Route Optimization System is a single-page web application that visualises how **Dijkstra's Algorithm** can be used to find the shortest walking route between any two locations on a college campus.

The project simultaneously serves as the **initial routing-engine prototype** for the future CampusRide ride-sharing platform.

---

## 2. Problem Statement

A campus contains many buildings and interconnected pathways. Students travelling between two locations may have multiple possible routes. The application determines the shortest route based on physical distance.

**Graph Representation:**

| Element           | Graph Concept |
|-------------------|---------------|
| Campus Location   | Vertex / Node |
| Campus Pathway    | Edge          |
| Distance (metres) | Edge Weight   |

---

## 3. Features

- ✅ **Route Finder** — Select source & destination, compute shortest path instantly
- ✅ **Campus Map** — Interactive SVG graph with highlighted shortest route and animated path dashes
- ✅ **Dashboard** — Live statistics derived from actual graph data
- ✅ **Algorithm Analysis** — Complexity, pseudocode, step-by-step execution viewer
- ✅ **Performance Benchmark** — Real measurements via `performance.now()`, no fake data
- ✅ **Correctness Verification** — Built-in test cases with known expected results
- ✅ **Responsive Design** — Works on mobile, tablet, laptop, desktop
- ✅ **Edge Case Handling** — Same source/destination, no route, empty graph

---

## 4. Algorithm Used

**Dijkstra's Shortest Path Algorithm**

- Category: Greedy Algorithm
- Finds the minimum-distance path from a single source node to all other nodes
- Requires non-negative edge weights (guaranteed by physical distances)
- Implemented **manually** — no library `shortestPath()` calls

---

## 5. Graph Representation

The campus is stored as a plain JSON object in `src/data/campusGraph.js`:

```json
{
  "nodes": [
    { "id": "cse", "name": "CSE Block", "type": "academic", "x": 250, "y": 580 }
  ],
  "edges": [
    { "source": "cse", "target": "library", "distance": 250 }
  ]
}
```

- **12 nodes** (campus locations)
- **22 edges** (pathways, bidirectional)
- Distances in **metres**
- Node coordinates normalised to a 1000×1000 canvas for the SVG map

---

## 6. Dijkstra Explanation

```
function dijkstra(graph, source, destination):
  dist[source] = 0
  dist[all others] = ∞
  prev[all] = null
  visited = {}

  while unvisited nodes remain:
    u = unvisited node with minimum dist[u]     ← O(V) scan
    if u == destination: break

    mark u as visited

    for each neighbour v of u:
      candidate = dist[u] + weight(u, v)
      if candidate < dist[v]:
        dist[v] = candidate
        prev[v] = u

  // Reconstruct path by following prev[] backwards
  path = []
  cur = destination
  while cur != null:
    path.prepend(cur)
    cur = prev[cur]

  return { path, distance: dist[destination] }
```

**Data structures maintained:**

| Structure       | Purpose                                      |
|-----------------|----------------------------------------------|
| `dist[]`        | Current minimum distance from source          |
| `prev[]`        | Previous node on the shortest path           |
| `visited`       | Set of finalised nodes                        |

---

## 7. Time Complexity

**O(V²)**

- The outer loop runs **V** times (once per vertex).
- Each iteration scans all unvisited nodes to find the minimum → **O(V)**.
- Total: **O(V × V) = O(V²)**

*Note: A min-heap priority queue would reduce this to O((V + E) log V). The O(V²) approach is used intentionally for readability.*

---

## 8. Space Complexity

**O(V + E)**

| Component         | Space |
|-------------------|-------|
| Adjacency list    | O(V + E) |
| Distance table    | O(V) |
| Previous table    | O(V) |
| Visited set       | O(V) |
| **Total**         | **O(V + E)** |

---

## 9. Technology Stack

| Layer           | Technology                          |
|-----------------|-------------------------------------|
| Framework       | React 18 + Vite                     |
| Styling         | Tailwind CSS v4                     |
| Icons           | Lucide React                        |
| Routing         | React Router v6                     |
| Map             | Custom SVG (no external map APIs)   |
| Algorithm       | Manual Dijkstra (vanilla JS)        |

---

## 10. Project Structure

```
campusride/
├── public/
├── src/
│   ├── algorithms/
│   │   └── dijkstra.js          ← Core routing engine (reusable)
│   ├── data/
│   │   └── campusGraph.js       ← Campus graph data (swappable)
│   ├── components/
│   │   ├── Navbar.jsx            ← Mobile top nav
│   │   ├── Sidebar.jsx           ← Desktop sidebar
│   │   ├── CampusMap.jsx         ← SVG interactive map
│   │   ├── RouteFinder.jsx       ← Search panel + results
│   │   ├── RouteResult.jsx       ← Shortest path display
│   │   ├── StatsCard.jsx         ← Dashboard metric cards
│   │   └── AlgorithmSteps.jsx   ← Step-by-step Dijkstra viewer
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── RouteFinderPage.jsx
│   │   ├── CampusMapPage.jsx
│   │   └── AlgorithmPage.jsx
│   ├── utils/
│   │   └── routeUtils.js         ← Pure utility functions
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 11. Installation

```bash
# Clone / download the project
cd campusride

# Install dependencies
npm install
```

---

## 12. Running the Project

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

---

## 13. Sample Input / Output

**Input:**
- Source: `CSE Block`
- Destination: `Hostel`

**Output:**
```
CSE Block → Library → Student Center → Hostel
Total Distance: 640 m
Estimated Walking Time: ~8 min
Stops: 3
```

**Correctness test:**
```
A → B = 4
A → C = 2
C → B = 1

Expected:  A → C → B  (cost = 3)
Actual:    A → C → B  (cost = 3)  ✓ PASS
```

---

## 14. Future CampusRide Integration

The routing engine is deliberately separated so it can be reused in the full CampusRide platform without modification:

```
// Current (DAA project)
import { dijkstra } from './algorithms/dijkstra';
dijkstra(campusGraph, sourceId, destinationId);

// Future (CampusRide platform)
import { findRoute } from './routing/dijkstra';
findRoute(pickupLocation, destinationLocation);
//  ↑ Same algorithm, same function signature, different graph data source
```

**What can be reused directly:**
- `src/algorithms/dijkstra.js` — zero UI dependencies
- `src/data/campusGraph.js` — replace with live API data
- `src/utils/routeUtils.js` — pure helper functions

---

*CampusRide Route Optimization System — DAA Mini Project*  
*Powered by Dijkstra's Shortest Path Algorithm*
