// File: web_dashboard/src/components/LanguageSwitcher.jsx
import React, { useState } from 'react';
import { setDashboardLanguage, getDashboardLanguage } from '../utils/i18n';

const LanguageSwitcher = ({ onLanguageChange }) => {
    const [lang, setLang] = useState(getDashboardLanguage());

    const handleToggle = (e) => {
        const selected = e.target.value;
        setLang(selected);
        setDashboardLanguage(selected);
        if (onLanguageChange) {
            onLanguageChange(selected);
        }
    };

    return (
        <select
            value={lang}
            onChange={handleToggle}
            className="form-input"
            style={{
                width: 'auto',
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer'
            }}
        >
            <option value="en" style={{ background: '#0f172a' }}>🌐 English (EN)</option>
            <option value="hi" style={{ background: '#0f172a' }}>🇮🇳 हिन्दी (HI)</option>
        </select>
    );
};

export default LanguageSwitcher;
