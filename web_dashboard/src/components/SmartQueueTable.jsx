// File: web_dashboard/src/components/SmartQueueTable.jsx
import React, { useState } from 'react';
import SeverityHeatBar from './SeverityHeatBar';
import VerificationPill from './VerificationPill';

const SmartQueueTable = ({ issues = [], onSelectIssue, onSync, onStatusChange }) => {
    const [selectedDept, setSelectedDept] = useState('ALL');
    const [quickFilter, setQuickFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('SEVERITY');
    const [selectedIssueIds, setSelectedIssueIds] = useState([]);

    // Filter by department, quick filter, and search query
    const filteredIssues = issues.filter(issue => {
        const dispatchData = issue.dispatchData || {};
        const dept = dispatchData.assignedDepartment || 'Municipal General';
        const matchesDept = (selectedDept === 'ALL') || (dept.toLowerCase() === selectedDept.toLowerCase());

        const score = issue.severityScore || dispatchData.severityScore || 50;
        let matchesQuick = true;
        if (quickFilter === 'URGENT') matchesQuick = score >= 75;
        if (quickFilter === 'UNASSIGNED') matchesQuick = (issue.status === 'Reported' || !issue.status);
        if (quickFilter === 'RESOLVED') matchesQuick = issue.status === 'Resolved';

        const query = searchQuery.toLowerCase();
        const matchesQuery = !query ||
            (issue.category && issue.category.toLowerCase().includes(query)) ||
            (issue.description && issue.description.toLowerCase().includes(query)) ||
            (issue.address && issue.address.toLowerCase().includes(query)) ||
            (issue.citizenName && issue.citizenName.toLowerCase().includes(query)) ||
            (dept.toLowerCase().includes(query));

        return matchesDept && matchesQuick && matchesQuery;
    });

    // Multi-criteria sorting
    const sortedIssues = [...filteredIssues].sort((a, b) => {
        if (sortBy === 'SEVERITY') {
            const scoreA = a.severityScore || a.dispatchData?.severityScore || 50;
            const scoreB = b.severityScore || b.dispatchData?.severityScore || 50;
            return scoreB - scoreA;
        } else if (sortBy === 'TRUST') {
            const trustA = a.citizenTrustScore != null ? a.citizenTrustScore : 100;
            const trustB = b.citizenTrustScore != null ? b.citizenTrustScore : 100;
            return trustB - trustA;
        } else {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
    });

    // Multi-select handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIssueIds(sortedIssues.map(i => i.id));
        } else {
            setSelectedIssueIds([]);
        }
    };

    const handleToggleSelect = (id, e) => {
        e.stopPropagation();
        setSelectedIssueIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkStatusChange = (newStatus, e) => {
        if (e) e.stopPropagation();
        if (selectedIssueIds.length === 0) return;
        selectedIssueIds.forEach(id => {
            onStatusChange?.(id, newStatus);
        });
        setSelectedIssueIds([]);
    };

    // CSV Exporter Feature
    const exportToCSV = () => {
        if (sortedIssues.length === 0) return;
        const headers = ['ID,Category,SeverityScore,Status,Address,CitizenName,TrustScore,AssignedDepartment\n'];
        const rows = sortedIssues.map(i => {
            const dept = i.dispatchData?.assignedDepartment || 'Municipal General';
            const score = i.severityScore || i.dispatchData?.severityScore || 50;
            const cleanAddr = (i.address || 'Ranchi').replace(/,/g, ' ');
            return `${i.id},"${i.category}",${score},"${i.status || 'Reported'}","${cleanAddr}","${i.citizenName || 'Verified Citizen'}",${i.citizenTrustScore || 100},"${dept}"`;
        });

        const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NexusGov_SmartQueue_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    return (
        <div className="glass-card" style={{ padding: '28px' }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        SMART TRIAGE QUEUE & AUTOMATED DISPATCH CONSOLE
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                        Automated severity ranking and multi-department dispatch management.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* CSV Export Button */}
                    <button onClick={exportToCSV} className="btn-primary btn-secondary" style={{ width: 'auto', padding: '8px 14px', fontSize: '12px' }}>
                        Export CSV
                    </button>

                    {/* Sort Selector */}
                    <select
                        className="form-input"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ maxWidth: '160px', cursor: 'pointer', padding: '8px 12px', fontSize: '12px' }}
                    >
                        <option value="SEVERITY">Sort: Severity Score</option>
                        <option value="DATE">Sort: Newest First</option>
                        <option value="TRUST">Sort: Citizen Trust</option>
                    </select>

                    {/* Department Filter Dropdown */}
                    <select
                        className="form-input"
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        style={{ maxWidth: '180px', cursor: 'pointer', padding: '8px 12px', fontSize: '12px' }}
                    >
                        <option value="ALL">All Departments</option>
                        <option value="Public Works">Public Works</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Water & Sanitation">Water & Sanitation</option>
                        <option value="Electrical">Electrical</option>
                    </select>

                    {/* Search */}
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search address or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ maxWidth: '200px', padding: '8px 12px', fontSize: '12px' }}
                    />
                    <button onClick={onSync} className="btn-primary btn-secondary" style={{ width: 'auto', padding: '8px 14px', fontSize: '12px' }}>
                        Refresh Queue
                    </button>
                </div>
            </div>

            {/* Quick Filter Interactive Pills */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                    { key: 'ALL', label: 'All Incidents' },
                    { key: 'URGENT', label: 'Urgent Priority (≥75)' },
                    { key: 'UNASSIGNED', label: 'Pending Dispatch' },
                    { key: 'RESOLVED', label: 'Completed Fixes' }
                ].map(q => (
                    <button
                        key={q.key}
                        onClick={() => setQuickFilter(q.key)}
                        className={`glass-pill ${quickFilter === q.key ? 'glass-pill-blue' : ''}`}
                        style={{
                            cursor: 'pointer',
                            padding: '6px 14px',
                            background: quickFilter === q.key ? '#3b82f6' : 'rgba(255,255,255,0.04)',
                            color: quickFilter === q.key ? '#ffffff' : '#94a3b8',
                            borderColor: quickFilter === q.key ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                            fontSize: '12px'
                        }}
                    >
                        {q.label}
                    </button>
                ))}
            </div>

            {/* Bulk Action Toolbar */}
            {selectedIssueIds.length > 0 && (
                <div style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#60a5fa' }}>
                        {selectedIssueIds.length} Incident Records Selected
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={(e) => handleBulkStatusChange('In Progress', e)}
                            className="btn-primary"
                            style={{ padding: '6px 14px', fontSize: '12px', backgroundColor: '#f59e0b' }}
                        >
                            Mark In Progress
                        </button>
                        <button
                            onClick={(e) => handleBulkStatusChange('Resolved', e)}
                            className="btn-primary btn-emerald"
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                            Mark Resolved
                        </button>
                        <button
                            onClick={() => setSelectedIssueIds([])}
                            className="btn-primary btn-secondary"
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                            Deselect All
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            {sortedIssues.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>No civic incidents match your current queue filters.</h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                        Live complaints submitted from the citizen mobile app will appear here in real-time.
                    </p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                                <th style={{ padding: '14px 16px', width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIssueIds.length === sortedIssues.length && sortedIssues.length > 0}
                                        onChange={handleSelectAll}
                                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                    />
                                </th>
                                <th style={{ padding: '14px 16px' }}>SEVERITY & STATUS</th>
                                <th style={{ padding: '14px 16px' }}>LOCATION ADDRESS</th>
                                <th style={{ padding: '14px 16px' }}>ASSIGNED DEPT</th>
                                <th style={{ padding: '14px 16px' }}>EVIDENCE</th>
                                <th style={{ padding: '14px 16px' }}>CITIZEN & TRUST</th>
                                <th style={{ padding: '14px 16px' }}>CATEGORY & DESC</th>
                                <th style={{ padding: '14px 16px' }}>ACTIONS & DISPATCH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedIssues.map(issue => {
                                const dispatchData = issue.dispatchData || {};
                                const score = issue.severityScore || dispatchData.severityScore || 50;
                                const isEmergency = dispatchData.isEmergency || (score > 75);
                                const dept = dispatchData.assignedDepartment || 'Municipal General';
                                const supportCount = dispatchData.supportCount || 1;
                                const displayAddress = issue.address || `Lat ${issue.latitude?.toFixed(4)}, Long ${issue.longitude?.toFixed(4)}`;
                                const isSelected = selectedIssueIds.includes(issue.id);
                                const status = issue.status || 'Reported';

                                const statusPillClass = status === 'Resolved'
                                    ? 'glass-pill-emerald'
                                    : (status === 'In Progress' ? 'glass-pill-amber' : (status === 'Rejected' ? 'glass-pill-ruby' : 'glass-pill-blue'));

                                return (
                                    <tr
                                        key={issue.id}
                                        className="interactive-table-row"
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            backgroundColor: isSelected
                                                ? 'rgba(59, 130, 246, 0.15)'
                                                : (status === 'Resolved' ? 'rgba(16, 185, 129, 0.05)' : (isEmergency ? 'rgba(239, 68, 68, 0.08)' : 'transparent')),
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => onSelectIssue(issue)}
                                    >
                                        <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => handleToggleSelect(issue.id, e)}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <span className={`glass-pill ${statusPillClass}`} style={{ width: 'fit-content', fontSize: '10px' }}>
                                                    {status}
                                                </span>
                                                <SeverityHeatBar score={score} isEmergency={isEmergency} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                                            <div style={{ color: '#60a5fa', fontWeight: '700', fontSize: '13px' }}>
                                                {displayAddress}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                                Lat {issue.latitude?.toFixed(4) || 'Live'}, Lng {issue.longitude?.toFixed(4) || 'GPS'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                                color: '#60a5fa',
                                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                                whiteSpace: 'nowrap',
                                                display: 'inline-block'
                                            }}>
                                                {dept}
                                            </span>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                                                {supportCount} Upvotes
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {issue.photoPath ? (
                                                <img
                                                    src={`http://localhost:8080/api/images/${issue.photoPath}`}
                                                    alt="Evidence"
                                                    style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                                                />
                                            ) : (
                                                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#94a3b8' }}>
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: '700', color: '#f8fafc' }}>{issue.citizenName || 'Verified Citizen'}</div>
                                            <div style={{ fontSize: '12px', color: '#60a5fa' }}>{issue.citizenTrustScore != null ? issue.citizenTrustScore : 100} Pts</div>
                                        </td>
                                        <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#34d399', textTransform: 'uppercase' }}>{issue.category}</span>
                                            <div style={{ color: '#cbd5e1', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {issue.description}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onStatusChange?.(issue.id, 'In Progress');
                                                    }}
                                                    title="Mark In Progress"
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        background: status === 'In Progress' ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)',
                                                        color: status === 'In Progress' ? '#ffffff' : '#fbbf24',
                                                        border: '1px solid rgba(245, 158, 11, 0.4)',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    Progress
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onStatusChange?.(issue.id, 'Resolved');
                                                    }}
                                                    title="Mark Resolved"
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        background: status === 'Resolved' ? '#10b981' : 'rgba(16, 185, 129, 0.2)',
                                                        color: status === 'Resolved' ? '#ffffff' : '#34d399',
                                                        border: '1px solid rgba(16, 185, 129, 0.4)',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {status === 'Resolved' ? 'Resolved' : 'Resolve'}
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelectIssue(issue);
                                                    }}
                                                    className="btn-primary"
                                                    style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                                                >
                                                    Inspect
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SmartQueueTable;
