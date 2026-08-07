// File: web_dashboard/src/components/SeverityHeatBar.jsx
import React from 'react';

const SeverityHeatBar = ({ score = 50, isEmergency = false }) => {
    let barColor = '#10b981'; // Green (0-40)
    let label = 'Normal';

    if (isEmergency || score > 85) {
        barColor = '#ef4444'; // Red (Emergency)
        label = 'EMERGENCY 🚨';
    } else if (score > 70) {
        barColor = '#f97316'; // Orange
        label = 'High Priority';
    } else if (score > 40) {
        barColor = '#f59e0b'; // Yellow/Amber
        label = 'Moderate';
    }

    return (
        <div style={{ width: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                <span style={{ color: barColor }}>{label}</span>
                <span style={{ color: '#94a3b8' }}>{score}/100</span>
            </div>
            <div style={{ width: '100%', height: '7px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                <div
                    style={{
                        width: `${Math.min(score, 100)}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                        boxShadow: (isEmergency || score > 85) ? '0 0 10px #ef4444' : 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default SeverityHeatBar;
