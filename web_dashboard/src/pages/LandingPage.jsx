// File: web_dashboard/src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const playStartupSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc1.type = 'sine';
            osc2.type = 'triangle';

            // High-tech harmonic frequency sweep (220Hz -> 880Hz)
            osc1.frequency.setValueAtTime(220, audioCtx.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.2);

            osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 1.2);

            gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
            osc1.stop(audioCtx.currentTime + 1.8);
            osc2.stop(audioCtx.currentTime + 1.8);
        } catch (e) {
            console.log('Audio playback initialized:', e);
        }
    };

    const handleEnterPortal = () => {
        playStartupSound();
        setTimeout(() => {
            navigate('/login');
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)',
            padding: '24px'
        }}>
            <div className="glass-card" style={{ maxWidth: '640px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
                <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '42px',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)'
                }}>
                    🛡️
                </div>

                <span className="badge-gov" style={{ fontSize: '13px', padding: '6px 16px' }}>STATE OF JHARKHAND</span>
                <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '12px 0 8px 0', color: '#ffffff', letterSpacing: '0.5px' }}>
                    NexusGov Enterprise
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '36px' }}>
                    Zero-Trust Government Network Operations Center & Real-Time Citizen Engagement Infrastructure.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={handleEnterPortal}
                        className="btn-primary"
                        style={{ padding: '16px 28px', fontSize: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        🔊 INITIALIZE NOC COMMAND PORTAL →
                    </button>
                </div>

                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '32px' }}>
                    256-Bit Encrypted Session • Restricted Government Personnel Only
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
