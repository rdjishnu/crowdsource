import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { getImageUrl } from '../services/api';

const ImageModal = ({ photoPath, category, issueId, onClose }) => {
  if (!photoPath) return null;

  const fullUrl = getImageUrl(photoPath);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '700px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Complaint Evidence Photo</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ticket #{issueId} • {category}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={fullUrl} target="_blank" rel="noreferrer" className="btn-icon" title="Open Full Size">
              <ExternalLink size={16} />
            </a>
            <button className="btn-icon" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
          <img
            src={fullUrl}
            alt={`Evidence for Ticket #${issueId}`}
            style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=Image+Load+Failed';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
