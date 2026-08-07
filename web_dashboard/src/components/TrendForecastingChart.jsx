// File: web_dashboard/src/components/TrendForecastingChart.jsx
import React, { useState } from 'react';

const TrendForecastingChart = () => {
    const [timeframe, setTimeframe] = useState('6M');

    // Data models based on timeframe (No cost fields)
    const forecastingData = {
        '3M': [
            { month: 'Jun 2026', pothole: 42, drainage: 30, electrical: 15, stress: 'Moderate', slaTarget: '96%' },
            { month: 'Jul 2026', pothole: 78, drainage: 85, electrical: 32, stress: 'High (Monsoon Peak)', slaTarget: '91%' },
            { month: 'Aug 2026 (Pred)', pothole: 95, drainage: 110, electrical: 45, stress: 'Critical Stress', slaTarget: '88%' },
        ],
        '6M': [
            { month: 'May 2026', pothole: 35, drainage: 20, electrical: 12, stress: 'Low', slaTarget: '98%' },
            { month: 'Jun 2026', pothole: 42, drainage: 30, electrical: 15, stress: 'Moderate', slaTarget: '96%' },
            { month: 'Jul 2026', pothole: 78, drainage: 85, electrical: 32, stress: 'High (Monsoon Peak)', slaTarget: '91%' },
            { month: 'Aug 2026 (Pred)', pothole: 95, drainage: 110, electrical: 45, stress: 'Critical Stress', slaTarget: '88%' },
            { month: 'Sep 2026 (Pred)', pothole: 65, drainage: 70, electrical: 28, stress: 'High', slaTarget: '93%' },
            { month: 'Oct 2026 (Pred)', pothole: 40, drainage: 35, electrical: 20, stress: 'Moderate', slaTarget: '97%' },
        ],
        '1Y': [
            { month: 'Q1 2026', pothole: 110, drainage: 80, electrical: 40, stress: 'Low', slaTarget: '98%' },
            { month: 'Q2 2026', pothole: 140, drainage: 120, electrical: 55, stress: 'Moderate', slaTarget: '95%' },
            { month: 'Q3 2026 (Monsoon)', pothole: 280, drainage: 310, electrical: 110, stress: 'Critical Peak', slaTarget: '89%' },
            { month: 'Q4 2026 (Winter)', pothole: 120, drainage: 90, electrical: 50, stress: 'Low', slaTarget: '97%' },
        ]
    };

    const currentData = forecastingData[timeframe] || forecastingData['6M'];

    return (
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        PREDICTIVE SLA & INFRASTRUCTURE STRESS ENGINE
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                        Predictive modeling of upcoming seasonal civic incident volume and field deployment stress.
                    </p>
                </div>

                {/* Timeframe Selector Buttons */}
                <div style={{ display: 'flex', borderRadius: '10px', background: 'rgba(3, 7, 18, 0.6)', padding: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {['3M', '6M', '1Y'].map(tf => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                background: timeframe === tf ? '#3b82f6' : 'transparent',
                                color: timeframe === tf ? '#ffffff' : '#94a3b8',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tf === '3M' ? '3 Months' : (tf === '6M' ? '6 Months' : '1 Year')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Department Workload Distribution Meter */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                        <span style={{ color: '#60a5fa' }}>Public Works (Potholes & Roads)</span>
                        <span style={{ color: '#ffffff' }}>45% Field Load</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: '4px' }} />
                    </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                        <span style={{ color: '#34d399' }}>Sanitation & Waste Management</span>
                        <span style={{ color: '#ffffff' }}>68% Field Load</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '4px' }} />
                    </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: '700' }}>
                        <span style={{ color: '#f87171' }}>Water & Drainage (Monsoon Surge)</span>
                        <span style={{ color: '#f87171' }}>88% Heavy Peak</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: '4px' }} />
                    </div>
                </div>
            </div>

            {/* Visual Bar Graph Representation */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentData.length}, 1fr)`, gap: '16px', alignItems: 'flex-end', height: '220px', padding: '20px 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {currentData.map((d, idx) => {
                    const maxHeight = Math.max(...currentData.map(item => item.pothole + item.drainage + item.electrical));
                    const totalVal = d.pothole + d.drainage + d.electrical;
                    const heightPercent = Math.min(100, Math.max(20, (totalVal / maxHeight) * 100));
                    const isPrediction = d.month.includes('Pred');

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: isPrediction ? '#fbbf24' : '#34d399', marginBottom: '6px' }}>
                                {totalVal} Reports
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    maxWidth: '48px',
                                    height: `${heightPercent}%`,
                                    background: isPrediction
                                        ? 'linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.3) 100%)'
                                        : 'linear-gradient(180deg, #3b82f6 0%, rgba(59, 130, 246, 0.3) 100%)',
                                    borderRadius: '8px 8px 0 0',
                                    border: isPrediction ? '1px dashed #f59e0b' : '1px solid #3b82f6',
                                    position: 'relative',
                                    transition: 'all 0.4s ease'
                                }}
                                title={`${d.month}: Target SLA ${d.slaTarget}`}
                            />
                            <div style={{ fontSize: '11px', color: isPrediction ? '#fbbf24' : '#94a3b8', fontWeight: '700', marginTop: '10px', textAlign: 'center' }}>
                                {d.month}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrendForecastingChart;
