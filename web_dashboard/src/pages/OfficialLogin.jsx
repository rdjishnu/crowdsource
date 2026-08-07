import React, { useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OfficialLogin = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [securePin, setSecurePin] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleStep1 = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(false);
        try {
            const response = await axiosInstance.post('/auth/official/login', { email, password });
            if (response.data.requiresPin) {
                setStep(2);
                setMessage('2FA Step: Enter your 6-digit Secure Government PIN');
            }
        } catch (err) {
            setError(true);
            setMessage(err.response?.data || 'Login failed. Please check credentials and server status.');
        }
    };

    const handleStep2 = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(false);
        try {
            const response = await axiosInstance.post('/auth/official/verify-pin', { email, securePin });
            login(response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(true);
            setMessage('Invalid 6-digit Security PIN');
        }
    };

    return (
        <div className="auth-container glass-card">
            <div className="auth-header">
                <span className="badge-gov">GOVERNMENT PORTAL</span>
                <h2>Official Security Login</h2>
                <p>{step === 1 ? 'Zero-Trust Portal Authentication' : 'Multi-Factor PIN Verification'}</p>
            </div>

            {step === 1 ? (
                <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#94a3b8' }}>Official Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="officer@gov.in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#94a3b8' }}>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Authenticate & Continue →</button>
                </form>
            ) : (
                <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#94a3b8' }}>6-Digit Security PIN</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="6-Digit Security PIN"
                            value={securePin}
                            maxLength="6"
                            onChange={(e) => setSecurePin(e.target.value)}
                            required
                            style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '18px' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary btn-success">Verify PIN & Access Portal ✓</button>
                    <button type="button" onClick={() => setStep(1)} className="btn-primary btn-secondary">← Back to Credentials</button>
                </form>
            )}

            {message && (
                <div className={`alert-box ${error ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            {step === 1 && (
                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
                    New Government Official?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                    >
                        Register Account
                    </button>
                </div>
            )}
        </div>
    );
};

export default OfficialLogin;
