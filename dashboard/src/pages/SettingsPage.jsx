import React from 'react';
import { Server, Database, Shield, Globe } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="page-body">
      <div className="page-title-row">
        <div>
          <h1 className="page-title">System & API Environment Settings</h1>
          <p className="page-subtitle">NexusGov AI Server Configuration & Integrations</p>
        </div>
      </div>

      <div className="card-section">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Backend API Connection</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Server size={20} className="text-primary-500" />
              <div>
                <div style={{ fontWeight: 600 }}>Spring Boot REST API Endpoint</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>http://localhost:8080/api/v1</div>
              </div>
            </div>
            <span className="status-badge resolved">● Connected</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Database size={20} className="text-primary-500" />
              <div>
                <div style={{ fontWeight: 600 }}>Database Engine</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PostgreSQL / H2 Dev Embedded</div>
              </div>
            </div>
            <span className="status-badge resolved">● Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
