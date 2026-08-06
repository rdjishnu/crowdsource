import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

const StatusModal = ({ issue, onClose, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(issue?.status || 'Reported');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statuses = ['Reported', 'In Progress', 'Resolved', 'Rejected'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateStatus(issue.id, selectedStatus);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!issue) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Update Complaint Status</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ticket #{issue.id} • {issue.category}</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Select Official Status</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {statuses.map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`btn ${selectedStatus === st ? 'btn-primary' : 'btn-outline'}`}
                  style={{ justifyContent: 'center', padding: '10px' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Note:</strong> Status changes will instantly sync to the Citizen Mobile App timeline for Ticket #{issue.id}.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Confirm Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusModal;
