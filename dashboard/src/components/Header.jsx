import React from 'react';
import { Search, Bell, UserCheck, Shield } from 'lucide-react';

const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          placeholder="Search issue ID, category, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <div className="govt-badge">
          <div className="badge-dot"></div>
          <span>SIH25031 Live Portal</span>
        </div>

        <button className="btn-icon" title="Notifications">
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
            OFF
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nodal Officer</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ranchi Municipal Corp</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
