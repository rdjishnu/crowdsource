import React from 'react';
import { LayoutDashboard, FileText, BarChart3, Settings, ShieldCheck, MapPin } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Overview', icon: LayoutDashboard },
    { id: 'issues', label: 'Issue Operations', icon: FileText },
    { id: 'map', label: 'Geo Intelligence', icon: MapPin },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-badge">
          <ShieldCheck size={22} />
        </div>
        <div>
          <div className="brand-title">NexusGov AI</div>
          <div className="brand-subtitle">Govt of Jharkhand</div>
        </div>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
