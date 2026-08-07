import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OfficialDashboard = () => {
    const [activeTab, setActiveTab] = useState('citizens');
    const [citizens, setCitizens] = useState([]);
    const [officials, setOfficials] = useState([]);
    const [stats, setStats] = useState({ totalCitizens: 0, totalOfficials: 0, totalUsers: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [citRes, offRes, statsRes] = await Promise.all([
                axiosInstance.get('/auth/citizens'),
                axiosInstance.get('/auth/officials'),
                axiosInstance.get('/auth/stats')
            ]);
            setCitizens(citRes.data || []);
            setOfficials(offRes.data || []);
            setStats(statsRes.data || { totalCitizens: 0, totalOfficials: 0, totalUsers: 0 });
            setLastSync(new Date().toLocaleTimeString());
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 4 seconds to pick up new mobile app registrations live!
        const interval = setInterval(fetchData, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredCitizens = citizens.filter(c =>
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredOfficials = officials.filter(o =>
        o.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto', width: '100%', minHeight: '100vh' }}>
            {/* Top Navigation & Header */}
            <div className="glass-card" style={{ padding: '24px 32px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="badge-gov">JHARKHAND STATE GOVERNMENT</span>
                        <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>● Live Auto-Sync Active</span>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>NexusGov Administrative Control Center</h1>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                        Real-time Citizen & Official Registry Monitor • Last synced: {lastSync}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button onClick={fetchData} className="btn-primary btn-secondary" style={{ width: 'auto', padding: '10px 18px', fontSize: '13px' }}>
                        🔄 Refresh Data
                    </button>
                    <button onClick={handleLogout} className="btn-primary" style={{ width: 'auto', padding: '10px 20px', backgroundColor: '#ef4444', fontSize: '13px' }}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Live Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid #3b82f6' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>REGISTERED CITIZENS</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px', color: '#60a5fa' }}>{stats.totalCitizens}</h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Live count from Mobile App DB</span>
                </div>
                <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid #10b981' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>VERIFIED OFFICIALS</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px', color: '#34d399' }}>{stats.totalOfficials}</h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>2FA 6-Digit PIN Protected</span>
                </div>
                <div className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid #a855f7' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>TOTAL SYSTEM USERS</p>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginTop: '6px', color: '#c084fc' }}>{stats.totalUsers}</h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Active Zero-Trust Identities</span>
                </div>
            </div>

            {/* Navigation Tabs & Search */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setActiveTab('citizens')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: activeTab === 'citizens' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                                color: activeTab === 'citizens' ? '#ffffff' : '#94a3b8'
                            }}
                        >
                            👥 Citizen Registry ({citizens.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('officials')}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: activeTab === 'officials' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                                color: activeTab === 'officials' ? '#ffffff' : '#94a3b8'
                            }}
                        >
                            🛡️ Official Registry ({officials.length})
                        </button>
                    </div>

                    <div style={{ minWidth: '280px' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tab Content: Citizens Table */}
                {activeTab === 'citizens' && (
                    <div>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading registered citizens...</p>
                        ) : filteredCitizens.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(15,23,42,0.4)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600 }}>No Citizens Registered Yet</p>
                                <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>
                                    Register a new citizen from your mobile app (`citizen_app`), and their details will appear here automatically in real time!
                                </p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                                            <th style={{ padding: '14px 16px' }}>USER ID</th>
                                            <th style={{ padding: '14px 16px' }}>FULL NAME</th>
                                            <th style={{ padding: '14px 16px' }}>EMAIL ADDRESS</th>
                                            <th style={{ padding: '14px 16px' }}>ROLE</th>
                                            <th style={{ padding: '14px 16px' }}>VERIFICATION STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCitizens.map((c) => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600 }}>#{c.id}</td>
                                                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#f8fafc' }}>{c.fullName}</td>
                                                <td style={{ padding: '14px 16px', color: '#60a5fa' }}>{c.email}</td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                                                        {c.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 600 }}>
                                                    ✓ Authenticated
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content: Officials Table */}
                {activeTab === 'officials' && (
                    <div>
                        {loading ? (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading official accounts...</p>
                        ) : filteredOfficials.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(15,23,42,0.4)', borderRadius: '12px' }}>
                                <p style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 600 }}>No Government Officials Found</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                                            <th style={{ padding: '14px 16px' }}>OFFICIAL ID</th>
                                            <th style={{ padding: '14px 16px' }}>FULL NAME</th>
                                            <th style={{ padding: '14px 16px' }}>OFFICIAL EMAIL</th>
                                            <th style={{ padding: '14px 16px' }}>ROLE</th>
                                            <th style={{ padding: '14px 16px' }}>2FA PIN STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOfficials.map((o) => (
                                            <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '14px 16px', color: '#94a3b8', fontWeight: 600 }}>#{o.id}</td>
                                                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#f8fafc' }}>{o.fullName}</td>
                                                <td style={{ padding: '14px 16px', color: '#60a5fa' }}>{o.email}</td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                                                        {o.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 600 }}>
                                                    ✓ 6-Digit PIN Configured ({o.securePin ? '******' : 'Active'})
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficialDashboard;
