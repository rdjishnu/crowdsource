// File: web_dashboard/src/components/VerificationPill.jsx
import React from 'react';

const VerificationPill = ({ metadata, trustScore = 100 }) => {
    let text = 'Verified Authentic';
    let bgColor = 'rgba(16, 185, 129, 0.15)';
    let textColor = '#34d399';
    let borderColor = 'rgba(16, 185, 129, 0.3)';
    let icon = '🛡️';

    if (metadata) {
        if (metadata.isGpsSpoofed || metadata.statusFlag === 'GPS_SPOOFED') {
            text = 'GPS Spoofing Alert';
            bgColor = 'rgba(239, 68, 68, 0.2)';
            textColor = '#f87171';
            borderColor = 'rgba(239, 68, 68, 0.4)';
            icon = '🚨';
        } else if (metadata.isDuplicate || metadata.statusFlag === 'DUPLICATE_IMAGE') {
            text = 'Duplicate Image Warning';
            bgColor = 'rgba(245, 158, 11, 0.2)';
            textColor = '#fbbf24';
            borderColor = 'rgba(245, 158, 11, 0.4)';
            icon = '⚠️';
        } else if (metadata.statusFlag === 'LOW_TRUST_SPAM' || trustScore < 50) {
            text = 'Low Trust Reporter Warning';
            bgColor = 'rgba(249, 115, 22, 0.2)';
            textColor = '#fb923c';
            borderColor = 'rgba(249, 115, 22, 0.4)';
            icon = '⚡';
        }
    }

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: bgColor,
            color: textColor,
            border: `1px solid ${borderColor}`
        }}>
            <span>{icon}</span> {text}
        </span>
    );
};

export default VerificationPill;
