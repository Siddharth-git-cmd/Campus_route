import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RouteFinderPage from './pages/RouteFinderPage';
import CampusMapPage from './pages/CampusMapPage';
import AlgorithmPage from './pages/AlgorithmPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0">
          {/* Mobile top nav */}
          <Navbar />

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
            <Routes>
              <Route path="/"          element={<Dashboard />} />
              <Route path="/route"     element={<RouteFinderPage />} />
              <Route path="/map"       element={<CampusMapPage />} />
              <Route path="/algorithm" element={<AlgorithmPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="text-center py-4 text-xs text-slate-700 border-t border-white/5">
            Powered by Dijkstra's Shortest Path Algorithm · CampusRide Route Optimization
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}
