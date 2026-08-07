// File: web_dashboard/src/components/ResourceDispatchPanel.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const ResourceDispatchPanel = ({ issueId, resourceEstimate, onTeamAssigned }) => {
    const days = resourceEstimate?.estimatedDaysToFix || 3;
    const teamSize = resourceEstimate?.suggestedTeamSize || 3;
    const currentTeam = resourceEstimate?.allocatedTeam || 'Pending Dispatch';

    const [selectedTeam, setSelectedTeam] = useState(currentTeam);
    const [saving, setSaving] = useState(false);

    const handleAssignTeam = async () => {
        if (!issueId) return;
        setSaving(true);
        try {
            const response = await axiosInstance.put(`/issues/${issueId}/team`, {
                allocatedTeam: selectedTeam
            });
            if (onTeamAssigned) {
                onTeamAssigned(response.data);
            }
        } catch (err) {
            console.error('Failed to assign team:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            padding: '18px 20px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '20px'
        }}>
            <h4 style={{
                fontSize: '12px',
                fontWeight: '800',
                color: '#f59e0b',
                textTransform: 'uppercase',
                marginBottom: '12px',
                letterSpacing: '0.5px'
            }}>
                TACTICAL LOGISTICS & RESPONSE CREW DISPATCH
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px', fontSize: '13px' }}>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Target Repair SLA</span>
                    <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                        {days} Days Target
                    </div>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Recommended Deployment</span>
                    <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
                        {teamSize} Field Members
                    </div>
                </div>
            </div>

            {/* Team Allocation Control */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                    className="form-input"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                >
                    <option value="Pending Dispatch">Pending Dispatch</option>
                    <option value="Ward 4 Rapid Response">Ward 4 Rapid Response</option>
                    <option value="Heavy Machinery Unit">Heavy Machinery Unit</option>
                    <option value="Electrical Response Team">Electrical Response Team</option>
                    <option value="Sanitation Special Ops">Sanitation Special Ops</option>
                    <option value="Water Infrastructure Taskforce">Water Infrastructure Taskforce</option>
                </select>

                <button
                    onClick={handleAssignTeam}
                    disabled={saving}
                    className="btn-primary"
                    style={{ width: 'auto', padding: '8px 16px', fontSize: '12px', backgroundColor: '#3b82f6' }}
                >
                    {saving ? 'Assigning...' : 'Assign Response Unit'}
                </button>
            </div>
        </div>
    );
};

export default ResourceDispatchPanel;
