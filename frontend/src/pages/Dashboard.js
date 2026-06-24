import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { fetchCustomers } from '../redux/slices/customerSlice';
import { fetchOrders } from '../redux/slices/orderSlice';

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    if (target === 0) {
      setCount(0);
      return;
    }

    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    const frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { items: customers } = useSelector((state) => state.customers);
  const { items: orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCustomers());
    dispatch(fetchOrders());
  }, [dispatch]);

  const lowStockProducts = products.filter((p) => p.quantity <= 10);
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  const stats = [
    {
      title: 'Product Catalog',
      value: products.length,
      description: 'Active inventory items',
      accent: 'cyan'
    },
    {
      title: 'Customer Network',
      value: customers.length,
      description: 'Trusted buyers',
      accent: 'electric'
    },
    {
      title: 'Order Velocity',
      value: orders.length,
      description: 'Fresh purchase flows',
      accent: 'violet'
    },
    {
      title: 'Revenue Pulse',
      value: totalRevenue.toFixed(0),
      prefix: '$',
      description: 'Gross order value',
      accent: 'blue'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-background" aria-hidden="true" />
      <section>
        <p className="eyebrow">Premium Inventory Control</p>
        <h1>Command your supply chain from one elegant workspace.</h1>
        <p className="hero-copy">
          Gliding dashboards, live metrics, and luxury data surfaces for modern operations teams.
        </p>
      </section>

      <section className="stat-grid">
        {stats.map((stat, index) => (
          <article
            key={stat.title}
            className={`stat-card stat-card--${stat.accent}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="stat-card__row">
              <span className="stat-chip">{stat.description}</span>
              <span className="stat-badge">{stat.title}</span>
            </div>
            <h2 className="stat-value">
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </h2>
            <p className="stat-footnote">Live, glowing insight updated each time you enter the panel.</p>
          </article>
        ))}
      </section>

      {lowStockProducts.length > 0 && (
        <section className="alert-panel">
          <div className="alert-badge">Alert</div>
          <div className="alert-copy">
            <h3>Low Stock Notifications</h3>
            <p>{lowStockProducts.length} product(s) are nearing restock threshold.</p>
          </div>
        </section>
      )}
    </div>
  );
}
