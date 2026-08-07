// File: web_dashboard/src/components/NetworkResilienceBadge.jsx
import React from 'react';

const NetworkResilienceBadge = ({ offlineSyncData }) => {
    if (!offlineSyncData || !offlineSyncData.isOfflineSynced) {
        return null;
    }

    const captureTime = offlineSyncData.originalCaptureTime
        ? new Date(offlineSyncData.originalCaptureTime).toLocaleString()
        : 'Offline Capture';

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            color: '#c084fc',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            marginTop: '8px'
        }}>
            <span>☁️</span> Received via Offline Sync • Original Capture: {captureTime}
        </div>
    );
};

export default NetworkResilienceBadge;
