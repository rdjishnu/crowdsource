// File: web_dashboard/src/components/PrintWorkOrderModal.jsx
import React from 'react';

const PrintWorkOrderModal = ({ issue, onClose }) => {
    if (!issue) return null;

    const handlePrint = () => {
        window.print();
    };

    const dispatchData = issue.dispatchData || {};
    const dept = dispatchData.assignedDepartment || 'Public Works Department';
    const displayAddress = issue.address || `Lat ${issue.latitude?.toFixed(4)}, Long ${issue.longitude?.toFixed(4)}`;

    return (
        <div className="modal-backdrop" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3000, padding: '24px'
        }}>
            <div className="organic-panel" style={{
                maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
                padding: '32px', background: '#ffffff', color: '#0f172a', borderRadius: '16px',
                border: '2px solid #0284c7', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}>
                {/* Print Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '16px', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0369a1', textTransform: 'uppercase' }}>
                            GOVERNMENT OF JHARKHAND
                        </h2>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>
                            MUNICIPAL CORPORATION NOC FIELD WORK ORDER
                        </h4>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
                        <div><b>ORDER NO:</b> NOG-WO-2026-00{issue.id}</div>
                        <div><b>DATE:</b> {new Date().toLocaleDateString('en-IN')}</div>
                    </div>
                </div>

                {/* Work Order Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Department</span>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#0284c7', marginTop: '2px' }}>{dept}</div>
                    </div>

                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Severity Classification</span>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: (issue.severityScore || 50) >= 75 ? '#dc2626' : '#d97706', marginTop: '2px' }}>
                            {(issue.severityScore || 50) >= 75 ? 'URGENT EMERGENCY' : 'HIGH PRIORITY'} ({issue.severityScore || 50}/100)
                        </div>
                    </div>
                </div>

                <div style={{ padding: '14px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '20px', fontSize: '13px' }}>
                    <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: '800', textTransform: 'uppercase' }}>Target Location & Address</span>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0c4a6e', marginTop: '2px' }}>
                        {displayAddress}
                    </div>
                    <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '4px' }}>
                        GPS Coordinates: Lat {issue.latitude?.toFixed(5)}, Lng {issue.longitude?.toFixed(5)}
                    </div>
                </div>

                <div style={{ marginBottom: '20px', fontSize: '13px' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Issue Category & Scope of Work</span>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                        {issue.category}
                    </div>
                    <p style={{ color: '#475569', marginTop: '6px', lineHeight: '1.5' }}>
                        {issue.description || 'Routine civic repair work order dispatched via NexusGov AI NOC Triage.'}
                    </p>
                </div>

                {/* Evidence Photo Preview */}
                {issue.photoPath && (
                    <div style={{ marginBottom: '24px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Photographic Evidence</span>
                        <img
                            src={`http://localhost:8080/api/images/${issue.photoPath}`}
                            alt="Work Order Evidence"
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginTop: '6px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                )}

                {/* Signature & Stamp Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px dashed #cbd5e1', paddingTop: '20px', marginTop: '20px' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Authorized NOC Administrator</div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>Officer Priya Sharma</div>
                        <div style={{ fontSize: '11px', color: '#0284c7' }}>NexusGov Command Seal Signed</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px 20px', border: '2px solid #0284c7', borderRadius: '8px', color: '#0284c7', fontWeight: '800', fontSize: '12px' }}>
                        OFFICIAL WORK ORDER<br />APPROVED FOR DISPATCH
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button onClick={handlePrint} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                        Print / Save Work Order PDF
                    </button>
                    <button onClick={onClose} className="btn-primary btn-secondary" style={{ width: 'auto', padding: '12px 20px', color: '#0f172a' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintWorkOrderModal;
