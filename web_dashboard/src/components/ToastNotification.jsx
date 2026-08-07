// File: web_dashboard/src/components/ToastNotification.jsx
import React from 'react';

const ToastNotification = ({ toasts = [], onDismiss }) => {
    if (toasts.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '380px',
            width: '100%',
            pointerEvents: 'none'
        }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="organic-panel"
                    style={{
                        padding: '14px 18px',
                        background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(9, 13, 22, 0.95)',
                        border: `1px solid ${toast.type === 'error' ? '#ef4444' : '#3b82f6'}`,
                        borderRadius: '16px',
                        color: '#ffffff',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                        pointerEvents: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        gap: '12px',
                        animation: 'pageSlideUp 0.3s ease forwards'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600' }}>
                        <span>{toast.message}</span>
                    </div>

                    <button
                        onClick={() => onDismiss(toast.id)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '700'
                        }}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastNotification;
