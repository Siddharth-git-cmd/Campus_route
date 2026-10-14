import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navigation, Menu, X, LayoutDashboard, Map, Cpu } from 'lucide-react';

const links = [
  { to: '/',          label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/route',     label: 'Route Finder',icon: Navigation },
  { to: '/map',       label: 'Campus Map',  icon: Map },
  { to: '/algorithm', label: 'Algorithm',   icon: Cpu },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="md:hidden sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Navigation size={14} className="text-white" />
          </div>
          <span className="font-bold text-white">CampusRide</span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg text-slate-400 hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 px-4 pb-4 bg-slate-900 border-b border-white/10">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
