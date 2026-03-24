'use client';

import { useEffect, useState } from 'react';

export default function ExitIntentPopup() {
    const [visible, setVisible] = useState(false);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Don't show if:
        // 1. Already captured this lead before
        // 2. User is already logged in
        // 3. Already shown this session
        const alreadyCaptured = localStorage.getItem('nj_lead_captured');
        const isLoggedIn = localStorage.getItem('nj_user');
        const shownThisSession = sessionStorage.getItem('nj_popup_shown');

        if (alreadyCaptured || isLoggedIn || shownThisSession) return;

        let triggered = false;

        const trigger = () => {
            if (triggered) return;
            triggered = true;
            sessionStorage.setItem('nj_popup_shown', '1');
            setVisible(true);
        };

        // Desktop: detect when mouse moves toward the browser top bar (exit intent)
        const handleMouseLeave = (e) => {
            if (e.clientY < 10) trigger();
        };

        // Mobile: show after 40 seconds of browsing
        const mobileTimer = setTimeout(trigger, 40000);

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(mobileTimer);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: cleanPhone, name }),
            });
            const data = await res.json();

            if (data.success) {
                setCouponCode(data.couponCode);
                setSubmitted(true);
                localStorage.setItem('nj_lead_captured', '1');

                // Retroactively update visitor name in Visitors sheet
                // (fire-and-forget — don't block the UI)
                if (name?.trim()) {
                    fetch('/api/track', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ visitorName: name.trim() }),
                        keepalive: true,
                    }).catch(() => {}); // silently ignore errors
                }
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch {
            setError('Network error. Please try again.');
        }
        setLoading(false);
    };

    if (!visible) return null;

    return (
        <>
            {/* Overlay */}
            <div
                onClick={() => setVisible(false)}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    zIndex: 9998,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.3s ease',
                }}
            />

            {/* Popup */}
            <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                width: '90%',
                maxWidth: '520px',
                background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0a 50%, #1a1208 100%)',
                borderRadius: '20px',
                border: '1px solid rgba(197,164,103,0.4)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(197,164,103,0.2)',
                animation: 'popupSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                overflow: 'hidden',
            }}>
                {/* Close button */}
                <button
                    onClick={() => setVisible(false)}
                    style={{
                        position: 'absolute', top: '12px', right: '16px',
                        background: 'none', border: 'none',
                        color: 'rgba(197,164,103,0.6)', fontSize: '22px',
                        cursor: 'pointer', lineHeight: 1, padding: '4px',
                        transition: 'color 0.2s',
                        zIndex: 1,
                    }}
                    onMouseEnter={e => e.target.style.color = '#C5A467'}
                    onMouseLeave={e => e.target.style.color = 'rgba(197,164,103,0.6)'}
                >✕</button>

                {/* Gold top bar */}
                <div style={{
                    height: '4px',
                    background: 'linear-gradient(90deg, transparent, #C5A467, #F0D690, #C5A467, transparent)',
                }} />

                <div style={{ padding: '32px 36px 36px' }}>

                    {!submitted ? (
                        <>
                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                <div style={{ fontSize: '36px', marginBottom: '8px' }}>💎</div>
                                <div style={{
                                    fontFamily: 'Georgia, serif',
                                    fontSize: '11px',
                                    letterSpacing: '4px',
                                    color: '#C5A467',
                                    textTransform: 'uppercase',
                                    marginBottom: '10px',
                                }}>Exclusive Offer</div>
                                <h2 style={{
                                    fontFamily: 'Georgia, serif',
                                    fontSize: '26px',
                                    color: '#F0D690',
                                    margin: '0 0 10px',
                                    lineHeight: 1.2,
                                }}>Get 10% OFF Your First Order</h2>
                                <p style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '14px',
                                    margin: 0,
                                    lineHeight: 1.5,
                                }}>
                                    Enter your WhatsApp number and we'll send your exclusive coupon instantly.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '14px' }}>
                                    <input
                                        type="text"
                                        placeholder="Your Name (optional)"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '13px 16px',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(197,164,103,0.3)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: '#fff',
                                            fontSize: '15px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#C5A467'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(197,164,103,0.3)'}
                                    />
                                </div>
                                <div style={{ marginBottom: '6px' }}>
                                    <div style={{
                                        display: 'flex',
                                        border: '1px solid rgba(197,164,103,0.3)',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        background: 'rgba(255,255,255,0.05)',
                                        transition: 'border-color 0.2s',
                                    }}
                                        onFocus={() => { }}
                                    >
                                        <span style={{
                                            padding: '13px 12px',
                                            color: 'rgba(197,164,103,0.8)',
                                            fontSize: '15px',
                                            borderRight: '1px solid rgba(197,164,103,0.2)',
                                            background: 'rgba(197,164,103,0.05)',
                                            whiteSpace: 'nowrap',
                                        }}>🇮🇳 +91</span>
                                        <input
                                            type="tel"
                                            placeholder="WhatsApp Number *"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            maxLength={10}
                                            required
                                            style={{
                                                flex: 1,
                                                padding: '13px 16px',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#fff',
                                                fontSize: '15px',
                                                outline: 'none',
                                            }}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p style={{ color: '#ff6b6b', fontSize: '13px', margin: '6px 0 10px', textAlign: 'center' }}>
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        marginTop: '14px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: loading
                                            ? 'rgba(197,164,103,0.4)'
                                            : 'linear-gradient(135deg, #C5A467, #F0D690, #C5A467)',
                                        backgroundSize: '200% auto',
                                        color: '#1a1208',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        letterSpacing: '1px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s',
                                        fontFamily: 'Georgia, serif',
                                    }}
                                    onMouseEnter={e => { if (!loading) e.target.style.backgroundPosition = 'right center'; }}
                                    onMouseLeave={e => { e.target.style.backgroundPosition = 'left center'; }}
                                >
                                    {loading ? 'Getting your coupon...' : '✨ Claim My 10% Off'}
                                </button>
                            </form>

                            <p style={{
                                textAlign: 'center',
                                color: 'rgba(255,255,255,0.35)',
                                fontSize: '11px',
                                marginTop: '16px',
                                marginBottom: 0,
                            }}>
                                🔒 We respect your privacy. No spam, ever.
                            </p>
                        </>
                    ) : (
                        /* Success State */
                        <div style={{ textAlign: 'center', padding: '10px 0' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                            <h2 style={{
                                fontFamily: 'Georgia, serif',
                                fontSize: '24px',
                                color: '#F0D690',
                                margin: '0 0 12px',
                            }}>Your Coupon is Ready!</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>
                                Use this code at checkout to get <strong style={{ color: '#C5A467' }}>10% off</strong> your first order:
                            </p>

                            {/* Coupon Code Box */}
                            <div style={{
                                background: 'rgba(197,164,103,0.1)',
                                border: '2px dashed #C5A467',
                                borderRadius: '12px',
                                padding: '18px',
                                marginBottom: '24px',
                            }}>
                                <div style={{
                                    fontFamily: 'monospace',
                                    fontSize: '28px',
                                    fontWeight: '700',
                                    color: '#F0D690',
                                    letterSpacing: '4px',
                                }}>{couponCode}</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '6px' }}>
                                    Valid on your first order · Apply at checkout
                                </div>
                            </div>

                            <button
                                onClick={() => setVisible(false)}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #C5A467, #F0D690, #C5A467)',
                                    color: '#1a1208',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    fontFamily: 'Georgia, serif',
                                }}
                            >
                                💎 Start Shopping Now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes popupSlideIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
                    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `}</style>
        </>
    );
}
