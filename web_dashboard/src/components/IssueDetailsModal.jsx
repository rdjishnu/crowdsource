// File: web_dashboard/src/components/IssueDetailsModal.jsx
import React, { useState } from 'react';
import VerificationPill from './VerificationPill';
import SeverityHeatBar from './SeverityHeatBar';
import ResourceDispatchPanel from './ResourceDispatchPanel';
import NetworkResilienceBadge from './NetworkResilienceBadge';
import PrintWorkOrderModal from './PrintWorkOrderModal';

const IssueDetailsModal = ({ issue, onClose, onStatusChange }) => {
    const [currentIssue, setCurrentIssue] = useState(issue);
    const [copied, setCopied] = useState(false);
    const [officerNote, setOfficerNote] = useState('');
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [notesList, setNotesList] = useState([
        { time: '10:15 AM', author: 'System Dispatch Engine', text: 'Issue registered & routed based on severity classification.' }
    ]);

    if (!currentIssue) return null;

    const imageUrl = currentIssue.photoPath
        ? `http://localhost:8080/api/images/${currentIssue.photoPath}`
        : null;

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentIssue.latitude || 0},${currentIssue.longitude || 0}`;
    const trustScore = currentIssue.citizenTrustScore != null ? currentIssue.citizenTrustScore : 100;
    const metadata = currentIssue.metadata || {};
    const dispatchData = currentIssue.dispatchData || {};
    const resourceEstimate = currentIssue.resourceEstimate || {};
    const offlineSyncData = currentIssue.offlineSyncData || {};
    const displayAddress = currentIssue.address || `Lat ${currentIssue.latitude?.toFixed(4)}, Long ${currentIssue.longitude?.toFixed(4)}`;

    const dept = dispatchData.assignedDepartment || 'Municipal General';
    const severityScore = currentIssue.severityScore || dispatchData.severityScore || 50;
    const isEmergency = dispatchData.isEmergency || (severityScore > 75);
    const supportCount = dispatchData.supportCount || 1;

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(displayAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddNote = () => {
        if (!officerNote.trim()) return;
        setNotesList(prev => [
            ...prev,
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), author: 'Officer Portal', text: officerNote.trim() }
        ]);
        setOfficerNote('');
    };

    const handleStatusClick = (newStatus) => {
        setCurrentIssue(prev => ({ ...prev, status: newStatus }));
        onStatusChange?.(currentIssue.id, newStatus);
        setNotesList(prev => [
            ...prev,
            {
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                author: 'Officer Command',
                text: `Status updated to "${newStatus}".`
            }
        ]);
    };

    return (
        <>
            <div className="modal-backdrop" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(3, 7, 18, 0.88)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                zIndex: 2000,
                padding: '24px'
            }}>
                <div className="organic-panel modal-card" style={{
                    maxWidth: '720px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '32px',
                    position: 'relative',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)'
                }}>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#f8fafc',
                            fontSize: '18px',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justify: 'center',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        ✕
                    </button>

                    {/* Modal Header Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span className="glass-pill glass-pill-blue">
                            Assigned: {dept}
                        </span>
                        <span className={`glass-pill ${currentIssue.status === 'Resolved' ? 'glass-pill-emerald' : (currentIssue.status === 'Rejected' ? 'glass-pill-ruby' : 'glass-pill-amber')}`}>
                            {currentIssue.status || 'Reported'}
                        </span>
                        <VerificationPill metadata={metadata} trustScore={trustScore} />
                    </div>

                    {/* Offline Sync Badge */}
                    <NetworkResilienceBadge offlineSyncData={offlineSyncData} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '12px', marginBottom: '8px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff' }}>
                            Issue #{currentIssue.id} • {currentIssue.category}
                        </h2>

                        {/* Printable Work Order Button */}
                        <button
                            onClick={() => setShowPrintModal(true)}
                            className="btn-primary btn-secondary"
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                            Official Work Order Memo
                        </button>
                    </div>

                    <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <p style={{ color: '#f8fafc', fontSize: '14px', fontWeight: '700' }}>
                                Citizen Name: <span style={{ color: '#34d399' }}>{currentIssue.citizenName || 'Verified Citizen'}</span>
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                                Email: <span style={{ color: '#60a5fa' }}>{currentIssue.citizenEmail || 'anonymous@citizen.gov'}</span> • {supportCount} Upvotes
                            </p>
                        </div>
                        <div>
                            <SeverityHeatBar score={severityScore} isEmergency={isEmergency} />
                        </div>
                    </div>

                    {/* Prominent Reverse Geocoded Street Address Card */}
                    <div style={{
                        padding: '16px 20px',
                        borderRadius: '12px',
                        background: 'rgba(59, 130, 246, 0.12)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        marginBottom: '20px',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#60a5fa', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                PHYSICAL REVERSE GEOCODED ADDRESS
                            </h4>
                            <p style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', lineHeight: '1.4' }}>
                                {displayAddress}
                            </p>
                        </div>

                        <button
                            onClick={handleCopyAddress}
                            className="btn-primary btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '11px', width: 'auto' }}
                        >
                            {copied ? 'Copied' : 'Copy Address'}
                        </button>
                    </div>

                    {/* Tactical Resource Allocation & Response Dispatch Panel */}
                    <ResourceDispatchPanel
                        issueId={currentIssue.id}
                        resourceEstimate={resourceEstimate}
                        onTeamAssigned={(updatedIssue) => setCurrentIssue(updatedIssue)}
                    />

                    {/* Photo Evidence Preview */}
                    {imageUrl ? (
                        <div style={{ marginBottom: '20px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#030712', position: 'relative' }}>
                            <img
                                src={imageUrl}
                                alt="Civic Issue Evidence"
                                style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block' }}
                            />
                            <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                                <VerificationPill metadata={metadata} trustScore={trustScore} />
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                            No photo attached to this report
                        </div>
                    )}

                    {/* Internal Dispatch Log & Officer Notes */}
                    <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                            OFFICIAL DISPATCH NOTES & ACTIVITY LOG
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', maxHeight: '120px', overflowY: 'auto' }}>
                            {notesList.map((n, idx) => (
                                <div key={idx} style={{ fontSize: '12px', color: '#cbd5e1', padding: '6px 10px', borderRadius: '8px', background: 'rgba(3, 7, 18, 0.5)' }}>
                                    <span style={{ color: '#60a5fa', fontWeight: '700' }}>[{n.time}] {n.author}:</span> {n.text}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Add official note or dispatch instruction..."
                                value={officerNote}
                                onChange={(e) => setOfficerNote(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                style={{ fontSize: '12px', padding: '8px 12px' }}
                            />
                            <button onClick={handleAddNote} className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: '12px' }}>
                                Add Note
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Description
                        </h4>
                        <p style={{ fontSize: '14px', color: '#f8fafc', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {currentIssue.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Location & Maps Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '24px' }}>
                        <div>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>GPS Telemetry</p>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#60a5fa', marginTop: '2px' }}>
                                Lat: {currentIssue.latitude?.toFixed(5) || '0.00000'}, Lng: {currentIssue.longitude?.toFixed(5) || '0.00000'}
                            </p>
                        </div>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ width: 'auto', textDecoration: 'none', padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            View on Google Maps
                        </a>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => handleStatusClick('In Progress')}
                            className="btn-primary"
                            style={{
                                flex: 1,
                                backgroundColor: currentIssue.status === 'In Progress' ? '#d97706' : '#f59e0b',
                                fontSize: '12px'
                            }}
                        >
                            {currentIssue.status === 'In Progress' ? 'In Progress' : 'Set In Progress'}
                        </button>
                        <button
                            onClick={() => handleStatusClick('Resolved')}
                            className="btn-primary btn-emerald"
                            style={{
                                flex: 1,
                                fontSize: '12px',
                                backgroundColor: currentIssue.status === 'Resolved' ? '#059669' : undefined
                            }}
                        >
                            {currentIssue.status === 'Resolved' ? 'Resolved (+10 Pts)' : 'Resolve (+10 Pts)'}
                        </button>
                        <button
                            onClick={() => handleStatusClick('Rejected')}
                            className="btn-primary btn-ruby"
                            style={{
                                flex: 1,
                                fontSize: '12px',
                                backgroundColor: currentIssue.status === 'Rejected' ? '#991b1b' : undefined
                            }}
                        >
                            {currentIssue.status === 'Rejected' ? 'Rejected (-25 Pts)' : 'Reject (-25 Pts)'}
                        </button>
                    </div>
                </div>
            </div>

            {showPrintModal && (
                <PrintWorkOrderModal
                    issue={currentIssue}
                    onClose={() => setShowPrintModal(false)}
                />
            )}
        </>
    );
};

export default IssueDetailsModal;
