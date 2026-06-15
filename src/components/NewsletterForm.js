'use client';

import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');
    const [coupon, setCoupon] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus('success');
                setCoupon(data.couponCode);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            setStatus('error');
            setMessage('Failed to connect to the server. Please try again.');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {status === 'success' ? (
                <div style={{
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(197, 164, 103, 0.1)',
                    border: '1px solid var(--color-gold)',
                    textAlign: 'center',
                    maxWidth: '450px',
                    margin: '0 auto',
                    animation: 'fadeIn 0.5s ease',
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎉 Welcome to the Club!</div>
                    <p style={{ fontSize: '0.85rem', color: '#fff', margin: '0 0 12px' }}>
                        You have successfully subscribed to Noore Jewels.
                    </p>
                    <div style={{
                        background: '#fff',
                        color: 'var(--color-bg-dark)',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em',
                        display: 'inline-block',
                    }}>
                        USE CODE: {coupon}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px', marginBottom: 0 }}>
                        Enter this code at checkout to claim your 10% discount.
                    </p>
                </div>
            ) : (
                <form className="footer-newsletter-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="footer-newsletter-input" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                        required
                    />
                    <button 
                        type="submit" 
                        className="footer-newsletter-btn"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>
            )}

            {status === 'error' && (
                <div style={{
                    color: '#ff6b6b',
                    fontSize: '0.78rem',
                    marginTop: '8px',
                    textAlign: 'center',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    ⚠️ {message}
                </div>
            )}
        </div>
    );
}
