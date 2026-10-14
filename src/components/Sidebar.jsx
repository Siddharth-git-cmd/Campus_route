import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Navigation, Map, Cpu } from 'lucide-react';

const links = [
  { to: '/',          label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/route',     label: 'Route Finder',icon: Navigation },
  { to: '/map',       label: 'Campus Map',  icon: Map },
  { to: '/algorithm', label: 'Algorithm',   icon: Cpu },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-screen bg-slate-900 border-r border-white/10 px-4 py-8 gap-2">
      {/* Brand */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Navigation size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">CampusRide</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 pl-10">Route Optimization</p>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer tag */}
      <div className="mt-auto px-2 pt-4 border-t border-white/10">
        <p className="text-xs text-slate-600 leading-relaxed">
          Powered by<br />
          <span className="text-indigo-400 font-semibold">Dijkstra's Algorithm</span>
        </p>
      </div>
    </aside>
  );
}
