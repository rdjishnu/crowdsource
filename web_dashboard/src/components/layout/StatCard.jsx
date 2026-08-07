// File: web_dashboard/src/components/layout/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, subtext, color = '#3b82f6', trend }) => {
    return (
        <div
            className="organic-panel"
            style={{
                padding: '18px 24px',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
        >
            {/* Top Glow Highlight Line */}
            <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                        {title}
                    </p>
                    <h2 style={{ fontSize: '30px', fontWeight: '800', marginTop: '6px', color: '#ffffff', letterSpacing: '-0.5px' }}>
                        {value}
                    </h2>
                </div>

                {trend && (
                    <span className="glass-pill" style={{ backgroundColor: `${color}18`, color: color, borderColor: `${color}40` }}>
                        {trend}
                    </span>
                )}
            </div>

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                {subtext}
            </div>
        </div>
    );
};

export default StatCard;
