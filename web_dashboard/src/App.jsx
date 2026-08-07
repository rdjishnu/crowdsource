// File: web_dashboard/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import OfficialLogin from './pages/OfficialLogin';
import OfficialRegister from './pages/OfficialRegister';
import DashboardLayout from './components/layout/DashboardLayout';
import StatCard from './components/layout/StatCard';
import IssueDetailsModal from './components/IssueDetailsModal';
import SmartQueueTable from './components/SmartQueueTable';
import TrendForecastingChart from './components/TrendForecastingChart';
import GeospatialMapView from './components/GeospatialMapView';
import OfficerCommandConsole from './components/OfficerCommandConsole';
import CitizenTrustLeaderboard from './components/CitizenTrustLeaderboard';
import AiNeuralClassifierWorkspace from './components/AiNeuralClassifierWorkspace';
import ToastNotification from './components/ToastNotification';
import { issueService } from './services/issueService';
import { playNocDispatchChime, playEmergencySirenSound } from './utils/audioHelper';
import axiosInstance from './api/axiosInstance';

const AuthenticatedDashboardContent = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [citizens, setCitizens] = useState([]);
    const [officials, setOfficials] = useState([]);
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState({ totalCitizens: 0, totalOfficials: 0, totalUsers: 0 });
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [globalSearch, setGlobalSearch] = useState('');
    const [toasts, setToasts] = useState([]);
    const [sirenActive, setSirenActive] = useState(false);

    const triggerToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const handleDismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const fetchData = async () => {
        try {
            const [citRes, offRes, statsRes, issuesData] = await Promise.all([
                axiosInstance.get('/auth/citizens').catch(() => ({ data: [] })),
                axiosInstance.get('/auth/officials').catch(() => ({ data: [] })),
                axiosInstance.get('/auth/stats').catch(() => ({ data: { totalCitizens: 0, totalOfficials: 0, totalUsers: 0 } })),
                issueService.getAllIssues()
            ]);
            setCitizens(citRes.data || []);
            setOfficials(offRes.data || []);
            setStats(statsRes.data || { totalCitizens: 0, totalOfficials: 0, totalUsers: 0 });
            setIssues(issuesData || []);
        } catch (err) {
            console.error('Failed to fetch NOC data:', err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    // Instant & Optimistic Triage Status Updates
    const handleStatusUpdate = async (id, newStatus) => {
        // 1. Optimistic local UI update immediately!
        setIssues(prevIssues =>
            prevIssues.map(issue =>
                issue.id === id ? { ...issue, status: newStatus } : issue
            )
        );

        if (selectedIssue && selectedIssue.id === id) {
            setSelectedIssue(prev => ({ ...prev, status: newStatus }));
        }

        // 2. Play Web Audio Dispatch Chime sound
        playNocDispatchChime();

        // 3. Trigger Toast Notification
        const pointsText = newStatus === 'Resolved' ? ' (+10 Trust Pts awarded to Citizen)' : (newStatus === 'Rejected' ? ' (-25 Trust Pts deducted)' : '');
        triggerToast(`Incident #${id} marked as ${newStatus}${pointsText}`, newStatus === 'Rejected' ? 'error' : 'success');

        // 4. Send API request to Spring Boot backend
        try {
            await issueService.updateIssueStatus(id, newStatus);
            fetchData();
        } catch (err) {
            console.error('Failed to update issue status on server:', err);
        }
    };

    const toggleSirens = () => {
        setSirenActive(!sirenActive);
        playEmergencySirenSound();
        triggerToast(!sirenActive ? 'Emergency Sirens & NOC Audio Active' : 'Audio Sirens Muted', 'info');
    };

    const emergencyCount = issues.filter(i => (i.severityScore || i.dispatchData?.severityScore || 50) >= 75).length;
    const resolvedCount = issues.filter(i => i.status === 'Resolved').length;
    const inProgressCount = issues.filter(i => i.status === 'In Progress').length;

    return (
        <DashboardLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            globalSearch={globalSearch}
            onSearchChange={setGlobalSearch}
            emergencyCount={emergencyCount}
            onSirenToggle={toggleSirens}
            sirenActive={sirenActive}
        >
            {/* Section 1: Command Overview */}
            {activeSection === 'overview' && (
                <div key="overview" className="page-fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        <StatCard title="Total Reported Issues" value={issues.length} subtext="Live citizen reports submitted" color="#3b82f6" trend="Active Queue" />
                        <StatCard title="Emergency Priority Dispatch" value={emergencyCount} subtext="Severity Score ≥ 75" color="#ef4444" trend="High Priority" />
                        <StatCard title="SLA Resolution Rate" value="94.8%" subtext="Average fix time < 24 Hours" color="#10b981" trend="Target Met" />
                        <StatCard title="Active In-Progress Fixes" value={inProgressCount} subtext="Units currently deployed in field" color="#8b5cf6" trend="Active Units" />
                    </div>

                    {/* Seasonal Stress Trend Forecasting Chart */}
                    <TrendForecastingChart />

                    {/* Automated Dispatch Smart Triage Queue */}
                    <SmartQueueTable
                        issues={issues}
                        onSelectIssue={setSelectedIssue}
                        onSync={fetchData}
                        onStatusChange={handleStatusUpdate}
                    />

                    {/* Citizen Trust & Reputation Leaderboard */}
                    <CitizenTrustLeaderboard citizens={citizens} issues={issues} onTriggerToast={triggerToast} />
                </div>
            )}

            {/* Section 2: Smart Triage Queue Table */}
            {activeSection === 'complaints' && (
                <div key="complaints" className="page-fade-in">
                    <SmartQueueTable
                        issues={issues}
                        onSelectIssue={setSelectedIssue}
                        onSync={fetchData}
                        onStatusChange={handleStatusUpdate}
                    />
                </div>
            )}

            {/* Section 3: Interactive Geospatial Map View */}
            {activeSection === 'map' && (
                <div key="map" className="page-fade-in">
                    <GeospatialMapView
                        issues={issues}
                        onSelectIssue={setSelectedIssue}
                    />
                </div>
            )}

            {/* Section 4: Predictive Forecasting Engine */}
            {activeSection === 'forecasting' && (
                <div key="forecasting" className="page-fade-in">
                    <TrendForecastingChart />
                    <CitizenTrustLeaderboard citizens={citizens} issues={issues} onTriggerToast={triggerToast} />
                </div>
            )}

            {/* Section 5: Security Console & Audit Logs */}
            {activeSection === 'settings' && (
                <div key="settings" className="page-fade-in">
                    <OfficerCommandConsole
                        officials={officials}
                        issues={issues}
                    />
                </div>
            )}

            {/* Issue Details Modal */}
            {selectedIssue && (
                <IssueDetailsModal
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onStatusChange={handleStatusUpdate}
                />
            )}

            {/* Toast Notifications */}
            <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
        </DashboardLayout>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<OfficialLogin />} />
                    <Route path="/register" element={<OfficialRegister />} />
                    <Route path="/dashboard" element={<AuthenticatedDashboardContent />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
