'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';

function CustomizePageContent() {
    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            {/* Hero Banner */}
            <section style={{
                padding: 'clamp(60px, 12vw, 120px) 0',
                textAlign: 'center',
                background: 'var(--color-bg-alt)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div className="container">
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: 'var(--color-gold)',
                        marginBottom: '20px',
                    }}>
                        Bespoke Creations
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 300,
                        lineHeight: 1.2,
                        color: 'var(--color-text)',
                        marginBottom: '24px',
                        letterSpacing: '0.04em',
                    }}>
                        Customize Your <em style={{ color: 'var(--color-gold)', fontStyle: 'italic' }}>Dream Ring</em>
                    </h1>
                    <p style={{
                        fontSize: '0.92rem',
                        fontWeight: 300,
                        color: 'var(--color-text-light)',
                        lineHeight: 1.9,
                        maxWidth: '600px',
                        margin: '0 auto 40px',
                    }}>
                        Choose your diamond shape, select the metal purity, pick your favourite
                        setting — and watch your dream ring come to life. From solitaire engagement rings
                        to custom pendants, we craft it all.
                    </p>

                    {/* Features */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        flexWrap: 'wrap',
                        marginBottom: '48px',
                    }}>
                        {[
                            { image: '/custom-diamond-shapes.png', title: '8+ Diamond Shapes', desc: 'Round, Oval, Emerald, Pear & more' },
                            { image: '/custom-igi-cert.png', title: 'IGI Certified', desc: 'Every diamond comes certified' },
                            { image: '/custom-gold-types.png', title: '9kt, 14kt, 18kt Gold', desc: 'Yellow, Rose & White Gold' },
                            { image: '/custom-luxury-box.png', title: 'Made-to-Order', desc: 'Delivered in 3 weeks' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                textAlign: 'center',
                                flex: '0 1 220px',
                                padding: '16px 16px 24px',
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border-light)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '140px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    marginBottom: '16px',
                                    border: '1px solid rgba(197, 164, 103, 0.15)',
                                    position: 'relative'
                                }}>
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            display: 'block'
                                        }} 
                                    />
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text)',
                                    marginBottom: '6px',
                                }}>{item.title}</div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 300,
                                    color: 'var(--color-text-light)',
                                }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href="https://wa.me/918076735450?text=Hi! I want to customize a diamond ring"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-lg"
                        >
                            💬&nbsp;&nbsp;Chat on WhatsApp to Customize
                        </a>
                        <Link href="/shop" className="btn btn-outline btn-lg">
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '80px 0', background: 'var(--color-bg)' }}>
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">Simple 4-Step Process</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '32px',
                        maxWidth: '1000px',
                        margin: '0 auto',
                    }}>
                        {[
                            { step: '01', title: 'Choose Shape', desc: 'Select from Round, Oval, Emerald, Pear, Cushion, Princess & more diamond shapes.' },
                            { step: '02', title: 'Pick Metal', desc: 'Choose 9kt, 14kt, or 18kt gold in Yellow, Rose, or White Gold. All BIS hallmarked.' },
                            { step: '03', title: 'Select Setting', desc: 'Pick your ring style — Classic Solitaire, Halo, Pavé, Vintage, or Three-Stone.' },
                            { step: '04', title: 'We Craft It', desc: 'Your custom piece is handcrafted and delivered within 3 weeks with full IGI certification.' },
                        ].map((item, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '24px 16px' }}>
                                <div style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '2.5rem',
                                    fontWeight: 300,
                                    color: 'var(--color-gold)',
                                    marginBottom: '16px',
                                    letterSpacing: '0.04em',
                                }}>{item.step}</div>
                                <div style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text)',
                                    marginBottom: '12px',
                                }}>{item.title}</div>
                                <p style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 300,
                                    color: 'var(--color-text-light)',
                                    lineHeight: 1.8,
                                }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WhatsApp CTA */}
            <section style={{
                padding: '60px 0',
                textAlign: 'center',
                background: 'var(--color-bg-dark)',
                color: '#fff',
            }}>
                <div className="container">
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        fontWeight: 300,
                        color: '#fff',
                        marginBottom: '16px',
                        letterSpacing: '0.06em',
                    }}>
                        Ready to Create Your Dream Ring?
                    </h2>
                    <p style={{
                        fontSize: '0.85rem',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.6)',
                        maxWidth: '500px',
                        margin: '0 auto 32px',
                        lineHeight: 1.8,
                    }}>
                        Our jewellery experts will guide you through every step. Share your vision and we&apos;ll bring it to life.
                    </p>
                    <a
                        href="https://wa.me/918076735450?text=Hi! I want to customize a diamond ring"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-lg"
                    >
                        💬&nbsp;&nbsp;Start on WhatsApp
                    </a>
                </div>
            </section>

            <Footer />
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
