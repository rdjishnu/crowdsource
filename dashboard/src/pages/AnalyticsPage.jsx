import React, { useState, useEffect } from 'react';
import { fetchStats } from '../services/api';
import { PieChart, TrendingUp, Award, Clock } from 'lucide-react';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  const categoryData = stats?.categoryBreakdown || {
    Pothole: 12,
    Garbage: 8,
    Streetlight: 5,
    'Water Leak': 4,
    Sewage: 3
  };

  return (
    <div className="page-body">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">Civic Analytics & Performance Metrics</h1>
          <p className="page-subtitle">Government resolution efficiency & problem domain insights</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Resolution SLA Rate</span>
            <span className="stat-value" style={{ color: 'var(--accent-emerald)' }}>94.2%</span>
          </div>
          <div className="stat-icon-wrapper resolved"><Award size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Avg Resolution Time</span>
            <span className="stat-value" style={{ color: 'var(--accent-cyan)' }}>1.8 Days</span>
          </div>
          <div className="stat-icon-wrapper progress"><Clock size={24} /></div>
        </div>
      </div>

      <div className="card-section">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={20} className="text-primary-500" />
          Complaints Breakdown by Domain
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
          {Object.entries(categoryData).map(([category, count]) => (
            <div key={category} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{category}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px', color: 'var(--primary-500)' }}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
