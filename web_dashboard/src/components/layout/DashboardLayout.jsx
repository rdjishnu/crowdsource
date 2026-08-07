// File: web_dashboard/src/components/layout/DashboardLayout.jsx
import React, { useState, useEffect, useContext } from 'react';
import SidebarLink from './SidebarLink';
import LanguageSwitcher from '../LanguageSwitcher';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, activeSection, onSectionChange, onLanguageChange, globalSearch = '', onSearchChange, emergencyCount = 0 }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
    const [audioAlerts, setAudioAlerts] = useState(true);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, #030712 0%, #090d16 50%, #050811 100%)', color: '#f8fafc' }}>
            {/* Collapsible Sidebar */}
            <aside style={{
                width: collapsed ? '80px' : '270px',
                transition: 'width 0.3s ease',
                background: 'rgba(9, 13, 22, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 14px',
                zIndex: 10
            }}>
                {/* Branding Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: '28px' }}>
                    {!collapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                padding: '6px 12px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: '800',
                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
                            }}>
                                NOC
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px', color: '#ffffff' }}>NexusGov</h3>
                                <p style={{ fontSize: '10px', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Command Center</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}
                    >
                        {collapsed ? '>' : '<'}
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <SidebarLink
                        id="overview"
                        label={collapsed ? '' : 'Command Overview'}
                        icon="OVERVIEW"
                        active={activeSection === 'overview'}
                        onClick={onSectionChange}
                    />
                    <SidebarLink
                        id="complaints"
                        label={collapsed ? '' : 'Smart Triage Queue'}
                        icon="TRIAGE"
                        badge={collapsed ? null : (emergencyCount > 0 ? `${emergencyCount} Urgent` : 'LIVE')}
                        active={activeSection === 'complaints'}
                        onClick={onSectionChange}
                    />
                    <SidebarLink
                        id="map"
                        label={collapsed ? '' : 'Geospatial Ward Map'}
                        icon="MAP"
                        active={activeSection === 'map'}
                        onClick={onSectionChange}
                    />
                    <SidebarLink
                        id="forecasting"
                        label={collapsed ? '' : 'Predictive Forecasting'}
                        icon="ANALYTICS"
                        active={activeSection === 'forecasting'}
                        onClick={onSectionChange}
                    />
                    <SidebarLink
                        id="settings"
                        label={collapsed ? '' : 'Security & Audit Console'}
                        icon="SECURITY"
                        active={activeSection === 'settings'}
                        onClick={onSectionChange}
                    />
                </nav>

                {/* Footer Security Pill */}
                {!collapsed && (
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '11px', textAlign: 'center', color: '#34d399', fontWeight: '700' }}>
                        <span className="live-dot-green" style={{ marginRight: '6px' }} /> ZERO-TRUST NOC SECURED
                    </div>
                )}
            </aside>

            {/* Main NOC Content Wrapper */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
                {/* Top Navbar Header */}
                <header style={{
                    height: '74px',
                    padding: '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(9, 13, 22, 0.7)',
                    backdropFilter: 'blur(16px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Live Server Ticker */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="live-dot-green" />
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#34d399', letterSpacing: '0.5px' }}>
                                LIVE NOC CLOCK: {currentTime} IST
                            </span>
                        </div>

                        {/* Audio Siren Toggle */}
                        <button
                            onClick={() => setAudioAlerts(!audioAlerts)}
                            className="glass-pill"
                            style={{
                                cursor: 'pointer',
                                background: audioAlerts ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: audioAlerts ? '#60a5fa' : '#94a3b8',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            title="Toggle Emergency Audio Alert Chime"
                        >
                            {audioAlerts ? 'Sirens On' : 'Sirens Muted'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Global Search Input */}
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Global search address or ticket..."
                            value={globalSearch}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            style={{ width: '240px', padding: '8px 14px', fontSize: '12px' }}
                        />

                        {/* Language Switcher Dropdown */}
                        <LanguageSwitcher onLanguageChange={onLanguageChange} />

                        {/* Officer Profile Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', color: '#ffffff' }}>
                                P
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>Priya Sharma (NOC)</span>
                        </div>

                        <button onClick={handleLogout} className="btn-primary btn-ruby" style={{ width: 'auto', padding: '8px 18px', fontSize: '12px' }}>
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: '32px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
