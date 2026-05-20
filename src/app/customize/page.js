'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function CustomizePageContent() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        jewelleryType: '',
        metalPurity: '',
        diamondQuality: '',
        caratWeight: '',
        ringSize: '',
        budgetRange: '',
        specialRequirements: '',
    });
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(1);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setResult(null);

        try {
            const res = await fetch('/api/customize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setResult({ success: data.success, message: data.message });

            if (data.success) {
                setFormData({
                    name: '', phone: '', email: '', jewelleryType: '',
                    metalPurity: '', diamondQuality: '', caratWeight: '',
                    ringSize: '', budgetRange: '', specialRequirements: '',
                });
                setStep(1);
            }
        } catch (err) {
            setResult({ success: false, message: 'Failed to submit. Please try WhatsApp.' });
        }
        setSending(false);
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 18px',
        border: '1px solid rgba(197,164,103,0.25)',
        borderRadius: '10px',
        fontSize: '0.9rem',
        background: 'rgba(255,255,255,0.95)',
        color: '#2C2420',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#2C2420',
        marginBottom: '8px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    };

    const selectBtnStyle = (selected) => ({
        padding: '12px 20px',
        border: selected ? '2px solid #C5A467' : '1px solid rgba(197,164,103,0.2)',
        borderRadius: '10px',
        background: selected ? 'linear-gradient(135deg, rgba(197,164,103,0.12), rgba(240,214,144,0.08))' : 'rgba(255,255,255,0.9)',
        color: selected ? '#C5A467' : '#555',
        fontSize: '0.85rem',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        fontFamily: 'inherit',
        position: 'relative',
    });

    const showRingSize = formData.jewelleryType === 'Ring' || formData.jewelleryType === 'Solitaire Ring' || formData.jewelleryType === 'Engagement Ring';

    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            {/* ── PREMIUM HERO ── */}
            <section style={{
                position: 'relative',
                padding: '120px 0 80px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 30%, #2d1f0a 60%, #1a1208 100%)',
                overflow: 'hidden',
            }}>
                {/* Decorative sparkles */}
                {[
                    { top: '20%', left: '10%', size: 6, color: '#F0D690', delay: 0 },
                    { top: '40%', right: '15%', size: 4, color: '#fff', delay: 1 },
                    { bottom: '25%', left: '20%', size: 3, color: '#C5A467', delay: 0.5 },
                    { top: '60%', right: '8%', size: 5, color: '#F0D690', delay: 1.5 },
                ].map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        ...s,
                        width: s.size,
                        height: s.size,
                        background: s.color,
                        borderRadius: '50%',
                        boxShadow: `0 0 ${s.size * 3}px ${s.size}px ${s.color}40`,
                        animation: `pulse ${3 + i * 0.3}s ease-in-out infinite ${s.delay}s`,
                    }} />
                ))}

                <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, rgba(197,164,103,0.15), rgba(240,214,144,0.1))',
                        border: '1px solid rgba(197,164,103,0.3)',
                        borderRadius: '30px',
                        marginBottom: '28px',
                    }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C5A467' }}>
                            ✦ Design Your Dream Jewellery ✦
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                        fontWeight: 300,
                        lineHeight: 1.15,
                        marginBottom: '24px',
                        letterSpacing: '0.06em',
                        color: '#fff',
                    }}>
                        Customize Your{' '}
                        <em style={{
                            fontStyle: 'italic',
                            background: 'linear-gradient(135deg, #C5A467, #F0D690, #C5A467)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Jewels
                        </em>
                    </h1>

                    <p style={{
                        fontSize: '1rem',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.9,
                        maxWidth: '600px',
                        margin: '0 auto 36px',
                    }}>
                        Tell us what you envision — choose your metal, diamond quality, and design preferences.
                        Our craftsmen will bring your dream jewellery to life with certified lab grown diamonds.
                    </p>

                    <div style={{
                        width: '80px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #C5A467, transparent)',
                        margin: '0 auto 36px',
                    }} />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { icon: '💎', label: 'Certified Diamonds' },
                            { icon: '🎨', label: 'Your Design' },
                            { icon: '📜', label: 'IGI Certified' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: 'rgba(197,164,103,0.08)',
                                border: '1px solid rgba(197,164,103,0.15)',
                                borderRadius: '8px',
                            }}>
                                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.8)',
                                }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle" style={{ maxWidth: '550px', margin: '0 auto 48px' }}>
                        Three simple steps to your perfect jewellery
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '32px',
                        maxWidth: '900px',
                        margin: '0 auto',
                    }}>
                        {[
                            {
                                num: '01',
                                icon: '📝',
                                title: 'Share Your Vision',
                                text: 'Fill in the form below with your preferences — jewellery type, metal, diamond quality, and budget.',
                            },
                            {
                                num: '02',
                                icon: '💬',
                                title: 'Get a Quote',
                                text: 'Our team will contact you within 24 hours with a detailed quote and design options.',
                            },
                            {
                                num: '03',
                                icon: '💎',
                                title: 'Receive Your Jewels',
                                text: 'Once approved, we craft your piece with certified lab grown diamonds and deliver it with full certification.',
                            },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: '#fff',
                                padding: '36px 28px',
                                borderRadius: '12px',
                                border: '1px solid var(--color-border-light, #E8E0D4)',
                                textAlign: 'center',
                                position: 'relative',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    top: '-16px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #C5A467, #F0D690)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    color: '#fff',
                                }}>{item.num}</div>
                                <div style={{ fontSize: '2.2rem', marginBottom: '16px', marginTop: '8px' }}>{item.icon}</div>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.15rem',
                                    fontWeight: 500,
                                    marginBottom: '12px',
                                    letterSpacing: '0.04em',
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 300,
                                    color: 'var(--color-text-light)',
                                    lineHeight: 1.8,
                                }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CUSTOMIZATION FORM ── */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="section-title">Tell Us What You Want</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle" style={{ maxWidth: '550px', margin: '0 auto 48px' }}>
                        Fill in your preferences and we&apos;ll get back to you with a personalized quote
                    </p>

                    {result && (
                        <div style={{
                            padding: '20px 24px',
                            marginBottom: '32px',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            background: result.success
                                ? 'linear-gradient(135deg, #F0FFF4, #C6F6D5)'
                                : 'linear-gradient(135deg, #FFF5F5, #FED7D7)',
                            color: result.success ? '#276749' : '#C53030',
                            border: `1px solid ${result.success ? '#9AE6B4' : '#FEB2B2'}`,
                            textAlign: 'center',
                        }}>
                            {result.success ? '✅' : '❌'} {result.message}
                            {result.success && (
                                <div style={{ marginTop: '12px' }}>
                                    <a
                                        href="https://wa.me/918076735450?text=Hi! I just submitted a customization request on your website"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-sm"
                                        style={{ display: 'inline-block', marginTop: '8px' }}
                                    >
                                        💬 Chat on WhatsApp for Faster Response
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Step indicators */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '12px',
                            marginBottom: '48px',
                        }}>
                            {[
                                { num: 1, label: 'Jewellery' },
                                { num: 2, label: 'Details' },
                                { num: 3, label: 'Contact' },
                            ].map(s => (
                                <button
                                    key={s.num}
                                    type="button"
                                    onClick={() => setStep(s.num)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 20px',
                                        borderRadius: '30px',
                                        border: step === s.num
                                            ? '2px solid #C5A467'
                                            : '1px solid rgba(197,164,103,0.2)',
                                        background: step === s.num
                                            ? 'linear-gradient(135deg, rgba(197,164,103,0.1), rgba(240,214,144,0.05))'
                                            : 'transparent',
                                        color: step === s.num ? '#C5A467' : '#999',
                                        fontSize: '0.78rem',
                                        fontWeight: step === s.num ? 600 : 400,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    <span style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        background: step >= s.num
                                            ? 'linear-gradient(135deg, #C5A467, #F0D690)'
                                            : 'rgba(197,164,103,0.15)',
                                        color: step >= s.num ? '#fff' : '#999',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                    }}>{s.num}</span>
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* ── Step 1: Jewellery Type ── */}
                        <div style={{ display: step === 1 ? 'block' : 'none' }}>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={labelStyle}>What type of jewellery do you want? *</label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                    gap: '12px',
                                }}>
                                    {[
                                        { label: 'Ring', icon: '💍' },
                                        { label: 'Solitaire Ring', icon: '💎' },
                                        { label: 'Engagement Ring', icon: '❤️' },
                                        { label: 'Necklace', icon: '📿' },
                                        { label: 'Pendant', icon: '🔶' },
                                        { label: 'Earrings', icon: '✨' },
                                        { label: 'Bracelet', icon: '⭕' },
                                        { label: 'Bangle', icon: '🟡' },
                                        { label: 'Nose Pin', icon: '💫' },
                                        { label: 'Mangalsutra', icon: '🪢' },
                                        { label: 'Other', icon: '🎁' },
                                    ].map(type => (
                                        <button
                                            key={type.label}
                                            type="button"
                                            onClick={() => handleChange('jewelleryType', type.label)}
                                            style={selectBtnStyle(formData.jewelleryType === type.label)}
                                        >
                                            <span style={{ fontSize: '1.2rem', display: 'block', marginBottom: '6px' }}>{type.icon}</span>
                                            {type.label}
                                            {formData.jewelleryType === type.label && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '6px',
                                                    right: '8px',
                                                    fontSize: '0.7rem',
                                                    color: '#C5A467',
                                                }}>✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="btn btn-primary"
                                    disabled={!formData.jewelleryType}
                                    style={{ opacity: formData.jewelleryType ? 1 : 0.5 }}
                                >
                                    Next: Specifications →
                                </button>
                            </div>
                        </div>

                        {/* ── Step 2: Specifications ── */}
                        <div style={{ display: step === 2 ? 'block' : 'none' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '28px',
                            }}>
                                {/* Metal Purity */}
                                <div>
                                    <label style={labelStyle}>Metal Purity</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {['9KT Gold', '14KT Gold', '18KT Gold', '22KT Gold', '925 Silver', 'Platinum'].map(metal => (
                                            <button
                                                key={metal}
                                                type="button"
                                                onClick={() => handleChange('metalPurity', metal)}
                                                style={selectBtnStyle(formData.metalPurity === metal)}
                                            >
                                                {metal}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Diamond Quality */}
                                <div>
                                    <label style={labelStyle}>Diamond Quality</label>
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        {[
                                            { label: 'VVS1 - E', tag: 'PREMIUM', tagColor: '#C5A467' },
                                            { label: 'VVS2 - F', tag: 'BEST', tagColor: '#38A169' },
                                            { label: 'VS1 - E', tag: 'VALUE', tagColor: '#8B7355' },
                                            { label: 'Not sure — Suggest me', tag: '', tagColor: '' },
                                        ].map(q => (
                                            <button
                                                key={q.label}
                                                type="button"
                                                onClick={() => handleChange('diamondQuality', q.label)}
                                                style={{
                                                    ...selectBtnStyle(formData.diamondQuality === q.label),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <span>{q.label}</span>
                                                {q.tag && (
                                                    <span style={{
                                                        fontSize: '0.6rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.08em',
                                                        textTransform: 'uppercase',
                                                        color: q.tagColor,
                                                        background: `${q.tagColor}15`,
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                    }}>{q.tag}</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Carat Weight */}
                                <div>
                                    <label style={labelStyle}>Diamond Carat Weight</label>
                                    <select
                                        value={formData.caratWeight}
                                        onChange={e => handleChange('caratWeight', e.target.value)}
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                    >
                                        <option value="">Select carat weight</option>
                                        <option value="0.10 Carat">0.10 Carat</option>
                                        <option value="0.15 Carat">0.15 Carat</option>
                                        <option value="0.20 Carat">0.20 Carat</option>
                                        <option value="0.25 Carat">0.25 Carat</option>
                                        <option value="0.30 Carat">0.30 Carat</option>
                                        <option value="0.40 Carat">0.40 Carat</option>
                                        <option value="0.50 Carat (½ ct)">0.50 Carat (½ ct)</option>
                                        <option value="0.70 Carat">0.70 Carat</option>
                                        <option value="1.00 Carat (1 ct)">1.00 Carat (1 ct)</option>
                                        <option value="1.50 Carat">1.50 Carat</option>
                                        <option value="2.00 Carat (2 ct)">2.00 Carat (2 ct)</option>
                                        <option value="Not sure — Suggest me">Not sure — Suggest me</option>
                                    </select>
                                </div>

                                {/* Ring Size — conditional */}
                                {showRingSize && (
                                    <div>
                                        <label style={labelStyle}>Ring Size</label>
                                        <select
                                            value={formData.ringSize}
                                            onChange={e => handleChange('ringSize', e.target.value)}
                                            style={{ ...inputStyle, cursor: 'pointer' }}
                                        >
                                            <option value="">Select ring size</option>
                                            {Array.from({ length: 18 }, (_, i) => i + 5).map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                            <option value="Not sure">Not sure — measure later</option>
                                        </select>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-light)',
                                            marginTop: '8px',
                                            lineHeight: 1.6,
                                        }}>
                                            💡 Tip: Wrap a thread around your finger, mark where it meets, and measure the length in mm.
                                            Divide by 3.14 to get your ring size (diameter in mm).
                                        </p>
                                    </div>
                                )}

                                {/* Budget Range */}
                                <div>
                                    <label style={labelStyle}>Budget Range</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {[
                                            '₹10,000 - ₹25,000',
                                            '₹25,000 - ₹50,000',
                                            '₹50,000 - ₹1,00,000',
                                            '₹1,00,000 - ₹2,00,000',
                                            '₹2,00,000+',
                                            'Flexible',
                                        ].map(range => (
                                            <button
                                                key={range}
                                                type="button"
                                                onClick={() => handleChange('budgetRange', range)}
                                                style={selectBtnStyle(formData.budgetRange === range)}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', flexWrap: 'wrap', gap: '12px' }}>
                                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                                    ← Back
                                </button>
                                <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
                                    Next: Your Details →
                                </button>
                            </div>
                        </div>

                        {/* ── Step 3: Contact Info ── */}
                        <div style={{ display: step === 3 ? 'block' : 'none' }}>
                            <div style={{
                                background: 'var(--color-bg-alt, #FDFBF7)',
                                padding: '36px',
                                borderRadius: '16px',
                                border: '1px solid rgba(197,164,103,0.15)',
                            }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.2rem',
                                    fontWeight: 500,
                                    marginBottom: '8px',
                                    letterSpacing: '0.04em',
                                    color: 'var(--color-text)',
                                }}>Almost there!</h3>
                                <p style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-light)',
                                    marginBottom: '28px',
                                    lineHeight: 1.6,
                                }}>
                                    We&apos;ll use these details to send you a personalized quote
                                </p>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '20px',
                                    marginBottom: '20px',
                                }}>
                                    <div>
                                        <label style={labelStyle}>Your Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => handleChange('phone', e.target.value)}
                                            placeholder="+91 XXXXX XXXXX"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Email (optional)</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => handleChange('email', e.target.value)}
                                            placeholder="your@email.com"
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={labelStyle}>Special Requirements or Design Reference</label>
                                    <textarea
                                        value={formData.specialRequirements}
                                        onChange={e => handleChange('specialRequirements', e.target.value)}
                                        placeholder="Describe any specific design, engraving, or share an image reference link..."
                                        rows={4}
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                    />
                                </div>

                                {/* Summary */}
                                {formData.jewelleryType && (
                                    <div style={{
                                        background: 'rgba(197,164,103,0.06)',
                                        padding: '20px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(197,164,103,0.15)',
                                        marginBottom: '24px',
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.12em',
                                            textTransform: 'uppercase',
                                            color: '#C5A467',
                                            marginBottom: '12px',
                                        }}>Your Selection Summary</h4>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                            gap: '8px',
                                            fontSize: '0.85rem',
                                        }}>
                                            {formData.jewelleryType && <div>🔹 <strong>Type:</strong> {formData.jewelleryType}</div>}
                                            {formData.metalPurity && <div>🔹 <strong>Metal:</strong> {formData.metalPurity}</div>}
                                            {formData.diamondQuality && <div>🔹 <strong>Diamond:</strong> {formData.diamondQuality}</div>}
                                            {formData.caratWeight && <div>🔹 <strong>Carat:</strong> {formData.caratWeight}</div>}
                                            {formData.ringSize && <div>🔹 <strong>Ring Size:</strong> {formData.ringSize}</div>}
                                            {formData.budgetRange && <div>🔹 <strong>Budget:</strong> {formData.budgetRange}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', flexWrap: 'wrap', gap: '12px' }}>
                                <button type="button" onClick={() => setStep(2)} className="btn btn-outline">
                                    ← Back
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-gold btn-lg"
                                    disabled={sending || !formData.name || !formData.phone || !formData.jewelleryType}
                                    style={{
                                        opacity: (sending || !formData.name || !formData.phone) ? 0.6 : 1,
                                        minWidth: '220px',
                                    }}
                                >
                                    {sending ? '⏳ Submitting...' : '💎 Submit Request'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* ── DIAMOND QUALITY GUIDE ── */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">Diamond Quality Guide</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle" style={{ maxWidth: '550px', margin: '0 auto 48px' }}>
                        Understanding the 4Cs — Cut, Clarity, Colour & Carat
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '24px',
                        maxWidth: '950px',
                        margin: '0 auto',
                    }}>
                        {[
                            {
                                icon: '✂️',
                                title: 'Cut',
                                text: 'The cut determines how brilliantly a diamond sparkles. We use only Ideal to Excellent cuts for maximum fire and brilliance.',
                            },
                            {
                                icon: '🔍',
                                title: 'Clarity',
                                text: 'VVS1 (Premium) has microscopic inclusions invisible even under 10x magnification. VS1 (Value) is eye-clean with great brilliance.',
                            },
                            {
                                icon: '🎨',
                                title: 'Colour',
                                text: 'D-E grade diamonds are near-colourless and most desirable. F grade offers excellent value with undetectable warmth.',
                            },
                            {
                                icon: '⚖️',
                                title: 'Carat Weight',
                                text: 'Carat measures the diamond\'s weight. A 1-carat diamond is approximately 6.5mm in diameter for a round brilliant cut.',
                            },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: '28px 24px',
                                border: '1px solid var(--color-border-light, #E8E0D4)',
                                borderRadius: '12px',
                                textAlign: 'center',
                                background: '#fff',
                            }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{item.icon}</div>
                                <h3 style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '1.05rem',
                                    fontWeight: 500,
                                    marginBottom: '8px',
                                    letterSpacing: '0.04em',
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 300,
                                    color: 'var(--color-text-light)',
                                    lineHeight: 1.7,
                                }}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{
                padding: '100px 0',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)',
                color: '#fff',
            }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: '#C5A467',
                        marginBottom: '20px',
                    }}>
                        Prefer to Talk?
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                        fontWeight: 300,
                        lineHeight: 1.3,
                        marginBottom: '24px',
                        letterSpacing: '0.04em',
                    }}>
                        Chat With Us on{' '}
                        <em style={{ fontStyle: 'italic', color: '#25D366' }}>WhatsApp</em>
                    </h2>
                    <p style={{
                        fontSize: '0.88rem',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.9,
                        marginBottom: '36px',
                    }}>
                        Want to discuss your custom jewellery in person? Our expert team is just a message away.
                        Share design references, ask about pricing, or get recommendations.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="https://wa.me/918076735450?text=Hi! I'd like to customize a jewellery piece"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-gold btn-lg"
                        >
                            💬 Chat on WhatsApp
                        </a>
                        <Link
                            href="/shop"
                            className="btn btn-outline btn-lg"
                            style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                        >
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* WhatsApp floating button */}
            <a
                href="https://wa.me/918076735450"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
                title="Chat on WhatsApp"
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            <Footer />

            {/* Sparkle animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
            `}</style>
        </>
    );
}

export default function CustomizePage() {
    return (
        <AuthProvider>
            <CartProvider>
                <CustomizePageContent />
            </CartProvider>
        </AuthProvider>
    );
}
