import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './redux/slices/productSlice';
import { fetchCustomers } from './redux/slices/customerSlice';
import { fetchOrders } from './redux/slices/orderSlice';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [wipeActive, setWipeActive] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setWipeActive(true);
    const timer = window.setTimeout(() => setWipeActive(false), 700);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    const moveCursor = (event) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const createBurst = (x, y) => {
      const container = document.createElement('div');
      container.className = 'burst-container';
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;

      for (let i = 0; i < 12; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'burst-particle';
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 26;
        particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        particle.style.background = `radial-gradient(circle, rgba(255,255,255,0.95), rgba(124,58,237,0.2))`;
        container.appendChild(particle);
      }

      document.body.appendChild(container);
      window.requestAnimationFrame(() => container.classList.add('burst-active'));
      setTimeout(() => container.remove(), 680);
    };

    const handleClick = (event) => {
      if (event.target.closest('button')) {
        createBurst(event.clientX, event.clientY);
      }
    };

    const handleScroll = () => {
      const offset = window.scrollY;
      document.documentElement.style.setProperty('--scroll-y', `${offset}px`);
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0.12;
        el.style.transform = `translateY(${offset * depth}px)`;
      });
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: '⌬' },
    { to: '/products', label: 'Products', icon: '📦' },
    { to: '/customers', label: 'Customers', icon: '👥' },
    { to: '/orders', label: 'Orders', icon: '🧾' }
  ];

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className={`page-wipe-overlay ${wipeActive ? 'active' : ''}`} />
      <div className="custom-cursor">
        <span className="cursor-core" />
      </div>

      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand-block">
            <div className="brand-orb" />
            <div className="brand-copy">
              <span className="brand-name">Ethara Vault</span>
              <span className="brand-tone">Inventory OS</span>
            </div>
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <span />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{icon}</span>
              <span className="sidebar-label">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-pill">
            <span className="status-dot" />
            Connected
          </div>
          <div className="version-glow">v2026</div>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div className="topbar-left">
            <div className="breadcrumb">Command Center</div>
            <div className="topbar-pill">Live inventory intelligence</div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" type="button">
              <span className="icon-symbol">🔔</span>
            </button>
            <button className="icon-btn" type="button">
              <span className="icon-symbol">👤</span>
            </button>
          </div>
        </header>

        <main className="page-wrapper">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>

        <footer className="app-footer">
          © 2026 Ethara.ai • Cosmic inventory experiences.
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
