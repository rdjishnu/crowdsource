import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const OfficialRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        securePin: '',
        govMasterKey: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        try {
            const response = await axiosInstance.post('/auth/official/register', formData);
            setMessage('Official account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data || 'Registration failed. Check Government Master Key.');
        }
    };

    return (
        <div className="auth-container glass-card" style={{ maxWidth: '480px' }}>
            <div className="auth-header">
                <span className="badge-gov">GOVERNMENT ONBOARDING</span>
                <h2>Official Registration</h2>
                <p>Authorized Personnel Credential Provisioning</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#94a3b8' }}>Full Name</label>
                    <input type="text" name="fullName" className="form-input" placeholder="Officer Name" onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#94a3b8' }}>Official Email</label>
                    <input type="email" name="email" className="form-input" placeholder="officer@gov.in" onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#94a3b8' }}>Password</label>
                    <input type="password" name="password" className="form-input" placeholder="Create strong password" onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#94a3b8' }}>6-Digit Security PIN</label>
                    <input type="password" name="securePin" className="form-input" placeholder="e.g. 123456" maxLength="6" onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#94a3b8' }}>Government Master Key</label>
                    <input type="password" name="govMasterKey" className="form-input" placeholder="SIH-JHARKHAND-2025" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Provision Official Account →</button>
            </form>

            {message && (
                <div className={`alert-box ${isError ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
                Already registered?{' '}
                <button
                    onClick={() => navigate('/login')}
                    style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                >
                    Sign in to Portal
                </button>
            </div>
        </div>
    );
};

export default OfficialRegister;
