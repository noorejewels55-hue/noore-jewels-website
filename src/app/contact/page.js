'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setResult(null);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            setResult({ success: data.success, message: data.message });

            if (data.success) {
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (err) {
            setResult({ success: false, message: 'Failed to send message. Please try WhatsApp.' });
        }
        setSending(false);
    };

    return (
        <>
            <Navbar />
            <AuthModal />
            <CartDrawer />

            <section style={{
                padding: '120px 0 80px',
                background: 'var(--color-bg)',
                minHeight: '100vh',
            }}>
                <div className="container">
                    <h1 className="section-title">Contact Us</h1>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">We&apos;d Love to Hear From You</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '48px',
                        marginTop: '48px',
                        maxWidth: '900px',
                        margin: '48px auto 0',
                    }}>
                        {/* Contact Info */}
                        <div style={{
                            background: 'var(--color-bg-alt, #FDFBF7)',
                            padding: '40px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border, #E8E0D4)',
                        }}>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.3rem',
                                fontWeight: 500,
                                color: 'var(--color-text)',
                                marginBottom: '24px',
                                letterSpacing: '0.05em',
                            }}>Get in Touch</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>📧</span>
                                    <div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px', fontSize: '0.9rem' }}>Email</div>
                                        <a href="mailto:noore.jewels55@gmail.com" style={{
                                            color: 'var(--color-accent, #C5A467)',
                                            textDecoration: 'none',
                                            fontSize: '0.88rem',
                                            fontWeight: 400,
                                        }}>noore.jewels55@gmail.com</a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>💬</span>
                                    <div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px', fontSize: '0.9rem' }}>WhatsApp</div>
                                        <a href="https://wa.me/918076735450" target="_blank" rel="noopener noreferrer" style={{
                                            color: 'var(--color-accent, #C5A467)',
                                            textDecoration: 'none',
                                            fontSize: '0.88rem',
                                            fontWeight: 400,
                                        }}>+91 80767 35450</a>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>📍</span>
                                    <div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px', fontSize: '0.9rem' }}>Location</div>
                                        <span style={{ color: 'var(--color-text-light)', fontSize: '0.88rem' }}>India</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>🕐</span>
                                    <div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px', fontSize: '0.9rem' }}>Response Time</div>
                                        <span style={{ color: 'var(--color-text-light)', fontSize: '0.88rem' }}>Within 24 hours</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--color-border, #E8E0D4)' }}>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text)',
                                    marginBottom: '12px',
                                    letterSpacing: '0.05em',
                                }}>Follow Us</h3>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <a href="https://www.instagram.com/noore.jewels/" target="_blank" rel="noopener noreferrer" style={{
                                        color: 'var(--color-text-light)',
                                        textDecoration: 'none',
                                        fontSize: '0.85rem',
                                        transition: 'color 0.3s',
                                    }}>Instagram</a>
                                    <a href="https://wa.me/918076735450" target="_blank" rel="noopener noreferrer" style={{
                                        color: 'var(--color-text-light)',
                                        textDecoration: 'none',
                                        fontSize: '0.85rem',
                                        transition: 'color 0.3s',
                                    }}>WhatsApp</a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{
                            background: 'var(--color-bg-alt, #FDFBF7)',
                            padding: '40px',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border, #E8E0D4)',
                        }}>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.3rem',
                                fontWeight: 500,
                                color: 'var(--color-text)',
                                marginBottom: '24px',
                                letterSpacing: '0.05em',
                            }}>Send a Message</h2>

                            {result && (
                                <div style={{
                                    padding: '12px 16px',
                                    marginBottom: '16px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: 500,
                                    background: result.success ? '#F0FFF4' : '#FFF5F5',
                                    color: result.success ? '#38A169' : '#E53E3E',
                                    border: `1px solid ${result.success ? '#C6F6D5' : '#FED7D7'}`,
                                }}>
                                    {result.success ? '✅' : '❌'} {result.message}
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit}
                                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                            >
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        color: 'var(--color-text)',
                                        marginBottom: '6px',
                                        letterSpacing: '0.05em',
                                    }}>Your Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Enter your name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid var(--color-border, #E8E0D4)',
                                            borderRadius: '6px',
                                            fontSize: '0.88rem',
                                            background: 'var(--color-bg)',
                                            color: 'var(--color-text)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        color: 'var(--color-text)',
                                        marginBottom: '6px',
                                        letterSpacing: '0.05em',
                                    }}>Your Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="your@email.com"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid var(--color-border, #E8E0D4)',
                                            borderRadius: '6px',
                                            fontSize: '0.88rem',
                                            background: 'var(--color-bg)',
                                            color: 'var(--color-text)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        color: 'var(--color-text)',
                                        marginBottom: '6px',
                                        letterSpacing: '0.05em',
                                    }}>Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="How can we help you?"
                                        rows={5}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid var(--color-border, #E8E0D4)',
                                            borderRadius: '6px',
                                            fontSize: '0.88rem',
                                            background: 'var(--color-bg)',
                                            color: 'var(--color-text)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ marginTop: '8px', opacity: sending ? 0.7 : 1 }}
                                    disabled={sending}
                                >
                                    {sending ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default function Contact() {
    return (
        <AuthProvider>
            <CartProvider>
                <ContactPage />
            </CartProvider>
        </AuthProvider>
    );
}
