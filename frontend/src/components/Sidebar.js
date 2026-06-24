import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '⌬' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/orders', label: 'Orders', icon: '🧾' }
];

export default function Sidebar({ open, onToggle }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${open ? '' : 'collapsed'}`}>
      <div className="sidebar-top">
        <div className="brand-block">
          <div className="cube-scene" aria-hidden="true">
            <div className="cube">
              <div className="face face-front" />
              <div className="face face-back" />
              <div className="face face-right" />
              <div className="face face-left" />
              <div className="face face-top" />
              <div className="face face-bottom" />
            </div>
          </div>
          <div className="brand-copy">
            <span className="brand-name">Ethara Vault</span>
            <span className="brand-tone">Inventory OS</span>
          </div>
        </div>

        <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle navigation">
          <span />
        </button>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon }) => (
          <Link key={to} to={to} className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}>
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-label">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-pill">
          <span className="status-dot" />
          Online
        </div>
        <div className="version-glow">v2.1</div>
      </div>
    </aside>
  );
}
