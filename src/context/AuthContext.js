'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp' | 'register'
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSentVia, setOtpSentVia] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Load session from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('noore-user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Error loading session:', e);
        }
        setIsInitialized(true);
    }, []);

    // Save session to localStorage
    useEffect(() => {
        if (!isInitialized) return;
        try {
            if (user) {
                localStorage.setItem('noore-user', JSON.stringify(user));
            } else {
                localStorage.removeItem('noore-user');
            }
        } catch (e) {
            console.error('Error saving session:', e);
        }
    }, [user, isInitialized]);

    const sendOTP = useCallback(async (phoneNumber, email) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber, email: email || '' }),
            });
            const data = await res.json();
            if (data.success) {
                setPhone(phoneNumber);
                setAuthStep('otp');
                setOtpSentVia(data.sentVia || 'whatsapp');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    }, []);

    const verifyOTP = useCallback(async (otp) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });
            const data = await res.json();
            if (data.success) {
                if (data.user) {
                    // Existing user, log them in
                    setUser(data.user);
                    setIsAuthOpen(false);
                    resetAuth();
                } else {
                    // New user, need to register
                    setAuthStep('register');
                }
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    }, [phone]);

    const register = useCallback(async (name) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, name }),
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.user);
                setIsAuthOpen(false);
                resetAuth();
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    }, [phone]);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('noore-user');
    }, []);

    const resetAuth = useCallback(() => {
        setAuthStep('phone');
        setPhone('');
        setError('');
        setOtpSentVia('');
        setLoading(false);
    }, []);

    const openAuth = useCallback(() => {
        resetAuth();
        setIsAuthOpen(true);
    }, [resetAuth]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthOpen,
            authStep,
            phone,
            loading,
            error,
            otpSentVia,
            isInitialized,
            setIsAuthOpen,
            openAuth,
            sendOTP,
            verifyOTP,
            register,
            logout,
            resetAuth,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
