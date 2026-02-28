'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim() && !phone.trim()) {
            setError('Please enter an Order ID or your phone number.');
            return;
        }
        setLoading(true);
        setError('');
        setStatus(null);

        // For now, show a helpful message since order tracking 
        // will be connected once Razorpay goes live
        setTimeout(() => {
            setStatus({
                message: 'Order tracking will be available soon! For now, please contact us for order updates.',
                type: 'info',
            });
            setLoading(false);
        }, 1000);
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
                    <h1 className="section-title">Track Your Order</h1>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">Enter Your Order Details Below</p>

                    <div style={{
                        maxWidth: '520px',
                        margin: '48px auto 0',
                        background: 'var(--color-bg-alt, #FDFBF7)',
                        padding: '40px',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border, #E8E0D4)',
                    }}>
                        <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text)',
                                    marginBottom: '6px',
                                    letterSpacing: '0.05em',
                                }}>Order ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. order_ABC123XYZ"
                                    value={orderId}
                                    onChange={e => setOrderId(e.target.value)}
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

                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                color: 'var(--color-text-muted)',
                                fontWeight: 400,
                            }}>— or —</div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text)',
                                    marginBottom: '6px',
                                    letterSpacing: '0.05em',
                                }}>Phone Number</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value="+91"
                                        readOnly
                                        style={{
                                            width: '60px',
                                            padding: '12px 8px',
                                            border: '1px solid var(--color-border, #E8E0D4)',
                                            borderRadius: '6px',
                                            fontSize: '0.88rem',
                                            background: 'var(--color-bg)',
                                            color: 'var(--color-text)',
                                            textAlign: 'center',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        maxLength={10}
                                        style={{
                                            flex: 1,
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
                            </div>

                            {error && (
                                <p style={{
                                    color: '#e53e3e',
                                    fontSize: '0.82rem',
                                    margin: 0,
                                    padding: '8px 12px',
                                    background: '#fff5f5',
                                    borderRadius: '6px',
                                    border: '1px solid #fed7d7',
                                }}>{error}</p>
                            )}

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Searching...' : 'Track Order'}
                            </button>
                        </form>

                        {status && (
                            <div style={{
                                marginTop: '24px',
                                padding: '20px',
                                background: status.type === 'info' ? '#EBF8FF' : '#F0FFF4',
                                border: `1px solid ${status.type === 'info' ? '#BEE3F8' : '#C6F6D5'}`,
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}>
                                <p style={{
                                    fontSize: '0.88rem',
                                    color: status.type === 'info' ? '#2B6CB0' : '#276749',
                                    margin: '0 0 16px',
                                    lineHeight: '1.6',
                                }}>{status.message}</p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <a
                                        href="mailto:noore.jewels55@gmail.com?subject=Order%20Status%20Inquiry"
                                        className="btn btn-outline"
                                        style={{ fontSize: '0.8rem', padding: '10px 20px' }}
                                    >
                                        📧 Email Us
                                    </a>
                                    <a
                                        href="https://wa.me/919217945235?text=Hi! I want to check my order status."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.8rem', padding: '10px 20px', background: '#25D366', borderColor: '#25D366' }}
                                    >
                                        💬 WhatsApp
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FAQ Section */}
                    <div style={{
                        maxWidth: '520px',
                        margin: '48px auto 0',
                    }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            color: 'var(--color-text)',
                            marginBottom: '20px',
                            textAlign: 'center',
                            letterSpacing: '0.05em',
                        }}>Frequently Asked Questions</h2>

                        {[
                            {
                                q: 'Where do I find my Order ID?',
                                a: 'Your Order ID is sent to your email and WhatsApp after a successful purchase. It starts with "order_".',
                            },
                            {
                                q: 'How long does delivery take?',
                                a: 'We typically deliver within 5-7 business days across India. Metro cities may receive orders in 3-5 days.',
                            },
                            {
                                q: 'Can I change my delivery address?',
                                a: 'Please contact us via WhatsApp or email within 24 hours of placing your order to update the address.',
                            },
                        ].map((faq, i) => (
                            <div key={i} style={{
                                background: 'var(--color-bg-alt, #FDFBF7)',
                                padding: '20px 24px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border, #E8E0D4)',
                                marginBottom: '12px',
                            }}>
                                <div style={{
                                    fontWeight: 500,
                                    fontSize: '0.88rem',
                                    color: 'var(--color-text)',
                                    marginBottom: '8px',
                                }}>{faq.q}</div>
                                <div style={{
                                    fontSize: '0.82rem',
                                    color: 'var(--color-text-light)',
                                    lineHeight: '1.6',
                                }}>{faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default function TrackOrder() {
    return (
        <AuthProvider>
            <CartProvider>
                <TrackOrderPage />
            </CartProvider>
        </AuthProvider>
    );
}
