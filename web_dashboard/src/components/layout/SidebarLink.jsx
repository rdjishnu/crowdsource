// File: web_dashboard/src/components/layout/SidebarLink.jsx
import React, { useState } from 'react';

const SidebarLink = ({ id, label, icon, badge, active, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={() => onClick(id)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                background: active
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.15) 100%)'
                    : (hovered ? 'rgba(255, 255, 255, 0.06)' : 'transparent'),
                color: active ? '#ffffff' : (hovered ? '#f8fafc' : '#94a3b8'),
                fontWeight: active ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'left',
                transform: hovered ? 'translateX(4px)' : 'translateX(0)',
                borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
                boxShadow: active ? '0 4px 20px rgba(59, 130, 246, 0.25)' : 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    color: active ? '#60a5fa' : '#64748b',
                    transition: 'transform 0.25s ease',
                    transform: hovered || active ? 'scale(1.1)' : 'scale(1)'
                }}>
                    [{icon}]
                </span>
                <span>{label}</span>
            </div>
            {badge && (
                <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: active ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    transition: 'all 0.2s ease',
                    transform: hovered ? 'scale(1.08)' : 'scale(1)'
                }}>
                    {badge}
                </span>
            )}
        </button>
    );
};

export default SidebarLink;
