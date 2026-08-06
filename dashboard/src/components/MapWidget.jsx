import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

const MapWidget = ({ issues = [] }) => {
  return (
    <div className="card-section">
      <div className="section-header">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} className="text-primary-500" />
            Jharkhand Civic Issue Geo-Distribution
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time coordinates mapped across Ranchi, Jamshedpur, Dhanbad & Bokaro
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="status-badge reported">● {issues.filter(i => i.status === 'Reported').length} Active</span>
          <span className="status-badge resolved">● {issues.filter(i => i.status === 'Resolved').length} Resolved</span>
        </div>
      </div>

      <div className="map-widget-box">
        {/* Decorative Grid background simulation */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(99, 102, 241, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.8
        }} />

        <div style={{ zIndex: 2, textAlign: 'center', padding: '24px' }}>
          <Compass size={36} style={{ color: 'var(--primary-500)', marginBottom: '12px', animation: 'spin 12s linear infinite' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Interactive Map View</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '420px' }}>
            Displaying {issues.length} reported issues with GPS pins ({issues[0]?.latitude || '23.3441'}° N, {issues[0]?.longitude || '85.3096'}° E)
          </p>
        </div>

        {/* Floating Pin items */}
        {issues.slice(0, 5).map((issue, idx) => (
          <div
            key={issue.id || idx}
            style={{
              position: 'absolute',
              top: `${25 + (idx * 14)}%`,
              left: `${20 + (idx * 16)}%`,
              background: issue.status === 'Resolved' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              zIndex: 3
            }}
          >
            <MapPin size={12} />
            #{issue.id} • {issue.category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapWidget;
