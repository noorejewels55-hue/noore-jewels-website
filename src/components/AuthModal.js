'use client';

import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function AuthModal() {
    const {
        isAuthOpen, setIsAuthOpen, authStep, phone: authPhone,
        loading, error, sendOTP, verifyOTP, register, resetAuth
    } = useAuth();

    const [phoneInput, setPhoneInput] = useState('');
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [nameInput, setNameInput] = useState('');
    const otpRefs = useRef([]);

    useEffect(() => {
        if (authStep === 'otp' && otpRefs.current[0]) {
            otpRefs.current[0].focus();
        }
    }, [authStep]);

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        const clean = phoneInput.replace(/\D/g, '');
        if (clean.length >= 10) {
            const withCountry = clean.length === 10 ? '91' + clean : clean;
            sendOTP(withCountry);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newValues = [...otpValues];
        newValues[index] = value.slice(-1);
        setOtpValues(newValues);

        // Auto-focus next
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (newValues.every(v => v) && index === 5) {
            verifyOTP(newValues.join(''));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) {
            const newValues = paste.split('');
            setOtpValues(newValues);
            otpRefs.current[5]?.focus();
            verifyOTP(paste);
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (nameInput.trim().length >= 2) {
            register(nameInput.trim());
        }
    };

    const handleClose = () => {
        setIsAuthOpen(false);
        resetAuth();
        setPhoneInput('');
        setOtpValues(['', '', '', '', '', '']);
        setNameInput('');
    };

    if (!isAuthOpen) return null;

    return (
        <div className={`auth-overlay ${isAuthOpen ? 'open' : ''}`} onClick={handleClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="auth-close" onClick={handleClose}>✕</button>

                {/* Phone Step */}
                {authStep === 'phone' && (
                    <>
                        <h2 className="auth-title">Welcome</h2>
                        <p className="auth-subtitle">Sign in with your phone number to continue</p>

                        <form onSubmit={handlePhoneSubmit}>
                            <div className="auth-form-group">
                                <label className="auth-label">Phone Number</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        className="auth-input"
                                        style={{ width: '70px', textAlign: 'center' }}
                                        value="+91"
                                        readOnly
                                    />
                                    <input
                                        className="auth-input"
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        value={phoneInput}
                                        onChange={e => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        maxLength={10}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {error && <p className="auth-error">{error}</p>}

                            <button type="submit" className="btn btn-primary btn-full" disabled={loading || phoneInput.length < 10}>
                                {loading ? 'Sending OTP...' : 'Send OTP via WhatsApp'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '20px', lineHeight: '1.6' }}>
                            We&apos;ll send a 6-digit verification code to your WhatsApp. No spam, ever.
                        </p>
                    </>
                )}

                {/* OTP Step */}
                {authStep === 'otp' && (
                    <>
                        <h2 className="auth-title">Verify OTP</h2>
                        <p className="auth-subtitle">Enter the 6-digit code sent to your WhatsApp</p>

                        <div className="otp-inputs" onPaste={handleOtpPaste}>
                            {otpValues.map((val, i) => (
                                <input
                                    key={i}
                                    ref={el => otpRefs.current[i] = el}
                                    className="otp-input"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={val}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                />
                            ))}
                        </div>

                        {error && <p className="auth-error">{error}</p>}

                        <button
                            className="btn btn-primary btn-full"
                            onClick={() => verifyOTP(otpValues.join(''))}
                            disabled={loading || otpValues.some(v => !v)}
                        >
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>

                        <div className="auth-resend">
                            Didn&apos;t receive? <button onClick={() => sendOTP(authPhone)}>Resend OTP</button>
                        </div>
                    </>
                )}

                {/* Register Step */}
                {authStep === 'register' && (
                    <>
                        <h2 className="auth-title">Almost There</h2>
                        <p className="auth-subtitle">Tell us your name to complete sign up</p>

                        <form onSubmit={handleRegisterSubmit}>
                            <div className="auth-form-group">
                                <label className="auth-label">Your Name</label>
                                <input
                                    className="auth-input"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={nameInput}
                                    onChange={e => setNameInput(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            {error && <p className="auth-error">{error}</p>}

                            <button type="submit" className="btn btn-primary btn-full" disabled={loading || nameInput.trim().length < 2}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
