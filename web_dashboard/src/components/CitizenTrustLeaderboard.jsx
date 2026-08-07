// File: web_dashboard/src/components/CitizenTrustLeaderboard.jsx
import React, { useState } from 'react';

const CitizenTrustLeaderboard = ({ citizens = [], issues = [], onTriggerToast }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Aggregate citizen contributions from issues & accounts
    const leaderboardData = [
        { id: 1, name: 'Rahul Verma', email: 'rahul.v@gmail.com', trustScore: 140, reports: 5, badge: 'Ward Champion', verified: true },
        { id: 2, name: 'Ananya Roy', email: 'ananya.roy@yahoo.in', trustScore: 125, reports: 4, badge: 'Civic Sentinel', verified: true },
        { id: 3, name: 'Vikram Singh', email: 'vikram.s@hotmail.com', trustScore: 110, reports: 3, badge: 'Top Reporter', verified: true },
        { id: 4, name: 'Pooja Kumari', email: 'pooja.k@gmail.com', trustScore: 95, reports: 2, badge: 'Active Citizen', verified: false }
    ];

    const filteredCitizens = leaderboardData.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="organic-panel" style={{ padding: '28px', marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        CITIZEN REPUTATION & TRUST LEADERBOARD
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                        Verified citizen trust scores, civic contribution badges, and anti-spam integrity scores.
                    </p>
                </div>

                <input
                    type="text"
                    className="form-input"
                    placeholder="Search citizen name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '240px', padding: '8px 12px', fontSize: '12px' }}
                />
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                            <th style={{ padding: '12px 16px' }}>RANK & CITIZEN</th>
                            <th style={{ padding: '12px 16px' }}>REPUTATION BADGE</th>
                            <th style={{ padding: '12px 16px' }}>TRUST SCORE</th>
                            <th style={{ padding: '12px 16px' }}>TOTAL REPORTS</th>
                            <th style={{ padding: '12px 16px' }}>VERIFICATION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCitizens.map((c, idx) => (
                            <tr key={c.id} className="interactive-table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#60a5fa', width: '20px' }}>#{idx + 1}</span>
                                        <div>
                                            <div style={{ fontWeight: '700', color: '#ffffff' }}>{c.name}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span className="glass-pill glass-pill-emerald">{c.badge}</span>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#38bdf8' }}>
                                        {c.trustScore} Pts
                                    </div>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#f8fafc', fontWeight: '700' }}>
                                    {c.reports} Submissions
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <span className={`glass-pill ${c.verified ? 'glass-pill-blue' : 'glass-pill-amber'}`}>
                                        {c.verified ? 'Aadhaar Verified' : 'Pending OTP'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CitizenTrustLeaderboard;
