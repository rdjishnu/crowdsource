import React from 'react';
import { Layers, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    { label: 'Total Complaints', value: stats?.total || 0, icon: Layers, type: 'total' },
    { label: 'Reported (Pending)', value: stats?.reported || 0, icon: AlertCircle, type: 'reported' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: Clock, type: 'progress' },
    { label: 'Resolved Issues', value: stats?.resolved || 0, icon: CheckCircle2, type: 'resolved' },
    { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, type: 'rejected' },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="stat-card">
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value">{card.value}</span>
            </div>
            <div className={`stat-icon-wrapper ${card.type}`}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
