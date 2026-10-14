/**
 * campusGraph.js
 * --------------
 * Predefined campus graph for the CampusRide Route Optimization System.
 *
 * Keeping graph data separate from the algorithm means:
 *  1. The campus map can be updated without touching dijkstra.js.
 *  2. In the future CampusRide platform this file can be replaced with
 *     a live API response while the algorithm stays identical.
 *
 * Distances are in metres.
 * Node coordinates (x, y) are normalised to a 0–1000 canvas space for the
 * visual campus map.
 */

export const campusGraph = {
  nodes: [
    { id: 'gate',     name: 'Main Gate',       type: 'entrance',    x: 500, y: 900 },
    { id: 'parking',  name: 'Parking',          type: 'facility',    x: 300, y: 820 },
    { id: 'admin',    name: 'Admin Block',      type: 'admin',       x: 500, y: 720 },
    { id: 'cse',      name: 'CSE Block',        type: 'academic',    x: 250, y: 580 },
    { id: 'ece',      name: 'ECE Block',        type: 'academic',    x: 750, y: 580 },
    { id: 'library',  name: 'Library',          type: 'facility',    x: 500, y: 500 },
    { id: 'cafe',     name: 'Cafeteria',        type: 'facility',    x: 250, y: 380 },
    { id: 'auditorium', name: 'Auditorium',     type: 'facility',    x: 750, y: 380 },
    { id: 'student',  name: 'Student Center',   type: 'facility',    x: 500, y: 300 },
    { id: 'medical',  name: 'Medical Center',   type: 'facility',    x: 150, y: 250 },
    { id: 'sports',   name: 'Sports Complex',   type: 'recreation',  x: 850, y: 250 },
    { id: 'hostel',   name: 'Hostel',           type: 'residential', x: 500, y: 130 },
  ],

  edges: [
    // Main Gate connections
    { source: 'gate',    target: 'parking',  distance: 100 },
    { source: 'gate',    target: 'admin',    distance: 200 },

    // Admin Block connections
    { source: 'admin',   target: 'cse',      distance: 280 },
    { source: 'admin',   target: 'ece',      distance: 280 },
    { source: 'admin',   target: 'library',  distance: 220 },

    // Academic blocks ↔ Library
    { source: 'cse',     target: 'library',  distance: 250 },
    { source: 'ece',     target: 'library',  distance: 250 },

    // Parking shortcut
    { source: 'parking', target: 'cse',      distance: 320 },

    // Library → upper campus
    { source: 'library', target: 'cafe',     distance: 180 },
    { source: 'library', target: 'auditorium', distance: 200 },
    { source: 'library', target: 'student',  distance: 210 },

    // CSE ↔ Cafeteria
    { source: 'cse',     target: 'cafe',     distance: 150 },

    // ECE ↔ Auditorium
    { source: 'ece',     target: 'auditorium', distance: 150 },

    // Student Center connections
    { source: 'cafe',    target: 'student',  distance: 170 },
    { source: 'auditorium', target: 'student', distance: 170 },

    // Upper campus
    { source: 'student', target: 'medical',  distance: 200 },
    { source: 'student', target: 'sports',   distance: 200 },
    { source: 'student', target: 'hostel',   distance: 180 },

    // Side connections
    { source: 'cafe',    target: 'medical',  distance: 230 },
    { source: 'auditorium', target: 'sports', distance: 230 },
    { source: 'medical', target: 'hostel',   distance: 220 },
    { source: 'sports',  target: 'hostel',   distance: 220 },
  ],
};

export default campusGraph;
